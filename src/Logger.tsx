export default function Log(msg: any) {
    const logel = document.getElementById("log") as HTMLPreElement;
    console.log(msg);
    logel.innerText += msg + "\n";
}
