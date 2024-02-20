'use client'

export default function InputSelection() {
    
    const inputSelect = async () =>{
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Got audio stream");
        } catch (error) {
            console.error("Error getting audio stream", error);
        }
        // Checking to see if our input devices are listed
        console.log("Listing audio sources:");
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            console.log(devices);
        });
        return stream
    }
    
    return (
        <div>
            <button onClick={inputSelect}>Audio Source</button>
        </div>
    );
}
