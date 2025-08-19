using CommandLine;
using InTheHand.Net.Bluetooth;
using InTheHand.Net.Sockets;
using Windows.Devices.Enumeration;
using Windows.Media.Audio;

namespace A2DPSink;

class Program
{
    static async Task Main()
    {
        //I will change this code a bit as I need it to work automatically.
        for (;;)
        {
            Console.Write("Scanning for devices");

            DeviceInformation? device;

            while ((device = await FindPairedDevice()) is null)
            {
                Console.Write(".");

                await Task.Delay(100);
            }

            Console.WriteLine($"\nDevice {device.Name} found. [Id: {device.Id}]");

            Console.WriteLine($"Connecting to device...");

            try
            {
                await ConnectToDevice(device);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect: {ex.Message}");

                await Task.Delay(100);
            }
        }
    }

    private static async Task<DeviceInformation?> FindPairedDevice()
    {
        var deviceSelector = AudioPlaybackConnection.GetDeviceSelector();
        var devices = await DeviceInformation.FindAllAsync(deviceSelector);

        return devices.FirstOrDefault(device =>
            device.IsEnabled);
    }

    private static async Task ConnectToDevice(DeviceInformation device)
    {
        var connection = AudioPlaybackConnection.TryCreateFromId(device.Id) ??
            throw new InvalidOperationException($"Failed to create AudioPlaybackConnection");

        var promise = new TaskCompletionSource();

        connection.StateChanged += Connection_StateChanged;

        await connection.StartAsync();

        var result = await connection.OpenAsync();

        if (result.Status != AudioPlaybackConnectionOpenResultStatus.Success)
        {
            throw new InvalidOperationException($"Failed to open AudioPlaybackConnection: {result.Status}");
        }

        Console.WriteLine($"Successfully connected.");

        void Connection_StateChanged(AudioPlaybackConnection sender, object args)
        {
            if (sender.State == AudioPlaybackConnectionState.Closed)
            {
                promise.SetResult();

                connection.StateChanged -= Connection_StateChanged;
            }
        }

        await promise.Task;
    }

}

