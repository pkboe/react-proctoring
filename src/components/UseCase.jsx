import ml5 from "ml5";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const UseCase = (props) => {
  const webcamRef = useRef(null);
  const imgRef = useRef(null);
  let results = [];
  const [imgArray, setImgArray] = useState([]);
  const [outArray, setoutArray] = useState([]);
  const [LoadCamState, setLoadCamState] = useState(true);
  const videoConstraints = {
    width: 600,
    height: 400,
    facingMode: "user",
  };

  const capture = () => {
    if (imgArray.length < 4) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgArray([...imgArray, imageSrc]);
    } else setLoadCamState(false);
  };

  const calculate = () => {
    if (imgArray.length === 4) {
      const poseNet = ml5.poseNet(() => {
        for (let i = 0; i < imgArray.length; i++) {
          imgRef.current.src = imgArray[i];
          poseNet.singlePose(imgRef.current).then((res) => {
            console.log("Pass " + i + " :");
            results = [...results, res[0]];
            console.log(results);
            if (results.length === 4) setoutArray(results);
          });
        }
      });
    } else alert("Nope");
  };

  useEffect(() => {
    console.log(outArray);
  }, [outArray]);

  return (
    <div
      style={{
        border: "1px solid",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {LoadCamState && (
        <Webcam
          ref={webcamRef}
          id="video"
          audio={false}
          height={400}
          screenshotFormat="image/jpeg"
          width={600}
          videoConstraints={videoConstraints}
          mirrored={false}
          style={{ position: "absolute", right: "100%" }}
        />
      )}
      <h4>A Demo For Clicking Pics And Calculating Variance For Face Points</h4>
      <div
        style={{
          maxWidth: "80%",
          minWidth: "900px",
          border: "2px solid tomato",
        }}
      >
        <div style={{ height: "200px", display: "flex" }}>
          {imgArray.map((sr, index) => (
            <div key={Math.random()}>
              {" "}
              <img
                key={Math.random()}
                src={sr}
                height={200}
                width={200}
                style={{ padding: 10 }}
                alt="Image"
              />
            </div>
          ))}
        </div>
        <h2>Results</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          {outArray.map((res, index) => (
            <div key={Math.random()}>
              <h3>Image{index + 1}</h3>
              <h5>Left Eye : X : {res.pose.leftEye.x.toFixed(2)}</h5>
              <h5>Left Eye : Y : {res.pose.leftEye.y.toFixed(2)}</h5>
              <h5>Right Eye : X : {res.pose.rightEye.x.toFixed(2)}</h5>
              <h5>Right Eye : Y : {res.pose.rightEye.y.toFixed(2)}</h5>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          style={{
            fontSize: "1.1rem",
            margin: 10,
            backgroundColor: "tomato",
            boxShadow: "1px 1px 1px  ",
            // border: "none",
            borderRadius: 40,
          }}
          onClick={capture}
        >
          Capture
        </button>

        <button
          onClick={calculate}
          style={{
            fontSize: "1.1rem",
            margin: 10,
            backgroundColor: "cyan",
            boxShadow: "1px 1px 1px  ",
            // border: "none",
            borderRadius: 40,
          }}
        >
          Get Results
        </button>

        <button
          style={{
            fontSize: "1.1rem",
            margin: 10,
            backgroundColor: "yellow",
            boxShadow: "1px 1px 1px  ",
            // border: "none",
            borderRadius: 40,
          }}
          onClick={() => {
            setLoadCamState(true);
            setImgArray([]);
          }}
        >
          Reset
        </button>
      </div>
      <img
        src={" "}
        style={{ display: "none" }}
        ref={imgRef}
        height={200}
        width={200}
        alt=""
      />
    </div>
  );
};

export default UseCase;
