# Jacdac LCD Digital Twin

A digital twin for a Jacdac LCD module, which emulates the behaviour of the module for use in the Jacdac dashboard.

## Requirements

Node.js

## Setup

Run command:

`npm install`

to install al required dependencies.

Then run command:

`npm start`

to build a local server running this code; it should open a browser window on the correct URL when compilation is complete.

## Features

A scaleable representation of an LCD, currently fixed to the dimensions 160x120 pixels. The scaling can be changed using buttons.

Currently this has no connection to a Jacdac LCD Module, and this is the next thing to be added, but this is made harder as the current Jacdac Typescript hooks do not know the module exists.

For the minute, functionality is either inbuilt, with two set shapes pre-drawn onto the screen, or from the connection of a standard Jacdac button, which allows a third shape to be drawn when pressed.

## To Do

- Add more display primitives; currently all that is supported is lines and rectangles
- Add a way of reading commands sent to a Jacdac LCD Module
- Take these commands and recreate them within this digital twin.
