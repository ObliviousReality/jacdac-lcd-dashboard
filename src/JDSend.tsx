import { Packet, SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useServices } from "react-jacdac";
import RenderTypes from "./RenderTypes.ts";
import UpdateTypes from "./UpdateTypes.ts";
import { SpriteTypes } from "./SpriteTypes.ts";
import { InitTypes } from "./InitTypes.ts";
import Log from "./Logger.tsx";


export const JDSend = () => {
    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    var idCounter = 1;

    function convCoord(c: number) {
        let n = [0, 0];
        c = c + 32767;
        n[0] = c >> 8;
        n[1] = c & 0xff;
        return n;
    }

    function getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const sendInitCmd = (type: number, bit: number) => {
        let arr = new Uint8Array(2);
        arr[0] = RenderTypes.I;
        arr[1] = (type << 1) + bit;
        rotService.sendCmdAsync(10, arr, false)
    }

    const createGroup = (id, gid) => {
        let arr = new Uint8Array(3);
        arr[0] = RenderTypes.G;
        arr[1] = id;
        arr[2] = gid;
        rotService.sendCmdAsync(10, arr, false)
    }

    const createCircle = (x, y, r, z) => {
        let arr = new Uint8Array(9);
        arr[0] = RenderTypes.O;
        arr[1] = idCounter++;
        x = convCoord(x);
        arr[2] = x[0];
        arr[3] = x[1];
        y = convCoord(y);
        arr[4] = y[0];
        arr[5] = y[1];
        r = convCoord(r);
        arr[6] = r[0];
        arr[7] = r[1];
        arr[8] = z;
        rotService.sendCmdAsync(10, arr, false);
    }

    const createRect = (x, y, w, h, z) => {
        let arr = new Uint8Array(11);
        arr[0] = RenderTypes.R;
        arr[1] = idCounter++;
        x = convCoord(x);
        y = convCoord(y);
        w = convCoord(w);
        h = convCoord(h);
        arr[2] = x[0];
        arr[3] = x[1];
        arr[4] = y[0];
        arr[5] = y[1];
        arr[6] = w[0];
        arr[7] = w[1];
        arr[8] = h[0];
        arr[9] = h[1];
        arr[10] = z;
        rotService.sendCmdAsync(10, arr, false)
    }

    const createLine = (x1, y1, x2, y2, z) => {
        let arr = new Uint8Array(11);
        arr[0] = RenderTypes.L;
        arr[1] = idCounter++;
        x1 = convCoord(x1);
        x2 = convCoord(x2);
        y1 = convCoord(y1);
        y2 = convCoord(y2);
        arr[2] = x1[0];
        arr[3] = x1[1];
        arr[4] = y1[0];
        arr[5] = y1[1];
        arr[6] = x2[0];
        arr[7] = x2[1];
        arr[8] = y2[0];
        arr[9] = y2[1];
        arr[10] = z;
        rotService.sendCmdAsync(10, arr, false);
    }

    const createUpdate = (uid, ut, p: number[]) => {
        let arr = new Uint8Array(3 + (p.length * 2));
        arr[0] = RenderTypes.U;
        arr[1] = uid;
        arr[2] = ut;
        let n = 3;
        p.map((item) => { let splitem = convCoord(item); arr[n++] = splitem[0]; arr[n++] = splitem[1]; });
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

    const setColour = (r: number, g: number, b: number, a: number = 255) => {
        // Log([r, g, b]);
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.C;
        arr[1] = r;
        arr[2] = g;
        arr[3] = b;
        arr[4] = a;
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
        createUpdate(1, UpdateTypes.P, [0, 0]);
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

    const renderScreen = () => {
        let arr = new Uint8Array(1);
        arr[0] = RenderTypes.B;
        rotService.sendCmdAsync(10, arr, false);
        idCounter = 1;
    }

    const drawASprite = () => {
        drawSprite(50, 50, SpriteTypes.A, 60);
    }

    const drawBSprite = () => {
        drawSprite(56, 50, SpriteTypes.B, 60);
    }

    const drawSprite = (x, y, id: number, z: number) => {
        let arr = new Uint8Array(8);
        arr[0] = RenderTypes.S;
        arr[1] = idCounter++;
        arr[2] = id;
        x = convCoord(x);
        y = convCoord(y);
        arr[3] = x[0];
        arr[4] = x[1];
        arr[5] = y[0];
        arr[6] = y[1];
        arr[7] = z;
        rotService.sendCmdAsync(10, arr, false);
    }

    const sayHello = () => {
        drawSprite(50, 60, SpriteTypes.H, 60);
        drawSprite(56, 60, SpriteTypes.E, 60);
        drawSprite(62, 60, SpriteTypes.L, 60);
        drawSprite(68, 60, SpriteTypes.L, 60);
        drawSprite(74, 60, SpriteTypes.O, 60);
    }

    const theRest = () => {
        drawSprite(62, 70, SpriteTypes.I, 60);
        drawSprite(56, 80, SpriteTypes.A, 60);
        drawSprite(62, 80, SpriteTypes.M, 60);
        drawSprite(74, 80, SpriteTypes.A, 60);
        drawSprite(50, 90, SpriteTypes.S, 60);
        drawSprite(56, 90, SpriteTypes.P, 60);
        drawSprite(62, 90, SpriteTypes.R, 60);
        drawSprite(68, 90, SpriteTypes.I, 60);
        drawSprite(74, 90, SpriteTypes.T, 60);
        drawSprite(80, 90, SpriteTypes.E, 60);
        drawSprite(86, 90, SpriteTypes.question_mark, 60);
    }

    const alphabet = () => {
        createGroup(70, 2);
        for (let i = 0; i < 26; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 5, SpriteTypes.A + i, 60);
        }
        for (let i = 0; i < 26; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 15, SpriteTypes.a + i, 61);
        }
        for (let i = 0; i < 10; i++) {
            setRandom();
            drawSprite(3 + 6 * i, 25, SpriteTypes.NUM_0 + i, 62);
        }
        createGroup(0, 0);
        renderScreen();
    }

    const bigAlphabet = () => {
        createUpdate(70, UpdateTypes.S, [2]);
    }
    const smallAlphabet = () => {
        createUpdate(70, UpdateTypes.S, [1]);
    }

    const groupTest = () => {
        createGroup(69, 1);
        setFill(true);
        setColour(255, 255, 255);
        createCircle(80, 80, 20, 5);
        createCircle(80, 45, 15, 5);
        setColour(255, 10, 255);
        createRect(70, 15, 20, 20, 5);
        createLine(60, 35, 100, 35, 5);
        createGroup(0, 0);
    }

    const moveGroup = () => {
        createUpdate(69, UpdateTypes.T, [10, 10]);
    }

    const moveGroup2 = () => {
        createUpdate(69, UpdateTypes.T, [-10, -10]);
    }

    const bigGroup = () => {
        createUpdate(69, UpdateTypes.S, [2]);
    }
    const regularGroup = () => {
        createUpdate(69, UpdateTypes.S, [1]);
    }

    const autoRenderOn = () => {
        sendInitCmd(InitTypes.A, 1);
    }

    const autoRenderOff = () => {
        sendInitCmd(InitTypes.A, 0);
    }

    const fishtank = () => {
        setColour(255, 177, 0, 255);
        createGroup(100, 10);
        drawSprite(75, 55, SpriteTypes.fish, 30);
        // drawSprite(getRndInteger(0, 160), getRndInteger(0, 120), SpriteTypes.fish, 30);
        createGroup(101, 11);
        drawSprite(getRndInteger(0, 160), getRndInteger(0, 120), SpriteTypes.fish, 30);
        createGroup(102, 12);
        drawSprite(getRndInteger(0, 160), getRndInteger(0, 120), SpriteTypes.fish, 30);
        createGroup(103, 13);
        drawSprite(getRndInteger(0, 160), getRndInteger(0, 120), SpriteTypes.fish, 30);
        createGroup(0, 0);
        setFill(true);
        setColour(0, 0, 255, 128);
        createRect(0, 0, 160, 120, 40);
    }

    const movethefish = () => {
        createUpdate(100, UpdateTypes.T, [getRndInteger(-50, 50), getRndInteger(-50, 50)]);
        createUpdate(101, UpdateTypes.T, [getRndInteger(-50, 50), getRndInteger(-50, 50)]);
        createUpdate(102, UpdateTypes.T, [getRndInteger(-50, 50), getRndInteger(-50, 50)]);
        createUpdate(103, UpdateTypes.T, [getRndInteger(-50, 50), getRndInteger(-50, 50)]);
    }

    const newSprite = (id, w, h, data: number[]) => {
        let arr = new Uint8Array(4 + Math.ceil((w * h) / 8));
        arr[0] = RenderTypes.N;
        arr[1] = id;
        arr[2] = w;
        arr[3] = h;
        let next = 4;
        for (let i = 0; i < Math.ceil((w * h) / 8); i++) {
            let temp = 0;
            let ctr = 7;
            for (let j: number = 0 + (i * 8); ctr >= 0; j++) {
                temp = temp + ((data[j] != undefined ? data[j] : 0) << ctr);
                ctr--;
            }
            arr[next] = temp;
            next++;
        }
        Log(arr.length.toString());
        // rotService.sendCmdAsync(10, arr, false);
        rotService.sendPacketAsync(Packet.from(0x080, arr));
    }

    const addSprite1 = () => {
        let data =
            [1, 0, 1,
                0, 1, 0,
                1, 0, 1];
        newSprite(72, 3, 3, data);
    }
    const addSprite2 = () => {
        let w = 43;
        let h = 43;
        let data: number[] = [];
        for (let i = 0; i < w * h; i++) {
            data[i] = getRndInteger(0, 2);
        }
        Log(data.length.toString());
        newSprite(70, w, h, data);
    }

    const drawSprite1 = () => {
        drawSprite(80, 80, 72, 100);
    }

    const drawSprite2 = () => {
        drawSprite(20, 20, 70, 100);
    }

    if (rotService != null) {

        return (
            <div>
                <div>
                    <button onClick={autoRenderOn}>Enable Auto Render</button>
                    <button onClick={autoRenderOff}>Disable Auto Render</button>
                </div>
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
                    <button onClick={bigAlphabet}>Big</button>
                    <button onClick={smallAlphabet}>Small</button>
                </div>
                <div>
                    <button onClick={groupTest}>Snowman</button>
                    <button onClick={moveGroup}>Move Down</button>
                    <button onClick={moveGroup2}>Move Up</button>
                    <button onClick={bigGroup}>Scale Up</button>
                    <button onClick={regularGroup}>Scale Down</button>
                </div>
                <div>
                    <button onClick={fishtank}>Fish Tank</button>
                    <button onClick={movethefish}>Poke the tank</button>
                </div>
                <div>
                    <button onClick={addSprite1}>Add Sprite</button>
                    <button onClick={drawSprite1}>Draw Sprite</button>
                    <button onClick={addSprite2}>Add Sprite 2</button>
                    <button onClick={drawSprite2}>Draw Sprite 2</button>
                </div>
                <div>
                    <button onClick={renderScreen}>Render</button>
                    <button onClick={clearScreen}>Clear</button>
                </div>
            </div >
        )
    }
}
export default JDSend;
