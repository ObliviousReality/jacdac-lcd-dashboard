# Jacdac LCD Digital Twin

A digital twin for a Jacdac LCD module, which emulates the behaviour of the module for use in the Jacdac dashboard.

## Requirements

Node.js

## Setup

Run command:

`npm install`

to install all required dependencies.

Then run command:

`npm start`

to build a local server running this code; it should open a browser window on the correct URL when compilation is complete.

## Features

A scaleable representation of an LCD, currently fixed to the dimensions 160x120 pixels. The scaling can be changed using buttons.

Currently this has no connection to a Jacdac LCD Module, and this is the next thing to be added, but this is made harder as the current Jacdac Typescript hooks do not know the module exists.

Functionality can be obtained by connected a microbit to the system attached to a Jacdac Rotary Button. This device choice is temporary and may be changed later.

Once the rotary button is connected, a set of buttons will appear below the screen. When pressed, these will send commands to the rotary button emulating the commands that the future LCD module will support. The rotary encoder does not accept any commands internally, so this does not affect the module. The code is also watching for commands sent to this device, and they are intercepted and used internally as well as being sent to the module.

This creates a system which emulates a real system with a real LCD module - the main difference being the commands in this emulation are sent from HTML buttons instead of from code on a brain like the Microbit. A possible next step could be sending these commands directly from a microbit program instead of HTML buttons.

Internally, the primitives are stored in a linked list, currently ordered by their Z-Index, which allows custom layering. Items with the same Z Value are ordered by the time they are added to the list - later items will be on top.

### Primitives

- Rectangles
- Lines
- Pixels
- Circles

Objects can be updated after creation in various ways:

### Update functions

- Translate
- Set Position
- Resize
- Rotate
- Change Colour
- Change width
- Change fill
- Change visibility
- Change layer

Sprites are also supported, and are fairly easy to add more of. As part of sprite handling text is also supported - both upper and lower case characters are included as sprites.

Sprites can be added by creating PNG images with a transparent background, and filling in the shape with non-transparent pixels. The image can then be added to the `sprites` subdirectory, and then upon running the file `spritetojson.py` the sprite will be added to the sprites JSON file and the Typescript enumerator to allow code access.

An alternative to sprites which allows multiple colours is the use of groups, a group can be created using a custom ID and until that ID is changed or set to 0 (meaning subsequent items are added to no groups), all created items are added to this group. Updating this group in any way (except resizing) will affect all items in the group.

## To Do

- Send the commands from a microbit program, not HTML buttons.
- A render command, to allow the user to create a draw loop for animations.
- More inbuilt sprites.
