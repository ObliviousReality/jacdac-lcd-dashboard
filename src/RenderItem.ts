import { globalColour, globalDrawWidth, globalFilled } from "./Canvas.tsx";
import RenderTypes from "./RenderTypes.ts";

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
        if (this.z == 0) {
            if (this.id != 256) {
                this.z = 1;
            }

        }
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

export default RenderItem;
