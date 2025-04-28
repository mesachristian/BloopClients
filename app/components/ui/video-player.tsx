import Hls from "hls.js";
import { useEffect, useRef } from "react";

function CfHlsPlayer({ src, poster }: Readonly<{ src?: string, poster?: string }>) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (!src) return;

        // Native HLS support (Safari, iOS)
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls.isSupported()) {
            // hls.js fallback
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            return () => {
                hls.destroy();
            };
        } else {
            console.error("This browser does not support HLS");
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover mx-auto aspect-video rounded-b-[3rem] shadow-lg bg-black"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
        >
            <p>Your browser doesn’t support HTML5 video.</p>
        </video>
    );
}

export default CfHlsPlayer;