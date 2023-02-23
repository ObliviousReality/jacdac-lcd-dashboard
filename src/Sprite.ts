import RenderItem from "./RenderItem.ts";

import sprites from "./sprites.json";
import Log from "./Logger.tsx";

export class Sprite extends RenderItem {
    x: number;
    y: number;
    spriteType: number;

    spriteData: number[][] = []
    w: number;
    h: number;

    constructor(params: number[]) {
        super(params);
        this.spriteType = params[0];
        this.x = params[1];
        this.y = params[2];
        let spriteJSON = sprites[this.spriteType.toString()];
        this.spriteData = spriteJSON.data;
        this.w = spriteJSON.width;
        this.h = spriteJSON.height;
    }

    draw(context: any, scale: any): void {
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale;
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.spriteData[j][i]) {
                    context.fillRect((this.x + i) * scale, (this.y + j) * scale, scale, scale);
                }
            }
        }
    }

    translate(data: number[]): void {
        this.x = data[0];
        this.y = data[1];
    }
}
