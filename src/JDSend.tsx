import { SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useServices } from "react-jacdac";
import RenderTypes from "./RenderTypes.ts";
import UpdateTypes from "./UpdateTypes.ts";
import { SpriteTypes } from "./SpriteTypes.ts";


export const JDSend = () => {
    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    var idCounter = 1;

    function getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const createGroup = (id) => {
        let arr = new Uint8Array(3);
        arr[0] = RenderTypes.G;
        arr[1] = 69;
        arr[2] = id;
        rotService.sendCmdAsync(10, arr, false)
    }

    const createCircle = (x, y, r, z) => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.O;
        arr[1] = idCounter++;
        arr[2] = x;
        arr[3] = y;
        arr[4] = r;
        arr[5] = z;
        rotService.sendCmdAsync(10, arr, false);
    }

    const createRect = (x, y, w, h, z) => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.R;
        arr[1] = idCounter++;
        arr[2] = x;
        arr[3] = y;
        arr[4] = w;
        arr[5] = h;
        arr[6] = z;
        rotService.sendCmdAsync(10, arr, false)
    }

    const createLine = (x1, y1, x2, y2, z) => {
        let arr = new Uint8Array(7);
        arr[0] = RenderTypes.L;
        arr[1] = idCounter++;
        arr[2] = x1;
        arr[3] = y1;
        arr[4] = x2;
        arr[5] = y2;
        arr[6] = z;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawRect = () => {
        createRect(80, 60, 10, 40, 1);
    }

    const drawLine = () => {
        createLine(120, 10, 10, 120, 0);
    }

    const drawCircle = () => {
        createCircle(80, 30, 10, 0);
    }

    const drawRandomLine = () => {
        createLine(getRndInteger(0, 160), getRndInteger(0, 120), getRndInteger(0, 160), getRndInteger(0, 120), getRndInteger(1, 10));
    }

    const drawRandomRect = () => {
        createRect(getRndInteger(0, 160), getRndInteger(0, 120), getRndInteger(0, 160), getRndInteger(0, 120), getRndInteger(11, 20));
    }

    const drawRandomCircle = () => {
        createCircle(getRndInteger(0, 160), getRndInteger(0, 120), getRndInteger(1, 50), getRndInteger(21, 30));
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
        arr[2] = UpdateTypes.P;
        arr[3] = 0;
        arr[4] = 0;
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
        drawSprite(50, 50, SpriteTypes.A);
    }

    const drawBSprite = () => {
        drawSprite(56, 50, SpriteTypes.B);
    }

    const drawSprite = (x: number, y: number, id: number) => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.S;
        arr[1] = idCounter++;
        arr[2] = id;
        arr[3] = x;
        arr[4] = y;
        arr[5] = 60;
        rotService.sendCmdAsync(10, arr, false);
    }

    const sayHello = () => {
        drawSprite(50, 60, SpriteTypes.H);
        drawSprite(56, 60, SpriteTypes.E);
        drawSprite(62, 60, SpriteTypes.L);
        drawSprite(68, 60, SpriteTypes.L);
        drawSprite(74, 60, SpriteTypes.O);
    }

    const theRest = () => {
        drawSprite(62, 70, SpriteTypes.I);
        drawSprite(56, 80, SpriteTypes.A);
        drawSprite(62, 80, SpriteTypes.M);
        drawSprite(74, 80, SpriteTypes.A);
        drawSprite(50, 90, SpriteTypes.S);
        drawSprite(56, 90, SpriteTypes.P);
        drawSprite(62, 90, SpriteTypes.R);
        drawSprite(68, 90, SpriteTypes.I);
        drawSprite(74, 90, SpriteTypes.T);
        drawSprite(80, 90, SpriteTypes.E);
        drawSprite(86, 90, SpriteTypes.Exclamation_Mark);
    }

    const alphabet = () => {
        for (let i = 0; i < 26; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 5, SpriteTypes.A + i);
        }
        for (let i = 0; i < 26; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 15, SpriteTypes.a + i);
        }
        for (let i = 0; i < 10; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 25, SpriteTypes.NUM_0 + i);
        }
    }

    const groupTest = () => {
        createGroup(1);
        setFill(true);
        setColour(255, 255, 255);
        createCircle(80, 80, 20, 5);
        createCircle(80, 45, 15, 5);
        setColour(10, 10, 10);
        createRect(70, 15, 20, 20, 5);
        createLine(60, 35, 100, 35, 5);
        createGroup(0);
    }

    const moveGroup = () => {
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.U;
        arr[1] = 69;
        arr[2] = UpdateTypes.T;
        arr[3] = 10;
        arr[4] = 10;
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
                    <button onClick={sayHello}>Hello!</button>
                    <button onClick={theRest}>The Rest</button>
                    <button onClick={alphabet}>Alphabet</button>
                </div>
                <div>
                    <button onClick={groupTest}>Snowman</button>
                    <button onClick={moveGroup}>Move</button>
                </div>
                <div>
                    <button onClick={clearScreen}>Clear</button>
                </div>
            </div >
        )
    }
}
export default JDSend;
