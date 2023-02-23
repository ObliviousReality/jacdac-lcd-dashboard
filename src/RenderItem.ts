import { globalColour, globalDrawWidth, globalFilled, globalGroup, groupList } from "./Canvas.tsx";
import RenderTypes from "./RenderTypes.ts";
import Log from "./Logger.tsx";

export class RenderItem {
    type: number | undefined;
    id: number | undefined;
    data: number[];

    z: number = 1;

    colour: number[] = [];
    width: number;
    filled: boolean;

    visibility: boolean = true;
    angle: number = 0;
    localScale: number = 1;

    next: RenderItem | undefined = undefined;

    constructor(params: number[]) {
        this.type = params.shift();
        this.id = params.shift();
        if (this.type != RenderTypes.G)
            this.z = params.pop();
        if (this.z == 0) {
            if (this.id != 256) {
                this.z = 1;
            }

        }
        this.data = params;

        this.colour.push(globalColour[0]);
        this.colour.push(globalColour[1]);
        this.colour.push(globalColour[2]);

        this.filled = globalFilled;
        this.width = globalDrawWidth;

        if (globalGroup > 0) {
            groupList[globalGroup - 1].items.push(this);
        }
    }

    getNext() {
        return this.next;
    }

    setNext(newNext: RenderItem) {
        this.next = newNext;
    }

    clearNext() {
        this.next = undefined;
    }

    draw(context, scale) {
        Log("Drawing in the wrong place.");
    }

    translate(data: number[]) {
        Log("Base Class; No functionality.")
    }

    resize(data: number[]) {
        Log("Base Class; No functionality.")
    }

    setPosition(data: number[]){
        Log("Base Class; No functionality.")
    }

    setVisibility(nv: boolean) {
        this.visibility = nv;
    }

    setLayer(nz: number) {
        this.z = nz;
        // Needs to do MORE.
    }

    setColour(colour: number[]) {
        this.colour[0] = colour[0];
        this.colour[1] = colour[1];
        this.colour[2] = colour[2];
    }

    setFilled(nf: boolean) {
        this.filled = nf;
    }

    setWidth(nw: number) {
        this.width = nw;
    }

    setAngle(na: number) {
        this.angle = na;
    }

    setScale(ns: number) {
        this.localScale = ns;
    }


}

export default RenderItem;
