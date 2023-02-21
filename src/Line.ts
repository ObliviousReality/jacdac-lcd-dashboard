import RenderItem from "./RenderItem.ts";

export class Line extends RenderItem {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(params: number[]) {
        super(params);
        this.x1 = params[0];
        this.y1 = params[1];
        this.x2 = params[2];
        this.y2 = params[3];
    }

    draw(context: any, scale: any): void {
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        context.beginPath();
        context.moveTo(this.x1 * scale, this.y1 * scale);
        context.lineTo(this.x2 * scale, this.y2 * scale);
        context.stroke();
    }

    translate(data: number[]): void {
        this.x1 = data[0];
        this.y1 = data[1];
    }

    resize(data: number[]): void {
        this.x2 = data[0];
        this.y2 = data[1];
    }
}
