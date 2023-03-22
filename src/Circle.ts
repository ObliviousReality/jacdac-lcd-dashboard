import { buffer } from "./Canvas.tsx";
import { RenderItem, OriginTypes } from "./RenderItem.ts";
import Log from "./Logger.tsx";


export class Circle extends RenderItem {
    r: number; // Radius

    constructor(params: number[]) {
        super(params);
        this.x = this.unconvCoord(params[0], params[1]);
        this.y = this.unconvCoord(params[2], params[3]);
        this.r = this.unconvCoord(params[4], params[5]);
        this.originType = OriginTypes.CENTER; // Circles, unlike other shapes, are centered in the middle.
    }

    draw(scale: any): void {
        if (this.filled) {
            let scaledRadius = (this.r * this.localScale); // allows scaling.
            this.x = this.x | 0;
            this.y = this.y | 0;
            scaledRadius = scaledRadius | 0;
            // short cuts
            if (scaledRadius < 0)
                return;

            // Bresenham's algorithm, yet again provided to me.
            let x = 0
            let y = scaledRadius
            let d = 3 - 2 * scaledRadius

            while (y >= x) {
                buffer.fillLine(this.x + x, this.y + y, this.x - x, this.y + y, this.colour);
                buffer.fillLine(this.x + x, this.y - y, this.x - x, this.y - y, this.colour);
                buffer.fillLine(this.x + y, this.y + x, this.x - y, this.y + x, this.colour);
                buffer.fillLine(this.x + y, this.y - x, this.x - y, this.y - x, this.colour);
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
            for (let off = - Math.floor(this.width / 2); off < Math.ceil(this.width / 2); off++) {
                let scaledRadius = (this.r * this.localScale) + off;
                this.x = this.x | 0;
                this.y = this.y | 0;
                scaledRadius = scaledRadius | 0;
                // short cuts
                if (scaledRadius < 0)
                    return;

                // Bresenham's algorithm, yet again provided to me.
                let x = 0
                let y = scaledRadius
                let d = 3 - 2 * scaledRadius

                while (y >= x) {
                    buffer.set(this.x + x, this.y + y, this.colour);
                    buffer.set(this.x - x, this.y + y, this.colour);
                    buffer.set(this.x + x, this.y - y, this.colour);
                    buffer.set(this.x - x, this.y - y, this.colour);
                    buffer.set(this.x + y, this.y + x, this.colour);
                    buffer.set(this.x - y, this.y + x, this.colour);
                    buffer.set(this.x + y, this.y - x, this.colour);
                    buffer.set(this.x - y, this.y - x, this.colour);
                    x++
                    if (d > 0) {
                        y--
                        d += 4 * (x - y) + 10
                    } else {
                        d += 4 * x + 6
                    }
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
        this.r = this.unconvCoord(data[0], data[1]);
    }


}
