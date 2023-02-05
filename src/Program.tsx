import { ButtonReg, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";
import './stylesheet.css';


const Program = () => { // Bad approach
    const service = useServices({ serviceClass: SRV_BUTTON })[0];

    const buttonReg = useRegister(service, ButtonReg.Pressure);

    const [pressure = 0] = useRegisterValue<[number]>(buttonReg);


    const [gridWidth, setGridWidth] = React.useState(120);
    const [gridHeight, setGridHeight] = React.useState(160);
    const boardRef = React.useRef(null);


    React.useEffect(() => {
        boardRef.current.style.setProperty("--grid-width", gridWidth);
        boardRef.current.style.setProperty("--grid-height", gridHeight);
    }, [gridWidth, gridHeight]
    );

    // var test = [<p>Hello!</p>, <h2>There!</h2>]

    var html = (i: number) => {
        return (<div key={i} className="square"
            style={{
                backgroundColor: `rgb(${pressure * 255}, 0, 0)`,
                width: `5px`,
                height: `5px`

            }} />)
    }
    var html2 = (i: number) => {
        return (<div key={i} className="square"
            style={{
                backgroundColor: `rgb(${(1 - pressure) * 255}, 0, 0)`,
                width: `5px`,
                height: `5px`

            }} />)
    }




    const createGrid = () => {
        let htmlGen: JSX.Element[] = [];
        for (let i = 0; i < gridWidth; i++) {
            for (let j = 0; j < gridHeight; j += 2) {

                if (i % 2 == 0) {
                    htmlGen.push(html(j * gridHeight + i));
                    htmlGen.push(html2(j * gridHeight + i + 1));
                }
                else {
                    htmlGen.push(html2(j * gridHeight + i));
                    htmlGen.push(html(j * gridHeight + i + 1));
                }
            }
        }
        return htmlGen;
    }

    return (
        <div ref={boardRef} className="board">
            {createGrid()}
        </div>
    )

}


export default Program;
