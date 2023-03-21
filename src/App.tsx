import * as React from "react";
import { JacdacProvider } from "react-jacdac";
import { bus } from "./Bus.ts";
import Connect from "./connect.tsx";
import Canvas from "./Canvas.tsx";
import Log from "./Logger.tsx"
import JDConn from "./JDConn.tsx";
import JDSend from "./JDSend.tsx";

export default function App() {
    return (
        <JacdacProvider initialBus={bus}>
            <Connect />
            <Canvas />
            <Log />
            <JDSend />
            <JDConn />

        </JacdacProvider>
    );
}
