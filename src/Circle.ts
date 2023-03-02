import { advancedRenderMode, setPixel } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";


export class Circle extends RenderItem {
    x: number;
    y: number;
    r: number;

    constructor(params: number[]) {
        super(params);
        this.x = params[0];
        this.y = params[1];
        this.r = params[2];
    }

    draw(context: any, scale: any): void {
        if (advancedRenderMode) {
            this.x = this.x | 0;
            this.y = this.y | 0;
            this.r = this.r | 0;
            // short cuts
            if (this.r < 0)
                return;

            // Bresenham's algorithm
            let x = 0
            let y = this.r
            let d = 3 - 2 * this.r

            while (y >= x) {
                setPixel(this.x + x, this.y + y, this.colour);
                setPixel(this.x - x, this.y + y, this.colour);
                setPixel(this.x + x, this.y - y, this.colour);
                setPixel(this.x - x, this.y - y, this.colour);
                setPixel(this.x + y, this.y + x, this.colour);
                setPixel(this.x - y, this.y + x, this.colour);
                setPixel(this.x + y, this.y - x, this.colour);
                setPixel(this.x - y, this.y - x, this.colour);
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

        }
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        context.beginPath();
        context.arc(this.x * scale, this.y * scale, this.r * scale, 0, 2 * Math.PI);
        if (this.filled) {
            context.fill();
        }
        else {
            context.stroke();
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
        this.r = data[0];
    }


}
