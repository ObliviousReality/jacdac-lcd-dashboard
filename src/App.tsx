import * as React from "react";
import { JacdacProvider } from "react-jacdac";
import { bus } from "./Bus.ts";
import Connect from "./connect.tsx";
import Program from "./Program.tsx";
import Canvas from "./Canvas.tsx";
import Log from "./Logger.tsx"

export default function App() {
    return (
        <JacdacProvider initialBus={bus}>
            <Connect />
            <Log />
            {/* <Program /> */}
            <Canvas />
        </JacdacProvider>
    );
}
