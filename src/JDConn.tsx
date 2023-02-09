import { PACKET_SEND, SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useServices } from "react-jacdac";
import { RenderItem, addItem } from "./Canvas.tsx";
import Log from "./Logger.tsx";

const JDConn = () => {

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];

    const drawRect = () => {
        let arr = new Uint8Array(6);
        arr[0] = 5;
        arr[1] = 1;
        arr[2] = 80;
        arr[3] = 60;
        arr[4] = 10;
        arr[5] = 40;

        rotService.sendCmdAsync(10, arr, false)
    }

    const drawLine = () => {
        let arr = new Uint8Array(6);
        arr[0] = 6;
        arr[1] = 2;
        arr[2] = 120;
        arr[3] = 10;
        arr[4] = 10;
        arr[5] = 120;
        rotService.sendCmdAsync(10, arr, false);
    }

    const setRed = () => {
        let arr = new Uint8Array(4);
        arr[0] = 2;
        arr[1] = 255;
        arr[2] = 0;
        arr[3] = 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const setGreen = () => {
        let arr = new Uint8Array(4);
        arr[0] = 2;
        arr[1] = 0;
        arr[2] = 255;
        arr[3] = 0;
        rotService.sendCmdAsync(10, arr, false);
    }

    const setBlue = () => {
        let arr = new Uint8Array(4);
        arr[0] = 2;
        arr[1] = 0;
        arr[2] = 0;
        arr[3] = 255;
        rotService.sendCmdAsync(10, arr, false);
    }


    const handlePacket = (pkt) => {
        Log("Packet Received: " + pkt);
        let x: string = pkt.toString();
        let y = x.split(" ");
        let data = y[3];
        let newdata = data.match(/.{1,2}/g)?.toString().split(",");
        // newdata?.forEach((item: any) => item = parseInt(item, 10));
        let outdata = newdata?.map((item) => parseInt(item, 16));
        switch (outdata[0]) {
            case 2:
                Log("Setting colour");
                addItem(new RenderItem("C", outdata[1], outdata[2], outdata[3]));
                break;
            case 5:
                Log("Rectangle!");
                addItem(new RenderItem("R", outdata[2], outdata[3], outdata[4], outdata[5]));
                break;
            case 6:
                Log("Line");
                addItem(new RenderItem("L", outdata[2], outdata[3], outdata[4], outdata[5]));
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
                </div>
                <div>
                    <button onClick={setRed}>Red</button>
                    <button onClick={setGreen}>Green</button>
                    <button onClick={setBlue}>Blue</button>
                </div>
            </div>
        )
    }

}

export default JDConn;
