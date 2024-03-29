import { buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";

export class Line extends RenderItem {
    x: number; // Coord 1
    y: number;
    x2: number; // Coord 2
    y2: number;

    constructor(params: number[]) {
        super(params);
        this.x = this.unconvCoord(params[0], params[1]);
        this.y = this.unconvCoord(params[2], params[3]);
        this.x2 = this.unconvCoord(params[4], params[5]);
        this.y2 = this.unconvCoord(params[6], params[7]);
    }

    draw(scale: any): void {
        buffer.fillLine(this.x, this.y, this.x2, this.y2, this.colour);
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
