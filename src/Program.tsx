import { ButtonReg, SRV_BUTTON } from "jacdac-ts";
import * as React from "react";
import { useRegister, useRegisterValue, useServices } from "react-jacdac";


const Program = () => {
    const service = useServices({ serviceClass: SRV_BUTTON })[0];

    const buttonReg = useRegister(service, ButtonReg.Pressure);

    const [pressure = 0] = useRegisterValue<[number]>(buttonReg);

    return (
        <div
            style={{
                backgroundColor: `rgb(${pressure * 255}, 0, 0)`,
                width: `10rem`,
                height: `10rem`,
                borderRadius: `1rem`
            }}
        />
    );
};


export default Program;
