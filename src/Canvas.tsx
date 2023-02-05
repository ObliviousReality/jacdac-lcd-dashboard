import { ButtonReg, CHANGE, EVENT, PACKET_SEND, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import './stylesheet.css';
import Log from "./Logger.tsx";


const Canvas = (props) => {
    const canvasRef = React.useRef(null);

    const service = useServices({ serviceClass: SRV_BUTTON })[0];
    // service.on(PACKET_SEND, pkt => console.log(`${this} send ${pkt}`))

    const buttonReg = useRegister(service, ButtonReg.Pressure);

    const [pressure = 0] = useRegisterValue<[number]>(buttonReg);


    const draw = ctx => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillRect(100, 100, 5, 5);
    }

    const drawLine = ctx => {
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(i * 5, i * 5, 5, 5);
        }
    }

    React.useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 160 * 5;
        canvas.height = 120 * 5;
        const context = canvas.getContext('2d');
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        if (pressure > 0) {
            context.fillStyle = '#00FFFF'
        }
        else {
            context.fillStyle = '#000000'
        }
        // context.fillRect(10 * 5, 10 * 5, 1 * 5, 1 * 5);
        drawLine(context);
        // draw(context);

    }, [draw]);



    return <canvas ref={canvasRef} {...props} />
}


export default Canvas;
