'use client'

import { useState, useEffect } from "react";
interface Stream {
    data: MediaStream | null;
};

export default function InputSelection() {
    const [stream, setStream] = useState<Stream | null>(null);
    const [permission, setPermission] = useState(false);
    const [mediaAccess, setMediaAccess] = useState(false);
    const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string | null>(null);

    const getMediaAccess = async () => {
        if ("getUserMedia" in navigator.mediaDevices) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({ audio: true });
                setPermission(true);
                setMediaAccess(true);
                setStream({data: streamData});
            } catch (error) {
                console.error("Error getting audio stream", error);
                alert("Failed to get media access.");
            };
        } else {
            alert("Your browser is not supported");
        };
    };

    const useInput = async (stream: Stream | null) =>{
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
            //Setting audio constraints to use the exact deviceId and if not then leave undefined so the system default is chosen.
            audio: { deviceId: selectedInputDeviceId ? { exact: selectedInputDeviceId } : undefined },
            //No video used
            video: false, 
            });
            setPermission(true);
            setStream({ data: streamData });
            console.log("Updated Selected Device To: ", streamData)
        } catch (error) {
            console.error("Error selecting input device", error);
            alert("Failed to access microphone.");
        };
    };

    // Log stream whenever it changes
    useEffect(() => {
        getMediaAccess();
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const audioInputDevices = devices.filter(device => device.kind === "audioinput");
            setInputDevices(audioInputDevices);
            console.log('input devices: ', audioInputDevices)
        }).catch(error => {
            console.error("Error enumerating devices", error);
        });

        if (stream !== null) { //Checking if stream isn't null which prevents console from firing twice on initial page render.
            console.log("Stream updated:", stream);
        }
    }, [mediaAccess]); 

    const handleInputDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStream(null);
        setPermission(false);
        setSelectedInputDeviceId(event.target.value);
        console.log("Selected:", event.target.value);
    };
    
    return (
        <div>
            <select id="inputDevice" onChange={handleInputDeviceChange} className="text-black overflow-hidden w-1/6">
                {inputDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Device ${device.deviceId}`}
                    </option>
                ))}
            </select>
            {!permission ? (<button type="button" onClick={() => useInput(stream)}>Use Selected Source</button>): null}
            {permission ? (<button type="button">Rec</button>): null}
        </div>
    );
};
