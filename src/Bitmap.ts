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