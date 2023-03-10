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
        // Log(colour);
        if (x >= 0 && y >= 0 && x < 160 && y < 120) {
            let i: number = this.coord(x, y);
            if (colour[3] != undefined) {
                if (colour[3] < 255) { // Theoretically, alpha blending:
                    let prevCol = this.buf[i];
                    let newCol: number[] = [];
                    if (prevCol[3] == undefined)
                        prevCol[3] = 255;
                    newCol[3] = (colour[3] + (prevCol[3] * (255 - colour[3])) / 255);
                    // Log([colour[2], prevCol[3], colour[3]]);
                    for (let channel = 0; channel < 3; channel++) {
                        let t = ((prevCol[channel] + colour[channel]) / (prevCol[3] / colour[3]))
                        //Still not perfect, needs a bit more debugging with non-mutually exclusive colours.
                        // if (x == 80 && y == 60) {
                        //     Log([prevCol[channel], prevCol[3], colour[3]]);
                        //     Log(t.toString());
                        // }
                        if (t > 255)
                            t = 255;
                        if (t < 0)
                            t = 0;
                        newCol[channel] = t;
                    }
                    // if (x == 80 && y == 60) {
                    //     Log("Middle:");
                    //     Log(prevCol);
                    //     Log(colour);
                    //     Log(newCol);
                    // }
                    // if (x == 0 && y == 0) {
                    //     Log("Top Left:");
                    //     Log(prevCol);
                    //     Log(colour);
                    //     Log(newCol);
                    // }
                    this.buf[i] = newCol;
                }
                else {
                    this.buf[i] = colour;
                    // if (x == 80 && y == 60) {
                    //     Log("Middle:");
                    //     Log(colour);
                    // }
                }
            }
            else {
                this.buf[i] = colour;
                // if (x == 80 && y == 60) {
                //     Log("Middle:");
                //     Log(colour);
                // }
            }
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
