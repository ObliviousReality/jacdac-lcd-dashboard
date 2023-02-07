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


class RenderItem {
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
    const scaletext = document.getElementById("scaletext") as HTMLParagraphElement;

    scaleup.onclick = () => { setScale(context, scaleFactor + 1) }
    scaledown.onclick = () => { setScale(context, scaleFactor - 1) }
    if (ItemList !== undefined) {
        ItemList.push(new RenderItem("C", 255, 0, 255));
        ItemList.push(new RenderItem("L", 10, 10, 10, 100));
        ItemList.push(new RenderItem("C", 255, 255, 0));
        ItemList.push(new RenderItem("R", 50, 50, 100, 50));
    }

    const draw = ctx => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (ItemList !== undefined) {
            ItemList.forEach((item) => item.draw(ctx, scaleFactor));
        }
    }

    const drawLine = ctx => {
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(i * scaleFactor, i * scaleFactor, scaleFactor, scaleFactor);
        }
    }

    const setScale = (ctx, scale) => {
        if (scale <= 0 || scale > 10) {
            return;
        }
        scaleFactor = scale;
        ctx.canvas.width = width * scaleFactor;
        ctx.canvas.height = height * scaleFactor;
        scaletext.innerText = "Dimensions: " + width + "x" + height + ", with scaling factor " + scaleFactor;
        draw(ctx);
    }

    React.useEffect(() => {
        canvas = canvasRef.current;
        context = canvas.getContext('2d');
        if (!initialFill) {
            context.canvas.width = width * scaleFactor;
            context.canvas.height = height * scaleFactor;
            // context.fillStyle = '#000000'
            // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            // Log("Restting Canvas");
            // // initialFill = true;
        }

        draw(context);
        if (pressure > 0) {
            context.fillStyle = '#FFFFFF'
            // context.canvas.width = context.canvas.width * 2;
            Log("Button Pressed.");
            // setScale(context, 1);
        }
        else {
            context.fillStyle = '#000000'
            // context.canvas.width = context.canvas.width / 2;
            // setScale(context, 5);
        }
        // context.fillRect(10 * scaleFactor, 10 * scaleFactor, 1 * scaleFactor, 1 * scaleFactor);
        drawLine(context);

    }, [pressure]);



    return (
        <div>
            <canvas id="thecanvas" ref={canvasRef} {...props} />
        </div>
    );
}


export default Canvas;
