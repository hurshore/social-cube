import React, { useState, useRef } from 'react';
import { dataURItoBlob } from '../../shared/utility';
import * as actions from '../../store/actions';
import { compressImage } from '../../shared/utility';
import { connect } from 'react-redux';
//Components
import CustomButton from '../UI/CustomButton/CustomButton';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//MUI icons
import AddIcon from '@material-ui/icons/Add';

const styles = (theme) => ({
  ...theme.spreadThis,
  addBtn: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1,
    background: 'rgb(255,64,129)',
    color: 'white',
    '&:hover': {
      background: 'rgb(202 36 92)'
    }
  },
  appBar: {
    position: 'relative',
    paddingRight: '0 !important'
  },
  postBtn: {
    marginLeft: 'auto',
    fontWeight: 600
  },
  createPost: {
    maxWidth: '512px',
    margin: '0 auto 1rem auto',
    width: '100%'
  },
  canvas: {
    maxWidth: '100%',
    width: '512px',
    display: 'none'
  },
  video: {
    maxWidth: '100%',
    width: '512px',
    display: 'none'
  },
  captureBtnWrapper: {
    margin: '1rem auto',
    textAlign: 'center'
  },
  galleryUpload: {
    padding: '.7rem'
  },
  form: {
    padding: '.7rem'
  }
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddTweet = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tweetBody, setTweetBody] = useState('');
  const [picture, setPicture] = useState(null);
  const { classes } = props;
  const canvasElement = useRef(null);
  const videoPlayer = useRef(null);
  const captureButton = useRef(null);
  const galleryUpload = useRef(null);

  const handleClickOpen = () => {
    setIsOpen(true);
    initializeMedia();
    console.log('Add button clicked');
  };

  const handleClose = () => {
    setIsOpen(false);
    if(videoPlayer.current.srcObject) {
      videoPlayer.current.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      })
    }
  }

  const submitHandler = async (event) => {
    // event.preventDefault();
    // const imageFile = picture;
    // const options = {
    //   maxSizeMB: 1,
    //   maxWidthOrHeight: 1920,
    //   useWebWorker: true
    // }
    // try {
    //   const compressedFile = await imageCompression(imageFile, options);
    //   console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
    //   console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    //   const newTweet = {
    //     body: tweetBody,
    //     picture: compressedFile
    //   };
    //   props.postTweet({ ...newTweet, FBIdToken: props.FBIdToken });
    //   setIsOpen(false);
    //   setTweetBody('');
    // } catch (error) {
    //   console.log(error);
    // }

    compressImage(picture)
      .then((compressedFile) => {
        const newTweet = {
          body: tweetBody,
          picture: compressedFile
        };
        props.postTweet({ ...newTweet, FBIdToken: props.FBIdToken });
        setIsOpen(false);
        setTweetBody('');
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const initializeMedia = () => {
    if(!('mediaDevices' in navigator)) {
      navigator.mediaDevices = {};
    }
  
    if(!('getUserMedia' in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.wekitGetUserMedia;
  
        if(!getUserMedia) {
          return Promise.reject(new Error('getUserMedia not implemented'));
        }
  
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        }) 
      }
    }
  
    navigator.mediaDevices.getUserMedia({video: true})
      .then(stream => {
        videoPlayer.current.srcObject = stream;
        videoPlayer.current.style.display = 'block';
        // captureButton.style.display = 'block';
      })
      .catch((err) => {
        console.log(err);
        // imagePickerArea.style.display = 'block';
        captureButton.current.style.display = 'none';
      })
  }

  const takePicture = () => {
    canvasElement.current.style.display = 'block';
    videoPlayer.current.style.display = 'none';
    captureButton.current.style.display = 'none';
    galleryUpload.current.style.display = 'none';
    const context = canvasElement.current.getContext('2d');
    context.drawImage(videoPlayer.current, 0, 0, canvasElement.current.width, (videoPlayer.current.videoHeight * canvasElement.current.width) / videoPlayer.current.videoWidth);
    videoPlayer.current.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    })
    setPicture(dataURItoBlob(canvasElement.current.toDataURL()));
  }

  const imageChangeHandler = (event) => {
    videoPlayer.current.style.display = 'none';
    captureButton.current.style.display = 'none';
    canvasElement.current.style.display = 'none';
    setPicture(event.target.files[0]);
    videoPlayer.current.srcObject.getVideoTracks().forEach(function(track) {
      track.stop();
    })
  }

  const inputChangeHandler = (event) => {
    setTweetBody(event.target.value);
  }

  return (
    <React.Fragment>
      <CustomButton title="Create a Post" label="post" btnClassName={classes.addBtn} clicked={handleClickOpen}>
        <AddIcon />
      </CustomButton>
      <Dialog fullScreen open={isOpen} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Button autoFocus 
            color="inherit" 
            onClick={submitHandler} 
            className={classes.postBtn} 
            disabled={!picture || tweetBody.trim().length === 0 ? true : false}>
              POST
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.createPost}>
          <video ref={videoPlayer} autoPlay className={classes.video}></video>
          <canvas ref={canvasElement} className={classes.canvas} width="320px" height="240px"></canvas>
          <div className={classes.captureBtnWrapper}>
            <Button ref={captureButton} onClick={takePicture} variant="contained" color="primary">Capture</Button>
          </div>
          <div className={classes.galleryUpload} ref={galleryUpload}>
            <Typography variant="body1" component="p">Upload from gallery instead?</Typography>
            <input
              accept="image/*"
              className={classes.input}
              id="gallery-upload"
              type="file"
              onChange={imageChangeHandler}
            />
          </div>
          <form className={classes.form}>
            <TextField
              label="Say something🎤"
              multiline
              fullWidth
              rowsMax={4}
              value={tweetBody}
              onChange={inputChangeHandler}
            />
          </form>
        </div>
      </Dialog>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    FBIdToken: state.auth.FBIdToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    postTweet: (payload) => dispatch(actions.postTweet(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddTweet));