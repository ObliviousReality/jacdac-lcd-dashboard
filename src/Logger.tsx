export default function Log(msg: any) {
    const logel = document.getElementById("log") as HTMLPreElement;
    const logcl = document.getElementById("clearlog") as HTMLButtonElement;
    if (Object.keys(msg).length !== 0) {
        console.log(new Date().toLocaleTimeString().replace("PM", "").replace("AM", "") + " " + msg);
        logel.innerText = new Date().toLocaleTimeString().replace("PM", "").replace("AM", "") + " " + msg + "\n" + logel.innerText;
    }

    logcl.onclick = () => (logel.innerText = "");
}
