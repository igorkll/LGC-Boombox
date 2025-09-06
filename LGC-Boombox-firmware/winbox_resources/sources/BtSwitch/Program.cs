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
                Console.WriteLine($"Bluetooth найден: {radio.Name}, текущий статус: {radio.State}");

                RadioState newState = radio.State == RadioState.On ? RadioState.Off : RadioState.On;
                var result = await radio.SetStateAsync(newState);

                // Выводим результат в консоль
                Console.WriteLine($"Попытка переключить на {newState} вернула: {result}");
            }
        }
    }
}
