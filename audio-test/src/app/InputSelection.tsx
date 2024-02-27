'use client'

import { useState, useEffect } from "react";
interface Stream {
    data: MediaStream;
    prevState?: null;
};

export default function InputSelection() {
    const [stream, setStream] = useState<Stream | null>(null);
    const [permission, setPermission] = useState(false);

    const getInput = async (stream: Stream | null) =>{
        console.log("getting audio source...")
        if ("getUserMedia" in navigator.mediaDevices) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                if (stream?.data instanceof MediaStream) {
                    stream.data = streamData;
                    console.log("some data", streamData);
                }
                console.log("Got audio stream");
                setPermission(true);
                setStream({data: streamData});
            } catch (error) {
                console.error("Error getting audio stream", error);
            };
        } else {
            alert("Your browser is not supported");
        };
    };

    useEffect(() => {
        console.log("Stream updated:", stream);
    }, [stream]); // Log stream whenever it changes
    
    return (
        <div>
            {!permission ? (<button type="button" onClick={() => getInput(stream)}>Get Audio Source</button>): null}
            {permission ? (<button type="button">Rec</button>): null}
        </div>
    );
};
