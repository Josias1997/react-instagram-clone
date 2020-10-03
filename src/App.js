import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { Modal, Button, makeStyles, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({id: doc.id, post: doc.data()})))
    })
  }, []);

  const signUp = event => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: username
      }).then(() => {
        const updateUser = {
          ...user,
          displayName: authUser.user.displayName
        }
        setUser(updateUser);
      }).catch(error => alert(error.message));
      setOpen(false);
    })
    .catch((error) => alert(error.message))
  };

  const signIn = event => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      setOpenSignIn(false);
    })
    .catch(error => {
      alert(error.message);
    })
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
              className="app__headerImage" 
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
              alt="logo" 
            />
            <form className="app__signup">
              <Input 
                type="text" 
                value={username} 
                placeholder="Username" 
                onChange={event => setUsername(event.target.value)}/>
              <Input 
                type="text" 
                value={email} 
                placeholder="Email" 
                onChange={event => setEmail(event.target.value)} />
              <Input 
                type="password" 
                value={password} 
                placeholder="Password" 
                onChange={event => setPassword(event.target.value)} />
              <Button 
                className="app__signupButton"
                color="primary" 
                variant="outlined" 
                type="submit" 
                onClick={signUp}>
                  SignUp
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
              className="app__headerImage" 
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
              alt="logo" 
            />
            <form className="app__signup">
              <Input 
                type="text" 
                value={email} 
                placeholder="Email" 
                onChange={event => setEmail(event.target.value)} />
              <Input 
                type="password" 
                value={password} 
                placeholder="Password" 
                onChange={event => setPassword(event.target.value)} />
              <Button 
                className="app__signupButton"
                color="primary" 
                variant="outlined" 
                type="submit" 
                onClick={signIn}>
                  Login
              </Button>
            </form>
          </center>
        </div>
      </Modal>
      <div className="app__header">
        <img 
          className="app__headerImage" 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
          alt="logo" 
        />
        {
          user ? <Button onClick={() => auth.signOut()}>Logout</Button> :
          <div className="app__loginContainer">
            <Button onClick={() => setOpen(true)}>SignUp</Button>
            <Button onClick={() => setOpenSignIn(true)} >Login</Button>
          </div>
        }
      </div>
      {user && user.displayName ? <ImageUpload username={user.displayName} /> : <h3 style={{
        textAlign: 'center'
      }}>Sorry you need to login to upload!</h3>}
      {/* Header */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => 
              <Post 
                key={id} 
                username={post.username} 
                caption={post.caption} 
                imageUrl={post.imageUrl}
                postId={id}
                user={user}
              />
            )
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      {/* Posts */}
    </div>
  );
}

export default App;
