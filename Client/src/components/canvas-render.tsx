import React, {useEffect, useRef} from 'react';
import styles from './styles.module.css'

type CanvasRenderProps = {
  style?: React.CSSProperties;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export function CanvasRender(props: CanvasRenderProps) {
  const { videoRef, style } = props;
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!refCanvas.current) return;
    if (!videoRef.current) return;

    // Set the canvas size to be the same as the video size
    refCanvas.current.width = videoRef.current.videoWidth;
    refCanvas.current.height = videoRef.current.videoHeight;
    const ctx = refCanvas.current?.getContext('2d');
    let show = true;

    function processFrame() {
      if (!refCanvas.current) return;
      if (!videoRef.current) return;
      if (!ctx) return;
      if (!show) return;

      // Draw the current frame of the video on the canvas
      ctx.drawImage(videoRef.current, 0, 0, refCanvas.current.width, refCanvas.current.height);
      ctx.getContextAttributes().willReadFrequently = true;
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, refCanvas.current.width, refCanvas.current.height);
      const data = imageData.data;

      // Process image data, remove green background
      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        // Determine whether it is green, can be adjusted according to actual scenario
        if (green > 90 && red < 90 && blue < 90) {
          // Set the green background to transparent
          data[i + 3] = 0;
        }
      }

      // Put the processed image data back into the canvas
      ctx.putImageData(imageData, 0, 0);

      // Continue processing the next frame
      requestAnimationFrame(processFrame);
    }

    // Start processing video frames
    processFrame();

    return () => {
      show = false;
    };
  }, [videoRef]);

  return <canvas className={styles.wrap} style={style} ref={refCanvas} />;
}
