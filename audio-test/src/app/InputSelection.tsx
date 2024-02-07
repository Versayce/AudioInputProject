'use client'

export default function InputSelection() {
    function inputSelect() {
        console.log("Selecting audio source");
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            console.log(devices);
        });
    }
    return (
        <div>
            <button onClick={inputSelect}>Audio Source</button>
        </div>
    );
}
