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

var filled: boolean = false;

var drawWidth: number = 1;


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
    type: number;
    id: number;
    data: number[];

    constructor(t: number, ...params: number[]) {
        this.type = t;
        this.data = params;
        this.id = params[0];
    }

    draw(context, scale) {
        let d = this.data;
        switch (this.type) {
            case RenderTypes.P:
                context.strokeRect(d[1] * scale, d[2] * scale, scale, scale);
                break;
            case RenderTypes.C:
                context.fillStyle = `rgb(${d[1]}, ${d[2]}, ${d[3]})`;
                context.strokeStyle = context.fillStyle;
                break;
            case RenderTypes.F:
                filled = d[1] ? true : false;
                break;
            case RenderTypes.W:
                drawWidth = d[1];
                context.lineWidth = drawWidth * scale;
                break;
            case RenderTypes.R:
                context.lineWidth = drawWidth * scale;
                if (filled)
                    context.fillRect(d[1] * scale, d[2] * scale, d[3] * scale, d[4] * scale);
                else
                    context.strokeRect(d[1] * scale, d[2] * scale, d[3] * scale, d[4] * scale);
                break;
            case RenderTypes.L:
                context.lineWidth = drawWidth * scale;
                context.beginPath();
                context.moveTo(d[1] * scale, d[2] * scale);
                context.lineTo(d[3] * scale, d[4] * scale);
                context.stroke();
                break;
            case RenderTypes.O:
                context.beginPath();
                context.arc(d[1], d[2], d[3], 0, 2 * Math.PI);
                if (filled) {
                    Log("Draw Filled Circle");
                    context.fill();
                }
                else {
                    Log("Draw Unfilled Circle");
                    context.stroke();
                }
                break;
            case RenderTypes.T:
                if (filled) {
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
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (ItemList !== undefined) {
        ItemList.forEach((item) => item.draw(ctx, scaleFactor));
    }
}

export const clear = () => {
    ItemList = [];
    refresh();
}

export const del = (id: number) => {
    for (let i = 0; i < ItemList.length; i++) {
        if (id == ItemList[i].id) {
            ItemList.splice(i, 1);
        }
    }
}

export const update = (id: number, ...params: number[]) => {
    for (let i = 0; i < ItemList.length; i++) {
        if (id == ItemList[i].id) {
            ItemList[i] = new RenderItem(params.shift(), params); // Needs work and testing.
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
    listitems.onclick = () => { ItemList.forEach((item) => { Log(item.type); Log(item.data) }) };


    const setScale = (ctx, scale: number) => {
        if (scale <= 0 || scale > 10) {
            return;
        }
        scaleFactor = scale;
        ctx.canvas.width = width * scaleFactor;
        ctx.canvas.height = height * scaleFactor;
        context.lineWidth = drawWidth * scale;
        scaletext.innerText = "Dimensions: " + width + "x" + height + ", with scaling factor " + scaleFactor;
        refresh();
    }

    React.useEffect(() => {
        canvas = canvasRef.current;
        context = canvas.getContext('2d');
        if (!initialFill) {
            context.canvas.width = width * scaleFactor;
            context.canvas.height = height * scaleFactor;
            initialFill = true;
            if (ItemList !== undefined) {
                ItemList.push(new RenderItem(RenderTypes.C, 0, 255, 0, 255));
                ItemList.push(new RenderItem(RenderTypes.L, 1, 10, 10, 10, 100));
                ItemList.push(new RenderItem(RenderTypes.C, 2, 255, 255, 0));
                ItemList.push(new RenderItem(RenderTypes.R, 3, 50, 50, 100, 50));
            }
        }

        if (pressure > 0) {
            Log("Button Pressed.");
            ItemList.push(new RenderItem(RenderTypes.C, 0, 255, 255));
            ItemList.push(new RenderItem(RenderTypes.L, 0, 0, 100, 100));
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
