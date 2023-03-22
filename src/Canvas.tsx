import { ButtonReg, SRV_BUTTON, SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import { Group } from "./Group.ts";
import { Line } from "./Line.ts";
import Log from "./Logger.tsx";
import { Rect } from "./Rect.ts";
import RenderItem from "./RenderItem.ts";
import RenderTypes from "./RenderTypes.ts";
import UpdateTypes from "./UpdateTypes.ts";
import './stylesheet.css';
import { InitTypes } from "./InitTypes.ts";
import { Bitmap } from "./Bitmap.ts";

var initialSetup = false; // Has the initial setup code run?

const width = 160; // Canvas Width
const height = 120; // Canvas Height

var scaleFactor = 5; // Scale of the canvas. Can be reduced.

var canvas: HTMLCanvasElement; // Canvas
var context: CanvasRenderingContext2D; // Canvas rendering element.

var ItemList: RenderItem; // List of rendering items.

export var globalColour: number[] = []; // Colour setting.

export var globalFilled: boolean = false; // Fill setting.

export var globalDrawWidth: number = 1; // Width setting.

export var globalGroup: number = 0; // Group setting.

export var groupList: Group[] = []; // List of groups.
var groupIDList: number[] = []; // List of group IDs.

var topZ = 0; // The highest set Z-Index, for optimisation.

var autoRefreshMode: boolean = true; // Whether the screen automatically renders after each command.

var rotService: JDService; // The Rotary Encoder Service.
//TODO: Change to an LCD Service.

export var buffer: Bitmap; // Rendering Bitmap.

//Takes a two byte number and converts it back into a regular number.
export const unconvCoord = (upper, lower) => {
    return ((upper << 8) + lower) - 32767;
}

// Initialise Command.
export const init = (data: number) => {
    let bit = data % 1; // First bit is the toggle (on/off)
    let cmd = data >> 1; // Remaining 7 bits is the command.
    switch (cmd) {
        case InitTypes.AutoRefresh:
            autoRefreshMode = bit ? true : false;
            if (autoRefreshMode) {
                refresh();
            }
            break;
        default:
            break;
    }
}


// Function for adding items to the list.
export const addItem = (item: RenderItem) => {
    if (ItemList == undefined) { // If the list is empty:
        ItemList = item;
        return;
    }
    let z: number = item.z;
    let temp = ItemList;
    if (z >= topZ) { // If the new item will be equal or above the highest known Z, it needs to be at the end of the list.
        while (temp.next) {
            temp = temp.next;
        }
        temp.next = item;
        topZ = z; // Update for next time.
        if (autoRefreshMode) {
            refresh();
        }
        return;
    }
    while (temp.next) { // Otherwise, find the place by finding the gap.
        if (z >= temp.z && z < temp.next.z) {
            item.next = temp.next;
            temp.next = item;
            break;
        }
        temp = temp.next;
    }
    if (autoRefreshMode) {
        refresh();
    }
}

//Renders the screen (render is a reserved name)
export const refresh = () => {
    // let st = Date.now();
    let temp: RenderItem = ItemList;
    while (temp) {
        if (temp.visibility) { // Only draw if visible.
            temp.draw(scaleFactor);
        }
        temp = temp.next;
    }
    for (let i = 0; i < buffer.width; i++) { // Draws buffer.
        for (let j = 0; j < buffer.height; j++) {
            const c = buffer.get(i, j); // Get colour at position.
            context.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`; // Set colour
            context.fillRect(i * scaleFactor, j * scaleFactor, scaleFactor, scaleFactor); // Draw pixel.
        }
    }
    // st = (Date.now() - st);
    // Log("Render Time: " + st.toString() + "ms");
}

//Set colour command.
export const setColour = (r: number, g: number, b: number, a: undefined | number = 255) => {
    globalColour[0] = r;
    globalColour[1] = g;
    globalColour[2] = b;
    globalColour[3] = a == undefined ? 255 : a;
}

// Set fill status command.
export const setFilled = (f: number) => {
    globalFilled = f ? true : false;
}

// Set draw width command.
export const setDrawWidth = (w: number) => {
    globalDrawWidth = w;
}

// Clears all items from the screen and deletes all groups.
export const clear = () => {
    ItemList.next = undefined; // Keeps the first item (the black background)
    topZ = 0;
    globalGroup = 0;
    groupList = [];
    groupIDList = [];
    if (autoRefreshMode) {
        refresh();
    }
}

// Delete command.
export const del = (id: number) => {
    if (id == 256) // Don't delete the black background.
        return; // Cannot be triggered in regular use as limited to <=255
    let item = ItemList;
    while (item.next) {
        if (item.next.id == id) { // Find item
            item.next = item.next.next; // delete.
            break;
        }
        item = item.next;
    }
    topZ = 256; // Reset so next is correctly placed.
    if (autoRefreshMode) {
        refresh();
    }
}

// Update command.
export const update = (id: number, params: number[]) => {
    if (id == 256) // Don't change background.
        return;
    let head = ItemList;
    while (head.id != id) {
        head = head.getNext();
        if (head == null) { // If item doesn't exist:
            return;
        }
    }
    switch (params.shift()) {
        case UpdateTypes.Visibility:
            var val = unconvCoord(params[0], params[1]);
            head.setVisibility(val ? true : false);
            break;
        case UpdateTypes.Translate:
            Log("Translate");
            head.translate(params);
            break;
        case UpdateTypes.Position:
            head.setPosition(params);
            break;
        case UpdateTypes.Resize:
            head.resize(params);
            break;
        case UpdateTypes.Angle:
            var val = unconvCoord(params[0], params[1]);
            head.setAngle(val);
            break;
        case UpdateTypes.Colour:
            head.setColour(params);
            break;
        case UpdateTypes.Width:
            var val = unconvCoord(params[0], params[1]);
            head.setWidth(val);
            break;
        case UpdateTypes.Fill:
            var val = unconvCoord(params[0], params[1]);
            head.setFilled(val ? true : false);
            break;
        case UpdateTypes.Z:
            var val = unconvCoord(params[0], params[1]);
            if (val == 0 || val > 255) {
                return;
            }
            head.setLayer(val); // Layer is changed by deleting and readding item to the list.
            del(head.id);
            addItem(head);
            break;
        case UpdateTypes.Scale:
            var val = unconvCoord(params[0], params[1]);
            head.setScale(val);
            break;
        default:
            break;
    }
    if (autoRefreshMode) {
        refresh();
    }

}

// Add group command.
export const addGroup = (data: number[]) => {
    let gid = data[2];
    globalGroup = gid; // Set global group; items are added to the global group automatically.
    if (gid == 0) { // 0 means don't add to any groups.
        return;
    }
    if (!groupIDList.find(item => item == gid)) { // If group doesn't already exist:
        let g = new Group(data); // Create a new group.
        groupList.push(g);
        groupIDList.push(gid);
        addItem(g); // Add to item list, just for updating purposes.
    }
}

const Canvas = (props) => {
    const canvasRef = React.useRef(null); // Setup Canvas.

    rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0]; // Get rotary service.
    //TODO: Change to LCD Service.

    const scaleup = document.getElementById("scaleup") as HTMLButtonElement; // Get the buttons as elements.
    const scaledown = document.getElementById("scaledown") as HTMLButtonElement;
    const listitems = document.getElementById("listitems") as HTMLButtonElement;
    const scaletext = document.getElementById("scaletext") as HTMLParagraphElement;

    scaleup.onclick = () => { setScale(context, scaleFactor + 1) } // Increase scale button
    scaledown.onclick = () => { setScale(context, scaleFactor - 1) } // Decrease scale button.
    listitems.onclick = () => { let item = ItemList; while (item) { Log(item.id?.toString() + " | " + item.type.toString() + " : " + item.data + "," + item.z.toString()); item = item.next; }; };
    // List all items in the Log on click.

    // Set the scale of the canvas:
    const setScale = (ctx, scale: number) => {
        if (scale <= 0 || scale > 10) { // Limits
            return;
        }
        scaleFactor = scale;
        ctx.canvas.width = width * scaleFactor;
        ctx.canvas.height = height * scaleFactor;
        scaletext.innerText = "Dimensions: " + width + "x" + height + ", with scaling factor " + scaleFactor;
        // ^ Update text element accordingly.
        refresh();
    }

    React.useEffect(() => { // On update:
        if (canvasRef) {
            canvas = canvasRef.current; // Get canvas element.
            if (canvas) {
                context = canvas.getContext('2d'); // Get rendering context.
                context.canvas.width = width * scaleFactor; // Set width
                context.canvas.height = height * scaleFactor; // Set height
                if (!initialSetup) { // Only once
                    buffer = new Bitmap(width, height); // Create the buffer
                    globalColour.push(0); // Build the default starting colour.
                    globalColour.push(0);
                    globalColour.push(0);
                    initialSetup = true; // Don't do this again.
                    setFilled(1); // Solid
                    let coord = convCoord(0);
                    let cw = convCoord(width);
                    let ch = convCoord(height);
                    addItem(new Rect([RenderTypes.Rect, 256, coord[0], coord[1], coord[0], coord[1], cw[0], cw[1], ch[0], ch[1], 0]));
                    // ^ The black background of the display. HTML Canvas is by default white, LCD will be black, so this counteracts.
                    setFilled(0); // Reset.

                    window.addEventListener('mousedown', draw, false); // For manually interaction with the display.
                }
                refresh(); // Redraw everything.
            }
        }
    }, [rotService]);

    if (rotService) {
        return (
            <div>
                <canvas id="thecanvas" ref={canvasRef}  {...props} />
            </div>
        );
    }
}

// When canvas is clicked:
function draw(e) {
    var pos = getMousePosition(canvas, e); // Get click position.
    let x = Math.floor(pos.x / scaleFactor);
    let y = Math.floor(pos.y / scaleFactor);
    drawPixel(x, y); // Set pixel
}

//Converts a JS Number into two Uint8s, allowing a range of numbers between
// -32768 and 32768.
function convCoord(c: number) {
    let n = [0, 0];
    c = c + 32767;
    n[0] = c >> 8;
    n[1] = c & 0xff;
    return n;
}

//Creates a new pixel at the selected location.
function drawPixel(x, y) {
    let arr = new Uint8Array(7);
    arr[0] = RenderTypes.Pixel;
    arr[1] = 0;
    x = convCoord(x);
    y = convCoord(y);
    arr[2] = x[0];
    arr[3] = x[1];
    arr[4] = y[0];
    arr[5] = y[1];
    arr[6] = 255;
    rotService.sendCmdAsync(10, arr, false);
}

// Gets the location of the mouse when the click occured.
function getMousePosition(canvas, evnt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evnt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evnt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

export default Canvas;
