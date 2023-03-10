import { advancedRenderMode, buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";

import sprites from "./sprites.json";

export class Sprite extends RenderItem {
    spriteType: number;

    spriteData: number[][] = []
    w: number;
    h: number;

    constructor(params: number[]) {
        super(params);
        this.spriteType = params.shift();
        if (params.length > 3) {
            this.x = this.unconvCoord(params[0], params[1]);
            this.y = this.unconvCoord(params[2], params[3]);
        } else {
            this.x = params[0];
            this.y = params[1];
        }
        let spriteJSON = sprites[this.spriteType.toString()];
        this.spriteData = spriteJSON.data;
        this.w = spriteJSON.width;
        this.h = spriteJSON.height;
    }

    draw(context: any, scale: any): void {
        context.fillStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.strokeStyle = `rgb(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]})`;
        context.lineWidth = this.width * scale * this.localScale;
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.spriteData[j][i]) {
                    if (advancedRenderMode) {
                        // for (let k = (this.x + (i)); k < (this.x + (i * this.localScale)); k++) {
                        //     for (let l = (this.y + (j)); l < (this.y + (j * this.localScale)); l++) {
                        //         buffer.set(k, l, this.colour);
                        //     }
                        // }
                        buffer.fillRect(this.x + (i * this.localScale), this.y + (j * this.localScale), this.localScale, this.localScale, this.colour);
                        // Log("Setting sprite pixel X: " + i.toString() + " Y: " + j.toString());
                    } else {
                        context.fillRect((this.x + (i * this.localScale)) * scale, (this.y + (j * this.localScale)) * scale, scale * this.localScale, scale * this.localScale);
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
}
