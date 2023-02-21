import { PACKET_SEND, SRV_ROTARY_ENCODER } from "jacdac-ts";
import { useServices } from "react-jacdac";
import { addItem, clear, setColour, setDrawWidth, setFilled } from "./Canvas.tsx";
import Log from "./Logger.tsx";
import RenderItem from "./RenderItem.ts";
import RenderTypes from "./RenderTypes.ts";

const JDConn = () => {

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];


    const handlePacket = (pkt) => {
        // Log("Packet Received: " + pkt);
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
                clear();
                break;
            case RenderTypes.P:
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.C:
                setColour(outdata[1], outdata[2], outdata[3]);
                break;
            case RenderTypes.F:
                setFilled(outdata[1]);
                break;
            case RenderTypes.W:
                setDrawWidth(outdata[1]);
                break;
            case RenderTypes.R:
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.L:
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.O:
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.U:
                //
                break;
            case RenderTypes.D:
                //
                break;
            case RenderTypes.T:
                addItem(new RenderItem(outdata));
                break;
            case RenderTypes.I:
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
