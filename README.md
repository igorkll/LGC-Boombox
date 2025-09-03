# LGC Boombox
* this speaker has a touchscreen display and runs on a redesigned Windows 10
* WARNING! download the release, not the master branch. I'm doing a project in this branch, and there will probably be an unstable version, possibly completely broken
* don't expect outstanding sound quality from this speaker. Also, an old motherboard from a tonk thin client will drain the battery quickly. my speaker runs for ~2 hours on a single charge

## size
* height - 17
* width - 37
* length - 8

## software required for assembly
* winbox maker (my tool for creating an embedded version of windows): https://github.com/igorkll/WinBox-Maker/releases
* visual studio with tools for building C++ and C#
* nodeJS
* openSCAD
* windows 10 enterprise / windows 10 iot enterprise - iso image
* ESP-IDF 5.3 for ESP32C3 firmware and firmware compilation

## tools required for assembly
* a computer with 64-bit windows 10/11
* 3d printer with a print area of >=20 centimeters
* a screwdriver that fits your screws

## components required for assembly
* kilogram coil PLA plate (you can use other plastic at your discretion)
* the motherboard of a thin client is a tonk TN1700/TN1200 thin client or another of the same size (a new one costs ~400-500 dollars, it sells for ~4-7 dollars on the used market in Russia)
* A 5-inch HDMI touchscreen display with a resolution of 800x480. The touchscreen is usually connected via USB
* two USB cables for powering the matrix and touchscreen
* DVI>HDMI adapter
* cable HDMI>MICRO HDMI
* the case is printed on a 3D printer
* two speakers that fit the size of the holes in the housing
* amplifiers / one two-channel amplifier
* accumulators and charging scheme
* two buttons (one with locking)
* input power and AUX
* USB hub with 4 ports
* esp32c3
* addressable LED strip (two pieces, the length of which will be enough to wrap it around the column as shown in the pictures on all sides except the bottom)
* wires to connect all this crap
* self-tapping screws for assembly
* hot glue for fixing parts inside
* A 12.6 Volt charger (NOT A 12 VOLT POWER SUPPLY!! OTHERWISE, IGNITION IS POSSIBLE)
* USB cable for connecting ESP32C3
* USB bluetooth adapter
* self-tapping screws that fit the holes in the printed case

## assembly process
### building a modified version of windows 10
* open the "LGC-Boombox-firmware" project in winbox maker
* in the "base" tab, select the path to the origin of the downloaded windows 10 image. if your image is not windows 10 enterprise or windows 10 iot enterprise, make sure that the "force make iot enterprise" checkbox is checked, otherwise the "login" window will be visible
* go to the settings>activation tab and enter the license key from your windows edition, and make sure that the "Activate windows with this product key" checkmark is set 😅
* please note that if you used the "force make iot enterprise" option, then you need to use the iot enterprise key
* go to the project directory or just click on the "Open Project Folder" button