import * as React from "react";
import { JacdacProvider } from "react-jacdac";
import { bus } from "./Bus.ts";
import Connect from "./connect.tsx";
import Program from "./Program.tsx";

export default function App() {
    return (
        <JacdacProvider initialBus={bus}>
            <Connect />
            <Program />
        </JacdacProvider>
    );
}
