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

var initialFill = false;

const width = 160;
const height = 120;

var scaleFactor = 5;

var context;
var canvas;

var ItemList: RenderItem;

export var globalColour: number[] = [];

export var globalFilled: boolean = false;

export var globalDrawWidth: number = 1;

export var globalGroup: number = 0;

export var groupList: Group[] = [];
var groupIDList: number[] = [];

var topZ = 0;

export var advancedRenderMode: boolean = true;
var autoRefreshMode: boolean = true;

// var buffer: number[][][] = [];
export var buffer: Bitmap;

// export const setPixel = (x: number, y: number, c: number[]) => {
//     if (x >= 0 && y >= 0)
//         buffer[x][y] = c;
// }

export const unconvCoord = (upper, lower) => {
    return ((upper << 8) + lower) - 32767;
}


export const init = (data: number) => {
    let bit = data % 2;
    let cmd = data >> 1;
    switch (cmd) {
        case InitTypes.A:
            autoRefreshMode = bit ? true : false;
            break;
        case InitTypes.R:
            advancedRenderMode = bit ? true : false;
            // if (advancedRenderMode) {
            //     buildBuffer();
            // }
            // else {
            //     buffer = [];
            // }
            if (autoRefreshMode) {
                refresh();
            }
            break;
        default:
            break;
    }
}

// const buildBuffer = () => {
//     for (let i = 0; i < context.canvas.width; i++) {
//         buffer.push([]);
//         for (let j = 0; j < context.canvas.height; j++) {
//             buffer[i].push([0, 0, 128, 0]);
//         }
//     }
// }

export const addItem = (item: RenderItem) => {
    if (ItemList == undefined) {
        ItemList = item;
        return;
    }
    let z: number = item.z;
    let temp = ItemList;
    if (z >= topZ) {
        while (temp.next) {
            temp = temp.next;
        }
        temp.next = item;
        topZ = z;
        if (autoRefreshMode) {
            refresh();
        }
        return;
    }
    while (temp.next) {
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

export const refresh = () => {
    let st = Date.now();
    let ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let temp: RenderItem = ItemList;
    while (temp) {
        if (temp.visibility) {
            temp.draw(ctx, scaleFactor);
        }
        temp = temp.next;
    }
    if (advancedRenderMode) {
        for (let i = 0; i < buffer.width; i++) {
            for (let j = 0; j < buffer.height; j++) {
                const c = buffer.get(i, j);
                context.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
                // if (i == 80 && j == 80) {
                //     Log("C: " + c);
                //     Log("Fillstyle: " + context.fillStyle.toString());
                // }
                context.fillRect(i * scaleFactor, j * scaleFactor, scaleFactor, scaleFactor);
            }
        }
    }
    if (advancedRenderMode) {
        // st = (Date.now() - st);
        // Log("Render Time: " + st.toString() + "ms");
    }
}

export const setColour = (r: number, g: number, b: number, a: undefined | number = 255) => {
    globalColour[0] = r;
    globalColour[1] = g;
    globalColour[2] = b;
    globalColour[3] = a == undefined ? 255 : a;
}

export const setFilled = (f: number) => {
    globalFilled = f ? true : false;
}

export const setDrawWidth = (w: number) => {
    globalDrawWidth = w;
}

export const clear = () => {
    ItemList.next = undefined;
    topZ = 0;
    globalGroup = 0;
    groupList = [];
    groupIDList = [];
    if (autoRefreshMode) {
        refresh();
    }
}

export const del = (id: number) => {
    if (id == 256)
        return;
    let item = ItemList;
    while (item.next) {
        if (item.next.id == id) {
            item.next = item.next.next;
            break;
        }
        item = item.next;
    }
    topZ = 256; // Reset so next is correctly placed.
    if (autoRefreshMode) {
        refresh();
    }
}

export const update = (id: number, params: number[]) => {
    if (id == 256)
        return;
    let head = ItemList;
    while (head.id != id) {
        head = head.getNext();
        if (head == null) {
            return;
        }
    }
    switch (params.shift()) {
        case UpdateTypes.V:
            var val = unconvCoord(params[0], params[1]);
            head.setVisibility(val ? true : false);
            break;
        case UpdateTypes.T:
            head.translate(params);
            break;
        case UpdateTypes.P:
            head.setPosition(params);
            break;
        case UpdateTypes.R:
            head.resize(params);
            break;
        case UpdateTypes.A:
            var val = unconvCoord(params[0], params[1]);
            head.setAngle(val);
            break;
        case UpdateTypes.C:
            head.setColour(params);
            break;
        case UpdateTypes.W:
            var val = unconvCoord(params[0], params[1]);
            head.setWidth(val);
            break;
        case UpdateTypes.F:
            var val = unconvCoord(params[0], params[1]);
            head.setFilled(val ? true : false);
            break;
        case UpdateTypes.Z:
            var val = unconvCoord(params[0], params[1]);
            if (val == 0 || val > 255) {
                return;
            }
            head.setLayer(val);
            del(head.id);
            addItem(head); //??
            break;
        case UpdateTypes.S:
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

export const addGroup = (data: number[]) => {
    let gid = data[2];
    globalGroup = gid;
    if (gid == 0) {
        return;
    }
    if (!groupIDList.find(item => item == gid)) {
        let g = new Group(data);
        groupList.push(g);
        groupIDList.push(gid);
        addItem(g);
    }
}

const Canvas = (props) => {
    const canvasRef = React.useRef(null);

    const service = useServices({ serviceClass: SRV_BUTTON })[0];
    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    const buttonReg = useRegister(service, ButtonReg.Pressure);

    const [pressure = 0] = useRegisterValue<[number]>(buttonReg);

    const scaleup = document.getElementById("scaleup") as HTMLButtonElement;
    const scaledown = document.getElementById("scaledown") as HTMLButtonElement;
    const listitems = document.getElementById("listitems") as HTMLButtonElement;
    const scaletext = document.getElementById("scaletext") as HTMLParagraphElement;

    scaleup.onclick = () => { setScale(context, scaleFactor + 1) }
    scaledown.onclick = () => { setScale(context, scaleFactor - 1) }
    listitems.onclick = () => { let item = ItemList; while (item) { Log(item.id?.toString() + " | " + item.type.toString() + " : " + item.data + "," + item.z.toString()); item = item.next; }; };

    const setScale = (ctx, scale: number) => {
        if (scale <= 0 || scale > 10) {
            return;
        }
        scaleFactor = scale;
        ctx.canvas.width = width * scaleFactor;
        ctx.canvas.height = height * scaleFactor;
        context.lineWidth = globalDrawWidth * scale;
        scaletext.innerText = "Dimensions: " + width + "x" + height + ", with scaling factor " + scaleFactor;
        refresh();
    }

    React.useEffect(() => {
        if (canvasRef) {
            canvas = canvasRef.current;
            if (canvas) {
                context = canvas.getContext('2d');
                context.canvas.width = width * scaleFactor;
                context.canvas.height = height * scaleFactor;
                if (!initialFill) {
                    buffer = new Bitmap(context.canvas.width, context.canvas.height);
                    globalColour.push(0);
                    globalColour.push(0);
                    globalColour.push(0);
                    initialFill = true;
                    setFilled(1);
                    addItem(new Rect([RenderTypes.R, 256, 0, 0, width, height, 0]));
                    setFilled(0);
                }

                if (pressure > 0) {
                    Log("Button Pressed.");
                    setColour(0, 255, 255);
                    addItem(new Line([RenderTypes.L, 5, 0, 0, 100, 100, 0]));
                }

                refresh();
            }
        }
    }, [pressure, rotService]);

    if (rotService) {
        return (
            <div>
                <canvas id="thecanvas" ref={canvasRef} {...props} />
            </div>
        );
    }
}


export default Canvas;
