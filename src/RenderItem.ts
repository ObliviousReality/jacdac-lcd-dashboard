import { globalColour, globalDrawWidth, globalFilled, globalGroup, groupList } from "./Canvas.tsx";
import RenderTypes from "./RenderTypes.ts";
import Log from "./Logger.tsx";

//TODO: Implement further.
export enum OriginTypes {
    TOPLEFT,
    // TOPCENTER,
    // TOPRIGHT,
    CENTER
    // BOTTOMLEFT,
    // BOTTOMCENTER,
    // BOTTOMRIGHT

}

export class RenderItem {
    type: number | undefined; // Type of item, like rect or circle
    id: number | undefined; // ID for later referencing.
    data: number[]; // Data.

    x: number; // X coord
    y: number; // Y Coord
    z: number = 1; // Z index

    colour: number[] = []; // Colour of this item
    width: number; // Width of this item
    filled: boolean; // Fill status of this item.

    visibility: boolean = true; // Whether this item is visible.
    angle: number = 0; // Angle of this item. TODO: Implement further.
    localScale: number = 1; // Scale of this item. TODO: Implement further.

    origin: number = OriginTypes.TOPLEFT; // Origin for angle and scale.

    next: RenderItem | undefined = undefined; // Creates a linked list.

    constructor(params: number[]) {
        this.type = params.shift();
        this.id = params.shift();
        if (this.type != RenderTypes.Group) // Groups have no layer.
            this.z = params.pop();
        if (this.z == 0) { // Item's can't have a Z of 0
            if (this.id != 256) { // Unless it's the background.
                this.z = 1;
            }

        }
        this.data = params;

        this.colour.push(globalColour[0]); // Builds colour var.
        this.colour.push(globalColour[1]);
        this.colour.push(globalColour[2]);
        this.colour.push(globalColour[3]);

        this.filled = globalFilled; // Sets vars
        this.width = globalDrawWidth;
        if (this.type != RenderTypes.G) { // If not a group: (TODO: Groups in groups?)
            if (globalGroup > 0) { // If a group has been selected
                let gr = groupList.find(g => g.groupID == globalGroup);
                if (gr) {
                    gr.items.push(this); // Add to group.
                }
            }
        }
    }

    // Converts the stored number form back into a single number.
    unconvCoord(upper, lower) {
        return ((upper << 8) + lower) - 32767;
    }

    //Linked list
    getNext() {
        return this.next;
    }

    //Linked list
    setNext(newNext: RenderItem) {
        this.next = newNext;
    }

    //Linked list
    clearNext() {
        this.next = undefined;
    }

    // Base draw method
    draw(scale) {
        Log("Drawing in the wrong place.");
    }

    // Base translate method
    translate(data: number[]) {
        Log("Translate");
        Log("Base Class; No functionality.")
    }

    // Base resize method
    resize(data: number[]) {
        Log("Resize");
        Log("Base Class; No functionality.")
    }

    // Base move method
    setPosition(data: number[]) {
        Log("Set Pos");
        Log("Base Class; No functionality.")
    }

    // Set visibility.
    setVisibility(nv: boolean) {
        this.visibility = nv;
    }

    // Set layer. Item will need to be moved in the LL.
    setLayer(nz: number) {
        this.z = nz;
    }

    // Sets colour
    setColour(colour: number[]) {
        this.colour[0] = colour[0];
        this.colour[1] = colour[1];
        this.colour[2] = colour[2];
    }

    // Sets fill status.
    setFilled(nf: boolean) {
        this.filled = nf;
    }

    //Sets draw width.
    setWidth(nw: number) {
        this.width = nw;
    }

    //Sets angle.
    setAngle(na: number) {
        this.angle = na;
    }

    //sets scale.
    setScale(ns: number) {
        this.localScale = ns;
    }


}

export default RenderItem;
