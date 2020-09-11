import React,{useRef, useCallback, useEffect} from "react";
import Webcamera from "react-webcam"
import imagecompressor from "browser-image-compression";

const videoConstraints={
    facingMode: "user",
    height: 200,
    width: 200
};
const options = {
    maxSizeMB : 0.1,
    useWebWorker : true,
    maxWidthOrHeight: 480
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
 }


function Webcam({socket}){
    const webcamref = useRef(null);
    const capture = useCallback(
        ()=>{
            const imageSrc = webcamref.current.getScreenshot();
            sendImage(imageSrc)
        },[webcamref]
    );
    const sendImage = (img)=>{
        if(img)
            imagecompressor(dataURItoBlob(img),options).then(img=>socket.emit('image',img)).catch(err=>console.log(err));
    }
    useEffect(()=>{
        let myfunc = setInterval(capture,30);
        return ()=>{
            clearInterval(myfunc);
        }
    },[]);
    return (<Webcamera audio={false} ref={webcamref}
        screenshotFormat="image/jpeg" videoConstraints={videoConstraints}>
        </Webcamera>);
    // const localVideo = useRef(null);
    // var capture;

    // useEffect(()=>{
    //     navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
    //         localVideo.current.srcObject = stream;
    //         let mediaStreamTrack = stream.getVideoTracks()[0];
    //         capture = new ImageCapture(mediaStreamTrack);
    //     }).catch(err=>console.log(err));
    //     // setInterval(takePhoto,30);
    // },[]);

    // function takePhoto() { 
    //     if(capture)
    //         capture.takePhoto().then(blob => {
    //             console.log(blob);
    //             // socket.emit('image',blob);
    //         }).catch(err=>console.log(err));
    // }; 
    
    // return <video ref={localVideo} autoPlay></video>
}

export default Webcam;
