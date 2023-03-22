import { Packet, PACKET_SEND, SRV_ROTARY_ENCODER } from "jacdac-ts";
import { useServices } from "react-jacdac";
import { addGroup, addItem, clear, del, init, refresh, setColour, setDrawWidth, setFilled, update } from "./Canvas.tsx";
import { Circle } from "./Circle.ts";
import { Line } from "./Line.ts";
import Log from "./Logger.tsx";
import { Pixel } from "./Pixel.ts";
import { Rect } from "./Rect.ts";
import RenderTypes from "./RenderTypes.ts";
import { Sprite } from "./Sprite.ts";

const JDConn = () => {

    const rotService = useServices({ serviceClass: SRV_ROTARY_ENCODER })[0];
    // Connect to device.
    //TODO: Change to LCD service.

    // On receiving a packet:
    const handlePacket = (pkt: Packet) => {
        // Log("Packet Received: " + pkt);
        // Log(pkt.data);
        let outdata: number[] = [];
        pkt.data.forEach((item) => outdata.push(item)); // Conv to array.
        switch (outdata[0]) { // Switch on type:
            case RenderTypes.Clear:
                clear();
                break;
            case RenderTypes.Pixel:
                addItem(new Pixel(outdata));
                break;
            case RenderTypes.Colour:
                setColour(outdata[1], outdata[2], outdata[3], outdata[4]);
                break;
            case RenderTypes.Fill:
                setFilled(outdata[1]);
                break;
            case RenderTypes.Width:
                setDrawWidth(outdata[1]);
                break;
            case RenderTypes.Rect:
                addItem(new Rect(outdata));
                break;
            case RenderTypes.Line:
                addItem(new Line(outdata));
                break;
            case RenderTypes.Circle:
                addItem(new Circle(outdata));
                break;
            case RenderTypes.Update:
                outdata.shift();
                let id = outdata.shift();
                update(id, outdata);
                break;
            case RenderTypes.Delete:
                del(outdata[1]);
                break;
            case RenderTypes.Sprite:
                addItem(new Sprite(outdata));
                break;
            case RenderTypes.Group:
                //New Group
                addGroup(outdata);
                break;
            case RenderTypes.Render:
                refresh();
                break;
            case RenderTypes.Init:
                init(outdata[1]);
                break;
            case RenderTypes.NewSprite:
                outdata.shift();
                Sprite.addSprite(outdata);
                break;
            default:
                Log("Not sure");
                break;
        }
    }

    if (rotService != null) {

        rotService.on(PACKET_SEND, pkt => handlePacket(pkt)); // Receive data.
    }

}

export default JDConn;
