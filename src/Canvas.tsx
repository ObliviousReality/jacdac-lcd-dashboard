import { ButtonReg, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import './stylesheet.css';


const Canvas = (props) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 160 * 5;
        canvas.height = 120 * 5;
        const context = canvas.getContext('2d');
        context.fillStyle = '#00FF00'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = '#00FFFF'
        context.fillRect(10 * 5, 10 * 5, 1 * 5, 1 * 5);
    }, []);



    return <canvas ref={canvasRef} {...props} />
}


export default Canvas;
