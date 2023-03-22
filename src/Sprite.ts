import { advancedRenderMode, buffer } from "./Canvas.tsx";
import RenderItem from "./RenderItem.ts";
import Log from "./Logger.tsx";

import sprites from "./sprites.json";

export class Sprite extends RenderItem {
    spriteType: number;

    spriteData: number[][] = [] // Array of sprite data.
    w: number;
    h: number;

    static bonusSprites = { "sprites": [] } // JSON of extra sprites, global.
    static spriteOffset: number = 0; // Index of the largest inbuilt sprite ID.

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
        let spriteJSON = sprites[this.spriteType.toString()]; // Get sprite from JSON.
        if (spriteJSON == undefined) { // If failed:
            spriteJSON = Sprite.bonusSprites.sprites[this.spriteType - Sprite.spriteOffset];
            // ^ Try and find the sprite in the local memory.
            if (spriteJSON == undefined) { // If that failed it doesn't exist.
                Log("Can't find sprite; exiting");
                return;
            }
        }
        // Build vars:
        this.spriteData = spriteJSON.data;
        this.w = spriteJSON.width;
        this.h = spriteJSON.height;
    }

    draw(scale: any): void {
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.spriteData[j][i]) { // If 1 draw pixel, if 0 then don't
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

    //Global function for adding new sprites. 
    static addSprite(data) {
        let sid = data.shift();
        let w = data.shift();
        let h = data.shift();

        if (Sprite.spriteOffset == 0) { // If not set:
            Sprite.spriteOffset = Object.keys(sprites).length; // Largest index.
        }
        let sdata: number[][] = []; // Sprite data
        let tdata: number[] = []; // Temp data.
        for (let i = 0; i < data.length; i++) {
            for (let j = 7; j >= 0; j--) { // Each byte stores 8 pixels
                if (data[i] & (1 << j)) { // Unpack data
                    tdata.push(1);
                }
                else {
                    tdata.push(0);
                }
            }
        }
        // Convert from 1D array to 2D
        for (let i = 0; i < h; i++) {
            let n: number[] = [];
            for (let j = 0; j < w; j++) {
                n.push(tdata.shift());
            }
            sdata.push(n);
        }
        // Add to internal dictionary:
        Sprite.bonusSprites.sprites[(sid - Sprite.spriteOffset).toString()] = { "width": w, "height": h, "data": sdata };
        //TODO: Functionality to save these permanently in flash?

    }
}
