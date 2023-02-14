import { PACKET_SEND, SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useServices } from "react-jacdac";
import { RenderItem, addItem, RenderTypes, clear } from "./Canvas.tsx";
import Log from "./Logger.tsx";

const JDConn = () => {

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    function getRndInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    const drawRect = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.R;
        arr[1] = 1;
        arr[2] = 80;
        arr[3] = 60;
        arr[4] = 10;
        arr[5] = 40;

        rotService.sendCmdAsync(10, arr, false)
    }

    const drawLine = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.L;
        arr[1] = 2;
        arr[2] = 120;
        arr[3] = 10;
        arr[4] = 10;
        arr[5] = 120;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawCircle = () => {
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.O;
        arr[1] = 3;
        arr[2] = 80;
        arr[3] = 30;
        arr[4] = 10;
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawRandomLine = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.L;
        arr[1] = 2;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(0, 160);
        arr[5] = getRndInteger(0, 120);
        rotService.sendCmdAsync(10, arr, false);
    }

    const drawRandomRect = () => {
        let arr = new Uint8Array(6);
        arr[0] = RenderTypes.R;
        arr[1] = 1;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(0, 160 - arr[2]);
        arr[5] = getRndInteger(0, 120 - arr[3]);
        rotService.sendCmdAsync(10, arr, false)
    }

    const drawRandomCircle = () => {
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.O;
        arr[1] = 3;
        arr[2] = getRndInteger(0, 160);
        arr[3] = getRndInteger(0, 120);
        arr[4] = getRndInteger(1, 50);
        rotService.sendCmdAsync(10, arr, false);
    }

    const setColour = (r: number, g: number, b: number) => {
        let arr = new Uint8Array(5);
        arr[0] = RenderTypes.C;
        arr[1] = 1;
        arr[2] = r;
        arr[3] = g;
        arr[4] = b;
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
        let arr = new Uint8Array(3);
        arr[0] = RenderTypes.F;
        arr[1] = 100;
        arr[2] = fill ? 1 : 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const fill = () => {
        setFill(true);
    }

    const empty = () => {
        setFill(false);
    }

    const handlePacket = (pkt) => {
        Log("Packet Received: " + pkt);
        let x: string = pkt.toString();
        let y = x.split(" ");
        let data = y[3];
        let newdata = data.match(/.{1,2}/g)?.toString().split(",");
        let outdata = newdata?.map((item) => parseInt(item, 16));
        if (!outdata) {
            console.log("Error with parsed Data");
            return;
        }
        switch (outdata[0]) {
            case RenderTypes.X:
                Log("Clear");
                clear();
                break;
            case RenderTypes.P:
                Log("Setting pixel");
                addItem(new RenderItem(RenderTypes.P, outdata[1], outdata[2], outdata[3]));
                break;
            case RenderTypes.C:
                Log("Setting colour");
                addItem(new RenderItem(RenderTypes.C, outdata[1], outdata[2], outdata[3], outdata[4]));
                break;
            case RenderTypes.F:
                Log("Setting filled status");
                addItem(new RenderItem(RenderTypes.F, outdata[1], outdata[2]));
                break;
            case RenderTypes.W:
                Log("Setting fill width");
                addItem(new RenderItem(RenderTypes.W, outdata[1], outdata[2]));
                break;
            case RenderTypes.R:
                Log("Rectangle!");
                addItem(new RenderItem(RenderTypes.R, outdata[1], outdata[2], outdata[3], outdata[4], outdata[5]));
                break;
            case RenderTypes.L:
                Log("Line");
                addItem(new RenderItem(RenderTypes.L, outdata[1], outdata[2], outdata[3], outdata[4], outdata[5]));
                break;
            case RenderTypes.O:
                Log("Drawing Circle");
                addItem(new RenderItem(RenderTypes.O, outdata[1], outdata[2], outdata[3], outdata[4]));
                break;
            case RenderTypes.U:
                Log("Update");
                //
                break;
            case RenderTypes.D:
                Log("Delete");
                //
                break;
            case RenderTypes.T:
                Log("Rotated Rectange");
                addItem(new RenderItem(RenderTypes.T, outdata[1], outdata[2], outdata[3], outdata[4], outdata[5], outdata[6]));
                break;
            case RenderTypes.I:
                Log("Get List");
                //
                break;
            default:
                Log("Not sure");
                break;
        }
    }

    if (rotService != null) {

        rotService.on(PACKET_SEND, pkt => handlePacket(pkt));
        return (
            <div>
                <div>
                    <button onClick={drawRect}>Rect</button>
                    <button onClick={drawLine}>Line</button>
                    <button onClick={drawCircle}>Circle</button>
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
                    <button onClick={clear}>Clear</button>
                </div>
            </div>
        )
    }

}

export default JDConn;
