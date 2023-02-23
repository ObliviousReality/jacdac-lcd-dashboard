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
