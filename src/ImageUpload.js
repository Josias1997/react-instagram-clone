import React, {useState} from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = event => {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleUpload = event => {
        event.preventDefault();
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                // Error function
                alert(error.message);
            },
            () => {
                // Complete function
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
            }
        )
    }       
    return (
        <div className="image__upload">
            <progress className="image__upload__progress" value={progress} max="100" />
            <input 
                type="text" 
                placeholder="Enter a caption ..." 
                value={caption} 
                onChange={event => setCaption(event.target.value)}
            />
            <input 
                type="file" 
                onChange={handleChange} 
            />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
