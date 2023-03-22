import Log from "./Logger.tsx";

export class Bitmap {

    width: number; // Width of the screen
    height: number; // Height of the screen.

    buf: number[][]; // The buffer.

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.buf = new Array(Math.ceil(w * h / 2));
    }

    set(x: number, y: number, colour: number[]) {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) { // Bounds check
            let i: number = this.coord(x, y); // Conv from 2D coords to 1D index.
            if (colour[3] != undefined) { // If an alpha is given
                if (colour[3] < 255) { // If transparency:
                    let prevCol = this.buf[i]; // Old colour
                    let newCol: number[] = []; // Temp new colour
                    if (prevCol[3] == undefined)
                        prevCol[3] = 255; // Set to opaque if it already wasn't.
                    newCol[3] = (colour[3] + (prevCol[3] * (255 - colour[3])) / 255); // New alpha.
                    for (let channel = 0; channel < 3; channel++) { // New r,g,b, values.
                        let t = ((prevCol[channel] + colour[channel]) / (prevCol[3] / colour[3])) // Alpha blending.
                        if (t > 255) // Bounds check
                            t = 255;
                        if (t < 0)
                            t = 0;
                        newCol[channel] = t;
                    }
                    this.buf[i] = newCol; // Update
                }
                else { // If it's opaque then don't worry about whats underneath.
                    this.buf[i] = colour;
                }
            }
            else {
                this.buf[i] = colour;
            }
        }
    }

    // Fills a line of pixels between the two coordinates, using the specified colour.
    // This is bresenham's algorith, code was provided to me.
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

    // Fills a solid rectangle with the specified size and colour.
    fillRect(x, y, w, h, colour) {
        for (let i = x; i < x + w; i++) {
            for (let j = y; j < y + h; j++) {
                this.set(i, j, colour);
            }
        }
    }

    // Gets the colour from a specific coordinate.
    get(x: number, y: number) {
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) { // Bounds check.
            let index: number = this.coord(x, y); // Flatten coord.
            if (this.buf[index] == undefined) { // If no colour then black
                return [0, 0, 0];
            }
            return this.buf[index]; // Return colour
        }
        return [0, 0, 0]; 
    }

    // FLattens a 2D coord into a 1D index.
    coord(c: number, r: number) {
        return c + r * this.width;
    }
}
