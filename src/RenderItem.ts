import { globalColour, globalDrawWidth, globalFilled } from "./Canvas.tsx";
import RenderTypes from "./RenderTypes.ts";
import Log from "./Logger.tsx";

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
                Log("Drawing in the wrong place.");
                break;
            case RenderTypes.R:
                Log("Drawing in the wrong place.");
                break;
            case RenderTypes.L:
                Log("Drawing in the wrong place.");
                break;
            case RenderTypes.O:
                Log("Drawing in the wrong place.");
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

    translate(data: number[]) {
        Log("Base Class; No functionality.")
    }

    resize(data: number[]) {
        Log("Base Class; No functionality.")
    }

}

export default RenderItem;
