import { advancedRenderMode, buffer } from "./Canvas.tsx";
import { RenderItem, OriginTypes } from "./RenderItem.ts";
import Log from "./Logger.tsx";


export class Circle extends RenderItem {
    r: number;

    constructor(params: number[]) {
        super(params);
        this.x = this.unconvCoord(params[0], params[1]);
        this.y = this.unconvCoord(params[2], params[3]);
        this.r = this.unconvCoord(params[4], params[5]);
        this.originType = OriginTypes.CENTER;
    }

    draw(context: any, scale: any): void {
        if (advancedRenderMode) {
            let scaledRadius = this.r * this.localScale;
            this.x = this.x | 0;
            this.y = this.y | 0;
            scaledRadius = scaledRadius | 0;
            // short cuts
            if (scaledRadius < 0)
                return;

            // Bresenham's algorithm
            let x = 0
            let y = scaledRadius
            let d = 3 - 2 * scaledRadius

            while (y >= x) {
                if (!this.filled) {
                    buffer.set(this.x + x, this.y + y, this.colour);
                    buffer.set(this.x - x, this.y + y, this.colour);
                    buffer.set(this.x + x, this.y - y, this.colour);
                    buffer.set(this.x - x, this.y - y, this.colour);
                    buffer.set(this.x + y, this.y + x, this.colour);
                    buffer.set(this.x - y, this.y + x, this.colour);
                    buffer.set(this.x + y, this.y - x, this.colour);
                    buffer.set(this.x - y, this.y - x, this.colour);
                }
                else {
                    buffer.fillLine(this.x + x, this.y + y, this.x - x, this.y + y, this.colour);
                    buffer.fillLine(this.x + x, this.y - y, this.x - x, this.y - y, this.colour);
                    buffer.fillLine(this.x + y, this.y + x, this.x - y, this.y + x, this.colour);
                    buffer.fillLine(this.x + y, this.y - x, this.x - y, this.y - x, this.colour);
                }
                x++
                if (d > 0) {
                    y--
                    d += 4 * (x - y) + 10
                } else {
                    d += 4 * x + 6
                }
            }
        }
        else {
            context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
            context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
            context.lineWidth = this.width * scale;
            context.beginPath();
            context.arc(this.x * scale, this.y * scale, scaledRadius * scale, 0, 2 * Math.PI);
            if (this.filled) {
                context.fill();
            }
            else {
                context.stroke();
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
        this.r = this.unconvCoord(data[0], data[1]);
    }


}
