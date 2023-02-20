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

Internally, the primitives are stored in a linked list, currently ordered by time. This needs to be changed to z-index ordering to allow layering control.

Another change that is needed is the addition of objects, implemented as groups of primitives, as well as the ability to change parameters of objects after they have been created. This will require a new API to be created for the update() function.

### Update functions

- Translate
- Resize
- Rotate?
- Change Colour
- Change width
- Change fill

## To Do

- Send the commands from a microbit program, not HTML buttons.
- Change from time ordering to z-index ordering.
- Add objects.
- Text.
- Sprites.
- Post-creation manipulation of variables.
