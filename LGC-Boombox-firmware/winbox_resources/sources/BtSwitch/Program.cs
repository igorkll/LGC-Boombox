using System;
using System.Threading.Tasks;
using Windows.Devices.Radios;

class Program
{
    static async Task Main()
    {
        var radios = await Radio.GetRadiosAsync();
        foreach (var radio in radios)
        {
            if (radio.Kind == RadioKind.Bluetooth)
            {
                Console.WriteLine($"Bluetooth найден: {radio.Name}, статус: {radio.State}");

                if (radio.State == RadioState.Off)
                {
                    await radio.SetStateAsync(RadioState.On);
                    Console.WriteLine("Bluetooth включён.");
                }
                else
                {
                    await radio.SetStateAsync(RadioState.Off);
                    Console.WriteLine("Bluetooth выключен.");
                }
            }
        }
    }
}