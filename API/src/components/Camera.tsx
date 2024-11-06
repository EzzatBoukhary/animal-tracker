import React, { useRef, useEffect } from 'react';

interface CameraComponentProps {
    onCapture: (photo: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Access camera when component mounts
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        };
        getCameraStream();

        // Clean up stream when component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream)
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const photo = canvas.toDataURL('image/png'); // Get image as base64
                onCapture(photo);
            }
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
            <button onClick={handleCapture}>Capture Photo</button>
        </div>
    );
};

export default CameraComponent;
