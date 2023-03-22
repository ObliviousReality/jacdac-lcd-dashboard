import { buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";

export class Rect extends RenderItem {
    w: number; // Width
    h: number; // Height

    constructor(params: number[]) {
        super(params);
        this.x = this.unconvCoord(params[0], params[1]);
        this.y = this.unconvCoord(params[2], params[3]);
        this.w = this.unconvCoord(params[4], params[5]);
        this.h = this.unconvCoord(params[6], params[7]);
        Log([this.x, this.y, this.w, this.h]);
    }

    draw(scale: any): void {
        if (this.filled) {
            for (let i = this.x; i < this.x + this.w * this.localScale; i++) {
                for (let j = this.y; j < this.h + this.y * this.localScale; j++) {
                    buffer.set(i, j, this.colour); // Fill shape.
                }
            }
        }
        else {
            if (this.width == 1) {
                buffer.fillLine(this.x, this.y, this.x + this.w, this.y, this.colour);
                buffer.fillLine(this.x + this.w, this.y, this.x + this.w, this.y + this.h, this.colour);
                buffer.fillLine(this.x, this.y + this.h, this.x + this.w, this.y + this.h, this.colour);
                buffer.fillLine(this.x, this.y, this.x, this.y + this.h, this.colour);
            }
            else {
                //Width handling:
                for (let off = - Math.floor(this.width / 2); off < Math.ceil(this.width / 2); off++) {
                    let x = this.x + off;
                    let y = this.y + off;
                    let w = this.w - 2 * off;
                    let h = this.h - 2 * off;

                    buffer.fillLine(x, y, x + w, y, this.colour);
                    buffer.fillLine(x + w, y, x + w, y + h, this.colour);
                    buffer.fillLine(x, y + h, x + w, y + h, this.colour);
                    buffer.fillLine(x, y, x, y + h, this.colour);
                }
            }
        }

    }

    setPosition(data: number[]): void {
        this.x = this.unconvCoord(data[0], data[1]);
        this.y = this.unconvCoord(data[2], data[3]);
    }

    translate(data: number[]): void {
        this.x += this.unconvCoord(data[0], data[1]);
        this.y += this.unconvCoord(data[2], data[3]);
    }

    resize(data: number[]): void {
        this.w = this.unconvCoord(data[0], data[1]);
        this.h = this.unconvCoord(data[2], data[3]);
    }
}
