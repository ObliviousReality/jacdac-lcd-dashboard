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

export const addItem = (item: RenderItem) => {
    ItemList.push(item);
    refresh();
}


export class RenderItem {
    type: string;
    data: number[]

    constructor(t: string, ...params: number[]) {
        this.type = t;
        this.data = params;
    }

    draw(context, scale) {
        let d = this.data;
        switch (this.type) {
            case "L":
                context.strokeStyle = context.fillStyle;
                context.lineWidth = scale;
                context.beginPath();
                context.moveTo(d[0] * scale, d[1] * scale);
                context.lineTo(d[2] * scale, d[3] * scale);
                context.stroke();
                break;
            case "R":
                context.strokeStyle = context.fillStyle;
                context.lineWidth = scale;
                context.strokeRect(d[0] * scale, d[1] * scale, d[2] * scale, d[3] * scale);
                break;
            case "C":
                context.fillStyle = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
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


    const setScale = (ctx, scale) => {
        if (scale <= 0 || scale > 10) {
            return;
        }
        scaleFactor = scale;
        ctx.canvas.width = width * scaleFactor;
        ctx.canvas.height = height * scaleFactor;
        scaletext.innerText = "Dimensions: " + width + "x" + height + ", with scaling factor " + scaleFactor;

    }

    React.useEffect(() => {
        canvas = canvasRef.current;
        context = canvas.getContext('2d');
        if (!initialFill) {
            context.canvas.width = width * scaleFactor;
            context.canvas.height = height * scaleFactor;
            initialFill = true;
            if (ItemList !== undefined) {
                ItemList.push(new RenderItem("C", 255, 0, 255));
                ItemList.push(new RenderItem("L", 10, 10, 10, 100));
                ItemList.push(new RenderItem("C", 255, 255, 0));
                ItemList.push(new RenderItem("R", 50, 50, 100, 50));
            }
        }

        if (pressure > 0) {
            Log("Button Pressed.");
            ItemList.push(new RenderItem("C", 0, 255, 255));
            ItemList.push(new RenderItem("L", 0, 0, 100, 100));
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
