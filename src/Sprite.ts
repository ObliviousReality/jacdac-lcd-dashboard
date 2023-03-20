import { advancedRenderMode, buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";

import sprites from "./sprites.json";

export class Sprite extends RenderItem {
    spriteType: number;

    spriteData: number[][] = []
    w: number;
    h: number;

    static bonusSprites = { "sprites": [] }
    static spriteOffset: number = 0;

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
        if (spriteJSON == undefined) {
            spriteJSON = Sprite.bonusSprites.sprites[this.spriteType - Sprite.spriteOffset];
            if (spriteJSON == undefined) {
                Log("Can't find sprite; exiting");
                return;
            }
        }
        this.spriteData = spriteJSON.data;
        this.w = spriteJSON.width;
        this.h = spriteJSON.height;
    }

    draw(scale: any): void {
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.spriteData[j][i]) {
                    buffer.fillRect(this.x + (i * this.localScale), this.y + (j * this.localScale), this.localScale, this.localScale, this.colour);
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

    static addSprite(data) {
        let sid = data.shift();
        let w = data.shift();
        let h = data.shift();

        if (Sprite.spriteOffset == 0) {
            Sprite.spriteOffset = Object.keys(sprites).length;
        }
        let sdata: number[][] = [];
        let ctr = 0;
        let index = 0;
        let tdata: number[] = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 7; j >= 0; j--) {
                if (data[i] & (1 << j)) {
                    tdata.push(1);
                }
                else {
                    tdata.push(0);
                }
            }
        }
        for (let i = 0; i < h; i++) {
            let n: number[] = [];
            for (let j = 0; j < w; j++) {
                n.push(tdata.shift());
            }
            sdata.push(n);
        }
        Sprite.bonusSprites.sprites[(sid - Sprite.spriteOffset).toString()] = { "width": w, "height": h, "data": sdata };

    }
}
