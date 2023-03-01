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

var advancedRenderMode: boolean = true;
var autoRefreshMode: boolean = true;

var screen: number[][][] = [];


export const init = (data: number) => {
    let bit = data % 2;
    let cmd = data >> 1;
    switch (cmd) {
        case InitTypes.A:
            autoRefreshMode = bit ? true : false;
            break;
        case InitTypes.R:
            advancedRenderMode = bit ? true : false;
            if (autoRefreshMode) {
                refresh();
            }
        default:
            break;
    }
}

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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (advancedRenderMode) {
        for (let i = 0; i < screen.length; i++) {
            for (let j = 0; j < screen[i].length; j++) {
                context.fillStyle = `rgb(${screen[i][j][0]}, ${screen[i][j][1]}, ${screen[i][j][2]})`;
                context.fillRect(i * scaleFactor, j * scaleFactor, scaleFactor, scaleFactor);
            }
        }
    } else {
        let temp: RenderItem = ItemList;
        while (temp) {
            if (temp.visibility) {
                temp.draw(ctx, scaleFactor);
            }
            temp = temp.next;
        }
    }
    st = (Date.now() - st);
    Log("Render Time: " + st.toString() + "ms");
}

export const setColour = (r: number, g: number, b: number) => {
    globalColour[0] = r;
    globalColour[1] = g;
    globalColour[2] = b;
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
    refresh();
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
            head.setVisibility(params[0] ? true : false);
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
            head.setAngle(params[0]);
            break;
        case UpdateTypes.C:
            head.setColour(params);
            break;
        case UpdateTypes.W:
            head.setWidth(params[0]);
            break;
        case UpdateTypes.F:
            head.setFilled(params[0] ? true : false);
            break;
        case UpdateTypes.Z:
            if (params[0] == 0) {
                return;
            }
            head.setLayer(params[0]);
            // More Here.
            del(head.id);
            addItem(head); //??
            break;
        case UpdateTypes.S:
            head.setScale(params[0]);
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

                    if (advancedRenderMode) {
                        for (let i = 0; i < context.canvas.width; i++) {
                            screen.push([]);
                            for (let j = 0; j < context.canvas.height; j++) {
                                screen[i].push([0, 0, 0, 0]);
                            }
                        }
                    }

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
