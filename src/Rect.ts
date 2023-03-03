import { advancedRenderMode, buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";


export class Rect extends RenderItem {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(params: number[]) {
        super(params);
        if (params.length > 5) {
            this.x = this.unconvCoord(params[0], params[1]);
            this.y = this.unconvCoord(params[2], params[3]);
            this.w = this.unconvCoord(params[4], params[5]);
            this.h = this.unconvCoord(params[6], params[7]);
        } else {
            this.x = params[0];
            this.y = params[1];
            this.w = params[2];
            this.h = params[3];
        }
    }

    draw(context: any, scale: any): void {
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        if (this.filled) {
            if (advancedRenderMode) {
                for (let i = this.x; i < this.x + this.w; i++) {
                    for (let j = this.y; j < this.h + this.y; j++) {
                        buffer.set(i, j, this.colour);
                    }
                }
            }
            else {
                context.fillRect(this.x * scale, this.y * scale, this.w * scale, this.h * scale);
            }
        }
        else {
            context.strokeRect(this.x * scale, this.y * scale, this.w * scale, this.h * scale);
        }
    }

    setPosition(data: number[]): void {
        this.x = data[0];
        this.y = data[1];
    }

    translate(data: number[]): void {
        this.x += data[0];
        this.y += data[1];
    }

    resize(data: number[]): void {
        this.w = data[0];
        this.h = data[1];
    }
}
