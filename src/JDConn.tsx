import { PACKET_SEND, RotaryEncoderReg, SRV_BUTTON, SRV_ROTARY_ENCODER } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import Log from "./Logger.tsx";

var canvas;
var context;

const JDConn = () => {
    canvas = document.getElementById("thecanvas") as HTMLCanvasElement;

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];
    const btnService = useServices({ serviceClass: SRV_BUTTON })[0];

    const spinReg = useRegister(rotService, RotaryEncoderReg.Position);
    const spin = useRegisterValue<[number]>(spinReg)
    var prevSpin = spin;

    if (canvas != null) {
        context = canvas.getContext('2d');
        // Log("Connected to canvas");
        for (let i = 100; i > 1; i--) {
            context.fillStyle = '#FF0000'
            context.fillRect((100 * 5) - i * 5, i * 5, 5, 5);
        }
    }
    // if (btnService != null) {
    //     btnService.on(PACKET_SEND, pkt => Log(`${this} send ${pkt}`))
    //     btnService.on(PACKET_SEND, pkt => Log(`${this} received ${pkt}`))
    // }
    return (
        <p>{spin}</p>
    )

}

export default JDConn;
