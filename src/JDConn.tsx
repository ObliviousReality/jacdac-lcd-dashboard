import { PACKET_SEND, SRV_ROTARY_ENCODER } from "jacdac-ts";
import { useServices } from "react-jacdac";
import { RenderItem, RenderTypes, addItem, clear } from "./Canvas.tsx";
import Log from "./Logger.tsx";

const JDConn = () => {

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];


    const handlePacket = (pkt) => {
        Log("Packet Received: " + pkt);
        let x: string = pkt.toString();
        let y = x.split(" ");
        let data = y[3];
        let newdata = data.match(/.{1,2}/g)?.toString().split(",");
        let outdata = newdata?.map((item) => parseInt(item, 16));
        if (!outdata) {
            console.log("Error with parsed Data");
            return;
        }
        switch (outdata[0]) {
            case RenderTypes.X:
                Log("Clear");
                clear();
                break;
            case RenderTypes.P:
                Log("Setting pixel");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.C:
                Log("Setting colour");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.F:
                Log("Setting filled status");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.W:
                Log("Setting fill width");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.R:
                Log("Rectangle!");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.L:
                Log("Line");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.O:
                Log("Drawing Circle");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.U:
                Log("Update");
                //
                break;
            case RenderTypes.D:
                Log("Delete");
                //
                break;
            case RenderTypes.T:
                Log("Rotated Rectange");
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.I:
                Log("Get List");
                //
                break;
            default:
                Log("Not sure");
                break;
        }
    }

    if (rotService != null) {

        rotService.on(PACKET_SEND, pkt => handlePacket(pkt));
    }

}

export default JDConn;
