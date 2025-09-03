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
* nodeJS (don't forget to check the box in the NodeJS installer so that it downloads all dependencies)
* openSCAD
* rufus
* windows 10 enterprise / windows 10 iot enterprise - iso image
* ESP-IDF 5.3 for ESP32C3 firmware and firmware compilation
* visual studia code with the esp-idf extension
* a slicer configured for your 3d printer (I use cura, but you can use any other one)

## tools required for assembly
* a computer with 64-bit windows 10/11
* 3d printer with a print area of >=20 centimeters (i am using anycubic kobra 2 pro)
* a screwdriver that fits your screws
* hot glue gun or lighter
* multimeter

## the skills needed to build
* be able to follow instructions
* be able to find solutions to problems on Google or ask the neural network
* computer and windows proficiency is at a good level
* windows installation skill
* soldering skill
* be able to use a 3D printer (this also includes configuring the slicer)
* multimeter skills

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
* balancing board for three lithium-ion batteries
* three lithium-ion batteries with a capacity of at least 4000 milliamps per piece (18650 cannot provide such a capacity! you need a wider battery)
* two compartments for fuse
* two 3 amp fuses
* cut AUX wire for soldering to AUX connector
* a whole AUX wire (if the amplifier has an AUX input) or a cut-off one (if there is none)

## the conditions required for the assembly
* the ability to produce 3D printing lasting up to 10 hours (usually printing the largest parts takes about 6-7 hours, the time is taken with a margin and it differs for different printers)
* a clean table on which to solder
* an open window without an anti-mosquito net where you can throw the speaker and/or battery in case of fire (the window should be FULLY open, not for ventilation)

## assembly process

### building a modified version of windows 10
* open the "LGC-Boombox-firmware" project in winbox maker
* in the "base" tab, select the path to the origin of the downloaded windows 10 image. if your image is not windows 10 enterprise or windows 10 iot enterprise, make sure that the "force make iot enterprise" checkbox is checked, otherwise the "login" window will be visible
* go to the settings>activation tab and enter the license key from your windows edition, and make sure that the "Activate windows with this product key" checkmark is set 😅
* please note that if you used the "force make iot enterprise" option, then you need to use the iot enterprise key
* go to the project directory or just click on the "Open Project Folder" button
* download the driver for your processor's video core. if it is the intel installer, then put it in the winbox_resources/intel_drivers directory, and if the driver is in its raw form, then put it in the winbox_resources/drivers directory
* download the driver for your Bluetooth adapter (if it requires a driver) and if it is an installer, then put it in the winbox_resources>driver_installers directory (perhaps winbox maker will be able to extract the contents) and if the driver is in its raw form, then put it in winbox_resources/drivers
* export the iso installer of the resulting system
* burn the iso to a 16 GB flash drive using rufus in MBR mode AND DO NOT USE ANY IMAGE MODIFICATIONS USING RUFUS! as this may lead to a conflict with the modifications that winbox maker uses
* next, install it on your motherboard like a regular Windows and BE SURE to wait for the speaker interface to appear and do not turn off the board until it appears. it may take a couple of hours since the board is quite weak (subsequent power-ups will take ~ 30 seconds). After the interface appears, wait for about 10 more minutes and then turn off the board by clicking the off button in the speaker interface

### esp32c3 firmware
* open the led_strip_esp32c3_firmware directory in vs code
* make sure that the extension for esp-IDF recognizes the open project
* select the esp32c3 chip and the COM port it is on
* open the main/config.h file and configure config to suit your case (first of all, the number of LEDs, and remove the comment from the "#define USE_UART" line if your board has a USB>UART bridge in a separate chip)
* flash the ESP32C3 by clicking on the fire symbol at the bottom
* if you have a question about choosing a firmware tool, choose UART
* if the board does not flash, try connecting it to computers with the boot button pressed

### preparing files for case printing
#### the stl files are already in the repository, but if you need to change any settings, you will need OpenSCAD
#### you will need to open each file in OpenSCAD, then enter the necessary parameters, make a render using the F6 key, and then export it in a format that suits you and upload it to a slicer
* back.scad - you need to export twice with the parameter right - true and false
* body.scad - you need to export twice with the parameter right - true and false
* front.scad - the left and right parts are absolutely identical, just export
* handle.scad - you only need one piece
* logo.scad - you need 5 pieces. you can also replace the text with your own

### case printing
#### (for PLA) all details except the pen are printed at 20% filling, the pen at 40% (60% is better)
* back.scad - print two details but from different stl files with different bool status of the "right" flag
* body.scad - print two details but from different stl files with different bool status of the "right" flag
* handle.scad - it must be printed with at least 40 percent infill, otherwise the handle will break and fall off
* front.scad - print two identical pieces
* logo.scad - you can change the text on the logo if you want. It is also not just a logo, but a fastener that helps hold the case. 5 pieces must be printed. in order for the text to be clearly distinguishable, it should be printed with improved quality. It took me about 3 hours to print 5 pieces at once

### the case assembly process
* pay special attention to the handle, it must be tightly screwed onto 4 screws on each side. if it is printed with less than 40 percent filling and/or screwed on one side with less than 4 screws, it is likely to break and fall off
* first of all, screw on the handle and legs, as it may be inconvenient to do this after installing the electronics
* the legs can be screwed both externally and internally. this is done because I added the legs to the project late when I had already assembled everything
* if you screw on the outside, make sure that the screws of the legs inside do not touch the electronics, if from the inside, make sure that the screws do not protrude from the legs (otherwise they will scratch the surface)
* 3 screws must be screwed into the protruding fasteners from above / below and on the front wall, one in one direction, the next in the other and the third in the same direction as the first
* it is better not to unscrew or tighten the screws once again so as not to disturb the plastic, PLA does not like this
* if any screw has started to slip, insert a slightly melted similar plastic into the hole and then cut it off
* fasten 5 logos/ties. 2 on the front wall and 3 on the back
* the case should be tightened with all the screws and additionally glued with hot glue, loose assembly may degrade the sound quality

### battery assembly
#### battery assembly should be carried out in a row with an open window without an anti-mosquito net! In case of fire, you should be able to throw the battery out the window
* you must have 3 IDENTICAL ONES! batteries with a capacity of 4000 or more milliamps each
* take the compartment for your type of batteries for 3 batteries
* solder with the batteries removed
* make a serial battery connection diagram and solder the balancing board
* Make sure that there are no short circuits
* output the wires from the output of the balancing board, the positive wire through the fuse compartment
* first, insert the batteries (WITH THE FUSE REMOVED), one at a time (CHECKING THE PALARITY OF EACH!), starting from the first one (which is connected to the balancer on the GND-3.7 pins)
* after installing each one, wait about 10 seconds, listening and sniffing that nothing starts to burn/smoke. if there is a fire, throw the battery out the window
* then make sure that the output wires are not touching, and only then insert the fuse and measure the voltage on the wires with a multimeter
* then remove the fuse first and only then all three batteries in reverse order

### installing electronics in the case
* first, insert and screw the speakers (at this point, the wires should already be securely soldered to them)
* tape the speaker screws and the speakers themselves with hot glue on the back
* then install the screen (it is advisable that the screen controller and its touchscreen are glued to the display itself with hot glue in advance to avoid damage to the cables, alternatively you can glue the controller boards to the case, the main thing is to make sure that you have a place to connect all the cables)
* place the speaker on a flat surface with a sniz screen and then glue the screen to the hot glue from the inside around the perimeter
* after the hot glue has solidified, glue the slots between the screen and the cases on the front panel with hot glue

### completing the build
#### produce with a strictly open window without an anti-mosquito net, in case of fire it should be possible to throw the column out the window
* make sure that the power button is off
* first, install the fuse of the charging port
* then install the batteries starting from the first one, sniffing and listening that nothing starts to burn/smoke
* then install the fuse of the accumulator and make sure that nothing starts to burn/smoke
* in case of fire, throw the speaker out the window
* first, press the hardware power button and make sure that nothing is burning/smoking
* then press the software power button and make sure that nothing is burning/smoking (this is unlikely at this stage, but it's worth playing it safe)
* wait until the speaker is fully loaded
* make sure that the touchscreen is fully functional
* make sure that the speakers are working and the channels are not mixed up
* Make sure that the volume is adjusted and that the amplifier is not overloaded at maximum volume
* if an overload occurs, then you should hardware reduce the volume of the amplifier with a hardware turntable so that the amplifier does not overload at maximum program volume. then fix the volume control knob of the amplifier with hot glue to avoid changing the settings
* then turn off the speaker using first the software power off button or the button in the menu, and then the hardware button, completely turning it off
* place a folded A4 sheet of paper on top of the left speaker in the case so that it covers the USB hub board and the metal speaker magnet from the place where you put the motherboard but does not protrude from the case
* place the fully connected motherboard on a piece of paper on top and make sure that there is no short circuit
* put a paralon or sponge on top of the motherboard radiator so that the radiator does not knock on the back wall of the case on the bass, but make sure that the paralon or sponge does not occupy the entire radiator area so that the motherboard can cool down
* make sure that the wires do not stick out of the housing
* make sure that the AUX input and the charging input are well insulated and in place, that their nuts are well tightened and the AUX input wire is connected to the microphone slot of the motherboard
* put the rear wall of the case in its place and make sure that everything fits
* tighten all the screws on the back wall