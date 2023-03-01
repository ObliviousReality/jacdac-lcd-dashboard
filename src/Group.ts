import Log from "./Logger.tsx";
import RenderItem from "./RenderItem.ts";

export class Group extends RenderItem {
    groupID: number;
    items: RenderItem[] = [];
    visibility: boolean = false;

    constructor(params: number[]) {
        super(params);
        this.groupID = params[0];
        Log(params[0].toString());
    }

    draw(context: any, scale: any): void {
        ;
    }

    setVisibility(nv: boolean): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].setVisibility(nv);
        }
    }

    setPosition(data: number[]): void {
        let xT: number = data[0];
        let yT: number = data[1];
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].translate([xT, yT]);
        }
    }

    translate(data: number[]): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].translate(data);
        }
    }

    resize(data: number[]): void {
        Log("Error: Cannot resize a group.");
    }

    setColour(colour: number[]): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].setColour(colour);
        }
    }

    setAngle(na: number): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].setAngle(na);
        }
    }

    setScale(ns: number): void {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].setScale(ns);
        }
    }


}
