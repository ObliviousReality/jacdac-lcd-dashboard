import RenderItem from "./RenderItem.ts";

export class Pixel extends RenderItem {
    x: number;
    y: number;
    constructor(params: number[]) {
        super(params);
        this.x = params[0];
        this.y = params[1];
    }

    draw(context: any, scale: any): void {
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        context.strokeRect(this.x * scale, this.y * scale, scale, scale);
    }

    translate(data: number[]): void {
        this.x = data[0];
        this.y = data[1];
    }

    resize(data: number[]): void {
        ;
    }
}
