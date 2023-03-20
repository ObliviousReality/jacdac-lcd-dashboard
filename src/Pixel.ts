import { buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";

export class Pixel extends RenderItem {
    constructor(params: number[]) {
        super(params);
        this.x = this.unconvCoord(params[0], params[1]);
        this.y = this.unconvCoord(params[2], params[3]);
    }

    draw(scale: any): void {
        buffer.fillRect(this.x, this.y, 1, 1, this.colour);
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
        ;
    }
}
