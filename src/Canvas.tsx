import { ButtonReg, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import Log from "./Logger.tsx";
import { Rect } from "./Rect.ts";
import RenderItem from "./RenderItem.ts";
import RenderTypes from "./RenderTypes.ts";
import './stylesheet.css';
import { Line } from "./Line.ts";

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

var topZ = 0;

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
        refresh();
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
    refresh();
}

const refresh = () => {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let temp: RenderItem = ItemList;
    while (temp) {
        temp.draw(ctx, scaleFactor);
        temp = temp.next;
    }
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
    refresh();
}

export const del = (id: number) => {
    if (id == 256)
        return;
    let item = ItemList;
    while (item.next) {
        if (item.next.id == id) {
            item.next = item.next.next;
            return;
        }
    }
}

export const update = (id: number, ...params: number[]) => {
    if (id == 256)
        return;
}

const Canvas = (props) => {
    const canvasRef = React.useRef(null);

    const service = useServices({ serviceClass: SRV_BUTTON })[0];

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
        canvas = canvasRef.current;
        context = canvas.getContext('2d');
        if (!initialFill) {
            context.canvas.width = width * scaleFactor;
            context.canvas.height = height * scaleFactor;

            globalColour.push(0);
            globalColour.push(0);
            globalColour.push(0);
            initialFill = true;
            setFilled(1);
            addItem(new Rect([RenderTypes.R, 256, 0, 0, width, height, 0]));
            setFilled(0);
            setColour(255, 0, 255);
            addItem(new Line([RenderTypes.L, 1, 10, 10, 10, 100, 1]));
            setColour(255, 255, 0);
            addItem(new Rect([RenderTypes.R, 30, 50, 50, 100, 50, 1]));
        }

        if (pressure > 0) {
            Log("Button Pressed.");
            setColour(0, 255, 255);
            addItem(new Line([RenderTypes.L, 5, 0, 0, 100, 100, 0]));
        }

        refresh();
    }, [pressure]);

    return (
        <div>
            <canvas id="thecanvas" ref={canvasRef} {...props} />
        </div>
    );
}


export default Canvas;
