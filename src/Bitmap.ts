import Log from "./Logger.tsx";


export class Bitmap {

    width: number;
    height: number;

    buf: number[][];

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.buf = new Array(Math.ceil(w * h / 2));
    }

    set(x: number, y: number, colour: number[]) {
        if (x >= 0 && y >= 0) {
            let i: number = this.coord(x, y);
            this.buf[i] = colour;
        }
    }

    fillLine(x1: number, y1: number, x2: number, y2: number, c: number[]) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const absdx = Math.abs(dx);
        const absdy = Math.abs(dy);

        let x = x1;
        let y = y1;
        this.set(x, y, c);

        // slope < 1
        if (absdx > absdy) {

            let d = 2 * absdy - absdx;

            for (let i = 0; i < absdx; i++) {
                x = dx < 0 ? x - 1 : x + 1;
                if (d < 0) {
                    d = d + 2 * absdy
                } else {
                    y = dy < 0 ? y - 1 : y + 1;
                    d = d + (2 * absdy - 2 * absdx);
                }
                this.set(x, y, c);
            }
        } else { // case when slope is greater than or equals to 1
            let d = 2 * absdx - absdy;

            for (let i = 0; i < absdy; i++) {
                y = dy < 0 ? y - 1 : y + 1;
                if (d < 0)
                    d = d + 2 * absdx;
                else {
                    x = dx < 0 ? x - 1 : x + 1;
                    d = d + (2 * absdx) - (2 * absdy);
                }
                this.set(x, y, c);
            }
        }
    }

    fillRect(x, y, w, h, colour) {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.set(i, j, colour);
            }
        }
    }

    get(x: number, y: number) {
        if (x >= 0 && y >= 0) {
            let index: number = this.coord(x, y);
            if (this.buf[index] == undefined) {
                return [0, 0, 0];
            }
            return this.buf[index];
        }
        return [0, 0, 0];
    }

    coord(c: number, r: number) {
        return c + r * this.width;
    }
}