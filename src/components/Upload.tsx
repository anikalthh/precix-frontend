import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

function Upload() {
    const [file, setFile] = useState<File | null>(null)
    const [imgProcessType, setImgProcessType] = useState('light')
    const [loading, setLoading] = useState(false);
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files)
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const [imgBefore, setImgBefore] = useState('');
    const [imgAfter, setImgAfter] = useState('');

    const getStem = (filename: string): string => {
    const lastDot = filename.lastIndexOf(".");
    return lastDot === -1 ? filename : filename.slice(0, lastDot);
}

    const submit = async () => {
        setImgBefore('');
        setImgAfter('');
        setLoading(true);
        if (file) {
            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("imageProcessType", imgProcessType);
                console.log('before trying submit')
                await fetch('http://localhost:8080/imageupload', {
                    method: 'POST',
                    body: formData
                }).then((response) => {
                    return response.text()
                }).then((filename) => {
                    console.log("filename???", filename);
                    setLoading(false)
                    setImgBefore(`http://localhost:8080/uploads/${filename}?t=${Date.now()}`)
                    setImgAfter(`http://localhost:8080/uploads/${getStem(filename)}_Processed.jpg?t=${Date.now()}`)
                }).catch((error) => {
                    console.log("ERROR IN POST REQ FE: " + error)
                })
                console.log("TRYING SUBMIT")
            } catch (error) {
                console.log(error)
            }
        }
    }

    const changeImgProcessType = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImgProcessType(e.target.value);
    }

    return (
        <>
            <h1>Process Image</h1>
            <h3>1. Upload your image here</h3>
            <div>
                <input type="file" onChange={handleUpload}/>
            </div>
            <h3>2. How would you like to process your image?</h3>

            <div style={{marginBottom: '10px'}}>
                <label>
                    <input
                    type="radio"
                    name="process"
                    value="light"
                    checked={imgProcessType === 'light'}
                    onChange={changeImgProcessType}
                    />
                    Light
                </label>
                <label>
                    <input
                    type="radio"
                    name="process"
                    value="heavy"
                    checked={imgProcessType === 'heavy'}
                    onChange={changeImgProcessType}
                    />
                    Heavy
                </label>
            </div>
            
            <div>
                <button onClick={submit}>Let's Go!</button>
            </div>

            {imgBefore && imgAfter && (
                <div style={{display: 'flex'}}>
                    <div style={{margin: '0 10px 0 10px'}}>
                        <h3>Image Before</h3>
                        <img src={imgBefore} style={{width: '300px'}} />
                    </div>
                    <div style={{margin: '0 10px 0 10px'}}>
                        <h3>Image After</h3>
                        <img src={imgAfter} style={{width: '300px'}} />
                    </div>
                </div>
            )}

            {loading && !imgBefore && (
                <div style={{marginTop: '20px'}}>
                    <ClipLoader color="#fff"/>
                    <h3>Loading... Please wait!</h3>
                </div>
            )}
        </>
    )
}

export default Upload