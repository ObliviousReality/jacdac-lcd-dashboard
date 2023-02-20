import { ButtonReg, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import Log from "./Logger.tsx";
import './stylesheet.css';

var initialFill = false;

const width = 160;
const height = 120;

var scaleFactor = 5;

var context;
var canvas;

var ItemList: RenderItem[] = [];

var globalColour: number[] = [];

var globalFilled: boolean = false;

var globalDrawWidth: number = 1;


export const addItem = (item: RenderItem) => {
    ItemList.push(item);
    refresh();
}

export enum RenderTypes {
    X,
    P,
    C,
    F,
    W,
    R,
    L,
    O,
    U,
    D,
    T,
    I = 15
}


export class RenderItem {
    type: number | undefined;
    id: number | undefined;
    z: number | undefined;
    data: number[];
    colour: number[] = [];
    width: number;
    filled: boolean;

    next: RenderItem | undefined = undefined;

    constructor(params: number[]) {
        this.type = params.shift();
        this.id = params.shift();
        this.z = params.pop();
        this.data = params;

        this.colour.push(globalColour[0]);
        this.colour.push(globalColour[1]);
        this.colour.push(globalColour[2]);

        this.filled = globalFilled;
        this.width = globalDrawWidth;
    }

    getNext() {
        return this.next;
    }

    setNext(newNext: RenderItem) {
        this.next = newNext;
    }

    clearNext() {
        this.next = undefined;
    }

    draw(context, scale) {
        let d = this.data;
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        switch (this.type) {
            case RenderTypes.P:
                context.strokeRect(d[0] * scale, d[1] * scale, scale, scale);
                break;
            case RenderTypes.R:
                if (this.filled) {
                    context.fillRect(d[0] * scale, d[1] * scale, d[2] * scale, d[3] * scale);
                }
                else {
                    context.strokeRect(d[0] * scale, d[1] * scale, d[2] * scale, d[3] * scale);
                }
                break;
            case RenderTypes.L:
                context.beginPath();
                context.moveTo(d[0] * scale, d[1] * scale);
                context.lineTo(d[2] * scale, d[3] * scale);
                context.stroke();
                break;
            case RenderTypes.O:
                context.beginPath();
                context.arc(d[0] * scale, d[1] * scale, d[2] * scale, 0, 2 * Math.PI);
                if (this.filled) {
                    context.fill();
                }
                else {
                    context.stroke();
                }
                break;
            case RenderTypes.T:
                if (this.filled) {
                    Log("Filled Rotated Rectange");
                }
                else {
                    Log("Unfilled Rotated Rectange");
                }
                break;
            default:
                Log("Not sure what to draw.");
                break;
        }
    }
}

const refresh = () => {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (ItemList !== undefined) {
        ItemList.forEach((item) => item.draw(ctx, scaleFactor));
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
    ItemList = [];
    refresh();
}

export const del = (id: number) => {
    for (let i = 0; i < ItemList.length; i++) {
        if (id == ItemList[i].id) {
            ItemList.splice(i, 1);
            break;
        }
    }
}

export const update = (id: number, ...params: number[]) => {
    for (let i = 0; i < ItemList.length; i++) {
        if (id == ItemList[i].id) {
            ItemList[i] = new RenderItem(params); // Needs work and testing.
            break;
        }
    }
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
    listitems.onclick = () => { ItemList.forEach((item) => { Log(item.type.toString()); Log(item.data) }) };


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
            if (ItemList !== undefined) {
                // ItemList.push(new RenderItem([RenderTypes.C, 0, 0, 0, 0]));
                setFilled(1);
                ItemList.push(new RenderItem([RenderTypes.R, 69, 0, 0, width, height, 0]));
                setFilled(0);

                setColour(255, 0, 255);
                ItemList.push(new RenderItem([RenderTypes.L, 1, 10, 10, 10, 100, 0]));
                setColour(255, 255, 0);
                ItemList.push(new RenderItem([RenderTypes.R, 30, 50, 50, 100, 50, 0]));
            }
        }

        if (pressure > 0) {
            Log("Button Pressed.");
            setColour(255, 255, 0);
            ItemList.push(new RenderItem([RenderTypes.L, 5, 0, 0, 100, 100, 0]));
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
