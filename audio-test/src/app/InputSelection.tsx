'use client'
import { useState, useEffect } from "react";

interface Stream {
    data: MediaStream | null;
}

export default function InputSelection() {
    const [stream, setStream] = useState<Stream | null>(null);
    const [permission, setPermission] = useState(false);
    const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string | null>(null);

    const requestAccess = async () => {
        try {
            // Request access to the microphone
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setPermission(true);
            enumerateDevices();
        } catch (error) {
            console.error("Error getting access to microphone", error);
            alert("Failed to access microphone.");
        }
    };

    const enumerateDevices = async () => {
        try {
            // Enumerate input devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputDevices = devices.filter(device => device.kind === "audioinput");
            setInputDevices(audioInputDevices);
        } catch (error) {
            console.error("Error enumerating devices", error);
        }
    };

    const getInput = async () => {
        try {
            // Use selected input device
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedInputDeviceId ? { exact: selectedInputDeviceId } : undefined },
                video: false,
            });
            setStream({ data: streamData });
        } catch (error) {
            console.error("Error getting audio stream", error);
            alert("Failed to access microphone.");
        }
    };
    
    const handleInputDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInputDeviceId(event.target.value);
    };

    useEffect(() => {
        if (stream !== null) {
            console.log("Stream updated:", stream);
        }
    }, [stream]); 
    
    return (
        <div>
            {!permission ? (<button type="button" onClick={requestAccess}>Get Input Devices</button>) : null}
            <select id="inputDevice" onChange={handleInputDeviceChange} className="text-black">
                <option value="">Select A Device</option>
                {inputDevices.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Device ${device.deviceId}`}
                    </option>
                ))}
            </select>
            {permission ? (<button type="button" onClick={getInput}>Use Source</button>) : null}
        </div>
    );
}
