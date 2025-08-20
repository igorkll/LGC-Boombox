using NAudio.CoreAudioApi;
using NAudio.Wave;
using NWaves.Audio;
using NWaves.Transforms;
using NWaves.Windows;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using WaveFormat = NAudio.Wave.WaveFormat;

class Program
{
    const int FftSize = 1024;
    const int HopSize = FftSize / 2;

    static RealFft _fft = new RealFft(FftSize);
    static float[] _window = Window.OfType(WindowType.Hann, FftSize);
    static float[] _frame = new float[FftSize];
    static float[] _re = new float[FftSize];
    static float[] _im = new float[FftSize];

    static List<float> _monoBuffer = new List<float>(FftSize * 4);

    static void Main()
    {
        var enumerator = new MMDeviceEnumerator();
        var device = enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Console);

        Console.WriteLine($"Using device: {device.FriendlyName}");

        using var capture = new WasapiLoopbackCapture(device);
        Console.WriteLine($"Capture format: {capture.WaveFormat.Encoding}, {capture.WaveFormat.SampleRate} Hz, {capture.WaveFormat.Channels} ch, {capture.WaveFormat.BitsPerSample} bit");

        capture.DataAvailable += (s, data) =>
        {
            getWaves(data.Buffer, data.BytesRecorded, capture.WaveFormat);
        };

        capture.RecordingStopped += (s, a) => Console.WriteLine("Recording stopped");

        capture.StartRecording();
        Console.WriteLine("Press Enter to stop...");
        Console.ReadLine();
        capture.StopRecording();
    }

    static float[]? getWaves(byte[] Buffer, int BytesRecorded, WaveFormat waveFormat)
    {
        int channels = waveFormat.Channels;

        if (waveFormat.Encoding == WaveFormatEncoding.IeeeFloat && waveFormat.BitsPerSample == 32)
        {
            int floatCount = BytesRecorded / 4;
            unsafe
            {
                fixed (byte* pBytes = Buffer)
                {
                    float* pFloats = (float*)pBytes;

                    int samplesPerChannel = floatCount / channels;
                    for (int i = 0; i < samplesPerChannel; i++)
                    {
                        float sum = 0f;
                        int baseIdx = i * channels;
                        for (int ch = 0; ch < channels; ch++)
                            sum += pFloats[baseIdx + ch];

                        _monoBuffer.Add(sum / channels);
                    }
                }
            }
        }
        else if (waveFormat.Encoding == WaveFormatEncoding.Pcm && waveFormat.BitsPerSample == 16)
        {
            int totalSamples = BytesRecorded / 2;
            int samplesPerChannel = totalSamples / channels;
            for (int i = 0; i < samplesPerChannel; i++)
            {
                int baseByte = i * channels * 2;
                int sum = 0;
                for (int ch = 0; ch < channels; ch++)
                {
                    short s16 = BitConverter.ToInt16(Buffer, baseByte + ch * 2);
                    sum += s16;
                }
                _monoBuffer.Add((sum / (float)channels) / 32768f);
            }
        }
        else
        {
            return null;
        }

        // Обрабатываем, пока хватает сэмплов на один кадр
        while (_monoBuffer.Count >= FftSize)
        {
            // копируем FftSize сэмплов в кадр
            for (int i = 0; i < FftSize; i++)
                _frame[i] = _monoBuffer[i] * _window[i];

            // FFT
            Array.Clear(_re, 0, _re.Length);
            Array.Clear(_im, 0, _im.Length);
            _fft.Direct(_frame, _re, _im);

            // посчитаем несколько первых бинов для демонстрации
            int sampleRate = waveFormat.SampleRate;
            int binsToPrint = 20;
            for (int k = 0; k < binsToPrint; k++)
            {
                double freq = (double)sampleRate / FftSize * k;
                double mag = Math.Sqrt(_re[k] * _re[k] + _im[k] * _im[k]);
                Console.WriteLine($"{freq,7:0} Hz : {mag:0.0000}");
            }
            Console.WriteLine("-----");

            // сдвигаем буфер на HopSize
            _monoBuffer.RemoveRange(0, HopSize);
        }

        return [];
    }
}
