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
    static void Main()
    {
        var enumerator = new MMDeviceEnumerator();
        var device = enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Console);

        Console.WriteLine($"Using device: {device.FriendlyName}");

        using var capture = new WasapiLoopbackCapture(device);
        Console.WriteLine($"Capture format: {capture.WaveFormat.Encoding}, {capture.WaveFormat.SampleRate} Hz, {capture.WaveFormat.Channels} ch, {capture.WaveFormat.BitsPerSample} bit");

        capture.DataAvailable += (s, data) =>
        {
            float[] waves = getWaves(data.Buffer, data.BytesRecorded, capture.WaveFormat, 0, 4000, 7);
            debugWaves(waves, 1, 6);
        };

        capture.RecordingStopped += (s, a) => Console.WriteLine("Recording stopped");

        capture.StartRecording();
        Console.WriteLine("Press Enter to stop...");
        Console.ReadLine();
        capture.StopRecording();
    }




    const int FftSize = 1024;
    const int HopSize = FftSize / 2;

    static RealFft _fft = new RealFft(FftSize);
    static float[] _window = Window.OfType(WindowType.Hann, FftSize);
    static float[] _frame = new float[FftSize];
    static float[] _re = new float[FftSize];
    static float[] _im = new float[FftSize];

    static List<float> _monoBuffer = new List<float>(FftSize * 4);

    static float[]? getWaves(byte[] Buffer, int BytesRecorded, WaveFormat waveFormat,
                         double fMin, double fMax, int bandsCount)
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
            return new float[bandsCount];
        }

        float[]? bands = new float[bandsCount];

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

            int sampleRate = waveFormat.SampleRate;

            // === фильтруем по диапазону частот ===
            int kMin = (int)(fMin * FftSize / sampleRate);
            int kMax = (int)(fMax * FftSize / sampleRate);
            if (kMax > FftSize / 2) kMax = FftSize / 2;
            if (kMin < 1) kMin = 1;   // игнорируем DC-бин

            int binsInRange = kMax - kMin;
            if (binsInRange <= 0) return null;

            int binsPerBand = Math.Max(1, binsInRange / bandsCount);

            float maxVal = 0;

            for (int b = 0; b < bandsCount; b++)
            {
                int start = kMin + b * binsPerBand;
                int end = (b == bandsCount - 1) ? kMax : start + binsPerBand;

                double sum = 0;
                for (int k = start; k < end; k++)
                {
                    double mag = Math.Sqrt(_re[k] * _re[k] + _im[k] * _im[k]);
                    sum += mag;
                }
                float val = (float)(sum / (end - start));
                bands[b] = val;
                if (val > maxVal) maxVal = val;
            }

            if (maxVal > 0)
            {
                for (int b = 0; b < bandsCount; b++)
                    bands[b] /= maxVal;
            }

            _monoBuffer.RemoveRange(0, HopSize);
        }

        return bands;
    }

    static void debugWaves(float[] waves, int startWave, int wavesCount)
    {
        Console.WriteLine("-----");
        for (int b = startWave; b < (startWave + wavesCount); b++)
        {
            //double fStart = (sampleRate / (double)FftSize) * (kMin + b * binsPerBand);
            //double fEnd = (sampleRate / (double)FftSize) * (kMin + (b + 1) * binsPerBand);
            //Console.WriteLine($"{fStart:0}-{fEnd:0} Hz : {bands[b]:0.0000}");
            Console.WriteLine($"{b} {string.Concat(Enumerable.Repeat('*', (int)Math.Round(waves[b] * 30)))}");
        }
    }
}
