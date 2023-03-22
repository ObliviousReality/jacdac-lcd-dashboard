import { CONNECTION_STATE, injectDevTools } from "jacdac-ts";
import { useBus } from "react-jacdac";

// Code taken from the Jacdac docs, see:
// https://microsoft.github.io/jacdac-docs/clients/javascript/
export default function Connect() {

    const connect = document.getElementById("connectbtn") as HTMLButtonElement;
    const status = document.getElementById("statusbtn") as HTMLButtonElement;
    const devtools = document.getElementById("devt") as HTMLButtonElement;
    const bus = useBus();
    const handleDevTools = () => injectDevTools(bus);

    bus.on(CONNECTION_STATE, () => {
        connect.innerText = bus.connected ? "disconnect" : bus.disconnected ? "connect" : "searching";
        if (bus.connected) {
            status.style.backgroundColor = "green";
            status.style.borderColor = "green";
            status.innerText = "Connected";
        }
        else {
            status.style.backgroundColor = "red";
            status.style.borderColor = "red";
            status.innerText = "disconnected";
        }
    })

    connect.onclick = async () => (bus.connected ? bus.disconnect() : bus.connect());
    devtools.onclick = handleDevTools;
}
