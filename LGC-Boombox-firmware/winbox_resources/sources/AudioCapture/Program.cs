using NAudio.CoreAudioApi;
using NAudio.Wave;
using System;
using System.Data;

class Program
{
    static void Main()
    {
        // Получаем дефолтное устройство вывода
        var enumerator = new MMDeviceEnumerator();
        var device = enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Console);

        Console.WriteLine($"Using device: {device.FriendlyName}");

        // Создаём loopback захват
        using (var capture = new WasapiLoopbackCapture(device))
        {
            capture.DataAvailable += (s, a) =>
            {
                // a.Buffer содержит PCM данные
                Console.WriteLine($"Captured {a.BytesRecorded} bytes");
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
}
