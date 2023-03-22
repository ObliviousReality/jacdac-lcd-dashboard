import Log from "./Logger.tsx";
import RenderItem from "./RenderItem.ts";

export class Group extends RenderItem {
    groupID: number;
    items: RenderItem[] = []; // List of items in the group.

    constructor(params: number[]) {
        super(params);
        this.groupID = params[0];
        this.visibility = false; // Override to be false.
    }

    draw(scale: any): void {
        ; // No draw command
    }

    // All the update commands are edited to affect the items in the group not the group itself.

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
        // This is because the three resizeable elements all have to be manipulated in different ways to resize them.
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
