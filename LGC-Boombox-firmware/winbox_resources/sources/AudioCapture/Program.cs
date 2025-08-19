using NAudio.CoreAudioApi;
using NAudio.Wave;
using NWaves.Features;
using NWaves.Signals;
using NWaves.Transforms;
using System;
using System.Data;
using System.Linq;
using System.Numerics;
using System.Text.RegularExpressions;

class Program
{
    static int fftSize = 1024;

    static void Main()
    {
        var enumerator = new MMDeviceEnumerator();
        var device = enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Console);

        Console.WriteLine($"Using device: {device.FriendlyName}");

        using (var capture = new WasapiLoopbackCapture(device))
        {
            capture.DataAvailable += (s, a) =>
            {
                DiscreteSignal spectrum = getSpectrum(a.Buffer, a.BytesRecorded, capture.WaveFormat.SampleRate);

                int sampleRate = capture.WaveFormat.SampleRate;
                for (int i = 0; i < spectrum.Length; i++)
                {
                    double freq = i * (double)sampleRate / fftSize;
                    double amplitude = spectrum[i];
                    Console.WriteLine($"{freq:F0} Hz : {amplitude:F4}");
                }

                Console.WriteLine("-----");
            };

            capture.RecordingStopped += (s, a) =>
            {
                Console.WriteLine("Recording stopped");
            };

            capture.StartRecording();
            Console.WriteLine("Press Enter to stop...");
            Console.ReadLine();
            capture.StopRecording();
        }
    }

    static DiscreteSignal getSpectrum(byte[] inputBuffer, int inputBufferSize, int sampleRate)
    {
        float[] samples = new float[inputBufferSize / 2];
        for (int i = 0; i < samples.Length; i++)
        {
            short sample16 = BitConverter.ToInt16(inputBuffer, i * 2);
            samples[i] = sample16 / 32768f;
        }

        int len = Math.Min(fftSize, samples.Length);
        float[] buffer = new float[fftSize];
        Array.Copy(samples, buffer, len);

        DiscreteSignal signal = new DiscreteSignal(sampleRate, buffer);
        Fft fft = new Fft(fftSize);
        return fft.PowerSpectrum(signal);
    }
}
