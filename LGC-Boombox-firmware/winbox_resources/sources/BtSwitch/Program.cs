using System;
using System.Threading.Tasks;
using System.Xml.Linq;
using Windows.Devices.Radios;

class Program
{
    static async Task Main(string[] args)
    {
        var radios = await Radio.GetRadiosAsync();

        if (isFlagExists(args, "--enable")) {
            bool state = getFlagState(args, "--enable");

            foreach (var radio in radios)
            {
                if (radio.Kind == RadioKind.Bluetooth)
                {
                    Console.WriteLine($"bluetooth: {radio.Name}");
                    Console.WriteLine($"result: {await radio.SetStateAsync(state ? RadioState.On : RadioState.Off)}");
                }
            }
        }
    }

    static string? GetArgValue(string[] args, string name)
    {
        int index = Array.IndexOf(args, name);
        if (index >= 0 && index < args.Length - 1)
            return args[index + 1];
        return null;
    }

    static bool getFlagState(string[] args, string name)
    {
        return bool.TryParse(GetArgValue(args, name), out bool enableValue);
    }

    static bool isFlagExists(string[] args, string name)
    {
        return Array.Exists(args, arg => arg == name);
    }
}
