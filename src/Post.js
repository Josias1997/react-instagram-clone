import React, {useState, useEffect} from 'react';
import './Post.css';
import { Avatar, Button } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

function Post({ postId, username, user, imageUrl, caption}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
            .doc(postId)
            .collection('comments')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => ({id: doc.id, data: doc.data()})))
            })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = e => {
        e.preventDefault();
        db.collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/image"
                />
                <h3>{username}</h3>
            </div>
            <img 
                className="post__image"
                src={imageUrl} alt="Post"/>
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map(({id, data}) => <p key={id}>
                        <strong>{data.username}</strong> {data.text}
                    </p>)
                }
            </div>
            { user && <form className="post__commentBox">
                <input 
                    type="text"
                    value={comment}
                    placeholder="Add a comment ..."
                    onChange={e => setComment(e.target.value)}
                    className="post__input"
                />
                <Button onClick={postComment} className="post__button">
                    Post
                </Button>
            </form>}
        </div>
    )
}

export default Post;
