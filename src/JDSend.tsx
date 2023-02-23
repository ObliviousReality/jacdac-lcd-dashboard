import { SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useServices } from "react-jacdac";
import RenderTypes from "./RenderTypes.ts";
import UpdateTypes from "./UpdateTypes.ts";


export const JDSend = () => {
    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    var idCounter = 1;

    function getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    const drawRect = () => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.R;
        arr[1] = idCounter++;
        arr[2] = 80;
        arr[3] = 60;
        arr[4] = 10;
        arr[5] = 40;
        arr[6] = 1;
        rotService.sendCmdAsync(10, arr, false)
    }

    const drawLine = () => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.L;
        arr[1] = idCounter++;
        arr[2] = 120;
        arr[3] = 10;
        arr[4] = 10;
        arr[5] = 120;
        arr[6] = 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawCircle = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.O;
        arr[1] = idCounter++;
        arr[2] = 80;
        arr[3] = 30;
        arr[4] = 10;
        arr[5] = 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawRandomLine = () => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.L;
        arr[1] = idCounter++;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(0, 160);
        arr[5] = getRndInteger(0, 120);
        arr[6] = getRndInteger(1, 10);
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawRandomRect = () => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.R;
        arr[1] = idCounter++;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(0, 160 - arr[2]);
        arr[5] = getRndInteger(0, 120 - arr[3]);
        arr[6] = getRndInteger(11, 20);
        rotService.sendCmdAsync(10, arr, false)
    }

    const drawRandomCircle = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.O;
        arr[1] = idCounter++;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(1, 50);
        arr[5] = getRndInteger(21, 30);
        rotService.sendCmdAsync(10, arr, false);
    }

    const setColour = (r: number, g: number, b: number) => {
        let arr = new Uint8Array(4);
        arr[0] = RenderTypes.C;
        arr[1] = r;
        arr[2] = g;
        arr[3] = b;
        rotService.sendCmdAsync(10, arr, false);
    }

    const setRed = () => {
        setColour(255, 0, 0);
    }

    const setGreen = () => {
        setColour(0, 255, 0);
    }

    const setBlue = () => {
        setColour(0, 0, 255);
    }

    const setRandom = () => {
        setColour(getRndInteger(0, 255), getRndInteger(0, 255), getRndInteger(0, 255));
    }

    const setFill = (fill: boolean) => {
        let arr = new Uint8Array(2);
        arr[0] = RenderTypes.F;
        arr[1] = fill ? 1 : 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const fill = () => {
        setFill(true);
    }

    const empty = () => {
        setFill(false);
    }

    const moveFirst = () => {
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.U;
        arr[1] = 1;
        arr[2] = UpdateTypes.T;
        arr[3] = 10;
        arr[4] = 10;
        rotService.sendCmdAsync(10, arr, false);
    }

    const delFirst = () => {
        let arr = new Uint8Array(2);
        arr[0] = RenderTypes.D;
        arr[1] = 1;
        rotService.sendCmdAsync(10, arr, false);
    }

    const clearScreen = () => {
        let arr = new Uint8Array(1);
        arr[0] = RenderTypes.X;
        rotService.sendCmdAsync(10, arr, false);
        idCounter = 1;
    }

    const drawASprite = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.S;
        arr[1] = idCounter++;
        arr[2] = 0;
        arr[3] = 50;
        arr[4] = 50;
        arr[5] = 60;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawBSprite = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.S;
        arr[1] = idCounter++;
        arr[2] = 1;
        arr[3] = 56;
        arr[4] = 50;
        arr[5] = 60;
        rotService.sendCmdAsync(10, arr, false);
    }

    if (rotService != null) {

        return (
            <div>
                <div>
                    <button onClick={drawRect}>Rect</button>
                    <button onClick={drawLine}>Line</button>
                    <button onClick={drawCircle}>Circle</button>
                    <button onClick={moveFirst}>Move First</button>
                    <button onClick={delFirst}>Delete First</button>
                </div>
                <div>
                    <button onClick={drawRandomRect}>Random Rect</button>
                    <button onClick={drawRandomLine}>Random Line</button>
                    <button onClick={drawRandomCircle}>Random Circle</button>
                </div>
                <div>
                    <button onClick={setRed} className="redButton">Red</button>
                    <button onClick={setGreen} className="greenButton">Green</button>
                    <button onClick={setBlue} className="blueButton">Blue</button>
                    <button onClick={setRandom}>Random</button>
                </div>
                <div>
                    <button onClick={fill}>Set Filled</button>
                    <button onClick={empty} className="emptyButton">Set Empty</button>
                </div>
                <div>
                    <button onClick={drawASprite}>Draw A</button>
                    <button onClick={drawBSprite}>Draw B</button>
                </div>
                <div>
                    <button onClick={clearScreen}>Clear</button>
                </div>
            </div >
        )
    }
}
export default JDSend;
