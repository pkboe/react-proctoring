import { useRef, useEffect, useState, useCallback } from "react";
import test from "../test.jpg";
import Webcam from "react-webcam";
import ml5 from "ml5";
const PoseMinimized = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [Status, setStatus] = useState("NULL");
  const [modelImg, setmodelImg] = useState(null);
  var poses;
  var ModelLoaded = false;
  var GlobalPoseNet;

  const videoConstraints = {
    width: 600,
    height: 400,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setmodelImg(imageSrc);
    calculate(imageSrc);
    // console.log(imageSrc);
  }, [webcamRef]);

  const calculate = (imageSrc) => {
    const ctx = canvasRef.current.getContext("2d");
    const image = imgRef.current;

    if (ModelLoaded && imageSrc !== null) {
      GlobalPoseNet.singlePose(image).then((res) => {
        // poses = res;
        // drawCameraIntoCanvas(image, ctx, res);
        console.log(res);
      });
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const video = webcamRef.current.video;
    const image = imgRef.current;
    console.log(image);
    const poseNet = ml5.poseNet(() => {
      ModelLoaded = true;
      // poseNet.on("pose", (results) => {
      //   poses = results;
      //   // setStatus(poses[0].pose.leftEye.x - poses[0].pose.rightEye.x);
      // });
      GlobalPoseNet = poseNet;
    });
  }, []);

  function drawKeypoints(ctx, poses) {
    for (let i = 0; i < poses.length; i++) {
      for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
        let keypoint = poses[i].pose.keypoints[j];
        if (keypoint.score > 0.2) {
          ctx.fillStyle = "#c82124";
          ctx.beginPath();
          ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  function drawCameraIntoCanvas(video, ctx, poses) {
    if (ModelLoaded && video) {
      ctx.drawImage(
        video,
        0,
        0,
        videoConstraints.width,
        videoConstraints.height
      );
    }
    if (poses !== undefined) {
      drawKeypoints(ctx, poses);
      // drawSkeleton(ctx);
    }
    // requestAnimationFrame(() => drawCameraIntoCanvas(video, ctx));
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Webcam
          ref={webcamRef}
          id="video"
          audio={false}
          height={400}
          screenshotFormat="image/jpeg"
          width={600}
          videoConstraints={videoConstraints}
          // style={{ display: "none" }}
          mirrored={false}
        />
        <canvas ref={canvasRef} width={600} height={400} />
        <h3 style={{ textAlign: "center" }}>{Status}</h3>
        <button
          style={{ fontSize: "30px", width: "min-content" }}
          onClick={capture}
        >
          capture
        </button>
      </div>
      <img
        ref={imgRef}
        src={modelImg}
        // style={{ display: "none" }}
        id="image"
        height={400}
        width={600}
      />
    </div>
  );
};
export default PoseMinimized;
