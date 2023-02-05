import * as React from "react"
import { CONNECTION_STATE, createWebBus, injectDevTools } from "jacdac-ts";
import { useBus, useChange } from "react-jacdac";

export default function Connect() {

    const connect = document.getElementById("connectbtn") as HTMLButtonElement;
    const status = document.getElementById("statusbtn") as HTMLButtonElement;

    const logel = document.getElementById("log") as HTMLPreElement;

    const log = (msg: any) => {
        console.log(msg);
        logel.innerText += msg + "\n";
    }

    const bus = useBus();
    const connected = useChange(bus, (_) => _.connected);
    const handleDevTools = () => injectDevTools(bus);
    log("Hello!");

    bus.on(CONNECTION_STATE, () => {
        connect.innerText = bus.connected ? "connect" : bus.disconnected ? "connect" : "searching";
        if (bus.connected) {
            status.style.backgroundColor = "green";
            status.innerText = "Connected";
        }
        else {
            status.style.backgroundColor = "red";
            status.innerText = "disconnected";
        }
    })

    connect.onclick = async () => (bus.connected ? bus.disconnect() : bus.connect());
}
