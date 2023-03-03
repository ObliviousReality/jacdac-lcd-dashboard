import { advancedRenderMode, buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";

export class Line extends RenderItem {
    x: number;
    y: number;
    x2: number;
    y2: number;

    constructor(params: number[]) {
        super(params);
        if (params.length > 5) {
            this.x = this.unconvCoord(params[0], params[1]);
            this.y = this.unconvCoord(params[2], params[3]);
            this.x2 = this.unconvCoord(params[4], params[5]);
            this.y2 = this.unconvCoord(params[6], params[7]);
        }
        else {
            this.x = params[0];
            this.y = params[1];
            this.x2 = params[2];
            this.y2 = params[3];
        }
    }

    draw(context: any, scale: any): void {
        if (advancedRenderMode) {
            buffer.fillLine(this.x, this.y, this.x2, this.y2, this.colour);
        } else {
            context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
            context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
            context.lineWidth = this.width * scale;
            context.beginPath();
            context.moveTo(this.x * scale, this.y * scale);
            context.lineTo(this.x2 * scale, this.y2 * scale);
            context.stroke();
        }
    }

    setPosition(data: number[]): void {
        this.x = this.unconvCoord(data[0], data[1]);
        this.y = this.unconvCoord(data[2], data[3]);
    }

    translate(data: number[]): void {
        this.x += this.unconvCoord(data[0], data[1]);
        this.y += this.unconvCoord(data[2], data[3]);
        this.x2 += this.unconvCoord(data[0], data[1]);
        this.y2 += this.unconvCoord(data[2], data[3]);
    }

    setPosition(data: number[]): void {
        this.x2 = this.unconvCoord(data[0], data[1]);
        this.y2 = this.unconvCoord(data[2], data[3]);
    }
}
