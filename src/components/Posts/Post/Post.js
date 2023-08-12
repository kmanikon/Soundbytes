import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';

import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import ShowMoreText from "react-show-more-text";

import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './styles';

import Speech from 'react-speech';

import { Progress } from 'rsuite';

import debounce from 'lodash.debounce';

// each post card



const voiceList = [
  'Samantha',
  'Daniel',
  'Karen',
  'Moira',
  'Tessa',
  //'Organ',
  //'Cellos'
]



const synth = window.speechSynthesis;

const Post = ({ post, setCurrentId }) => {

  const [markerPosition, setMarkerPosition] = useState(0);
  const [state, setState] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [max, setmax] = useState(1);



  
  
  const [selectedVoice, setSelectedVoice] = useState(0);

  //const [voices, setVoicesOut] = useState([]);

  const [newvoices, setNewvoices] = useState([]);

  const VoiceSelector = ({ selected = 0, setSelected, disabled }) => {
    const [voices, setVoices] = useState([]);
  
    const populateVoiceList = useCallback(() => {
      //const newVoices = synth.getVoices().filter(voice => voice.lang.startsWith('en-US'));
      const newVoices = synth.getVoices().filter((voice) => {
        return (
          voice.lang.startsWith('en') 
          && voiceList.some((name) => voice.name.includes(name))
        );
      });
      setVoices(newVoices);
      
    }, []);

    
  
    
    useEffect(() => {
      populateVoiceList();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
      }
    }, [populateVoiceList]);
    


  
    return (

      <>

        { disabled === 0 || disabled === 2 ? 
          <select
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value))}
            style={{
              width: '90px',
              //textAlign: 'center'
              marginRight: '10px',
              marginLEft: '10px'
            }}
            className="select-voice"
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} {/*({voice.lang}) {voice.default && ' [Default]'}*/}
              </option>
            ))}
          </select>
        :
          <select
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value))}
            style={{
              width: '90px',
              //textAlign: 'center'
              marginRight: '10px',
              marginLEft: '10px'
            }}
            className="select-voice"
            disabled
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} {/*({voice.lang}) {voice.default && ' [Default]'}*/}
              </option>
            ))}
          </select>
        }
      </>

    );
  };




  const [isPlaying, setIsPlaying] = useState(false);

  const audioArr = [];
  const idx = 0;

  var playTime = 0;

  const classes = useStyles();
  const dispatch = useDispatch();

  // user data
  const user = JSON.parse(localStorage.getItem('profile'));



  // handle like vs likes
  const Likes = () => {

    if (post.likeCount == 1){
      return <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likeCount} Like &nbsp;</>;
    }

    return <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likeCount} Likes &nbsp;</>;
  };






  




  




  const speak = (text, charstart) => {


    /*
    if new load, cancel speaker

    */
    
    if (synth.speaking) {
      synth.cancel();
      setIsPlaying(false);
    }
  
    if (text !== "") {
      const utterance = new SpeechSynthesisUtterance(text);

      //utterance.voice = synth.getVoices().filter(voice => voice.lang.startsWith('en-US'))[selectedVoice];





      
      const newVoices = synth.getVoices().filter((voice) => {
        return (
          voice.lang.startsWith('en') 
          && voiceList.some((name) => voice.name.includes(name))
        );
      });

  
      
      utterance.voice = newVoices[selectedVoice];
      

      setmax(1);
      
      const onBoundary = (event) => {
        const { charIndex } = event;
        const totalLength = post.message.length;
        const progress = ((charIndex + charstart)/ totalLength);

        setProgress(progress);
        setMarkerPosition(progress);
        
      
      }

      utterance.addEventListener('boundary', onBoundary);
      

      synth.speak(utterance);
      setIsPlaying(true);

    }


    updateState();
  };

  const stop = () => {

    
    synth.cancel();
    setProgress(0);
    
    setIsPlaying(false);

    setState(0);
    
  };

  useEffect(() => {
    synth.addEventListener("speechend", () => {
      setIsPlaying(false);
      
    });
  
    // deleting event listener on post delete
    return () => {
      //synth.removeEventListener("speechend");
    };

    setNewvoices(synth.getVoices().filter((voice) => {
      return (
        voice.lang.startsWith('en') 
        && voiceList.some((name) => voice.name.includes(name))
      );
    }))
  }, []);


  const handlePause = () => {

    if (isPaused) {
      setIsPaused(false);

      //synth.resume(); // alternative
      const charprogress = Math.round(post.message.length * progress);
      const remainingText = post.message.slice(charprogress, (post.message.length - 1));
      speak(remainingText, charprogress);

    } else {
      setIsPaused(true);
      synth.pause();
      synth.pause();
      synth.pause();
      //synth.stop()
    }

    updateState();
  }


  const handleProgressClick = (event) => {


    stop();

    const point = event.nativeEvent.offsetX;
    const totalWidth = event.currentTarget.offsetWidth;
    const progress = (point / totalWidth);
    setProgress(progress);

    const charprogress = Math.round(post.message.length * progress)

    //console.log(post.message.slice(charprogress, (post.message.length - 1)));

    speak(post.message.slice(charprogress, (post.message.length - 1)), charprogress);
    //handlePause();


    //console.log(state)

    if (isPaused == true){
      setIsPaused(true);
      synth.pause();

      setState(2);
      
      
    }
    else {
      setState(1);
    }




    
    
  }





  const handleRemove = () => {
    synth.removeEventListener("speechend", null);
    dispatch(deletePost(post._id));
  }








  const updateState = () => {
    if (state == 0){
      setState(1);
    }
    else if (state == 1){
      setState(2);
    }
    else if (state == 2){
      setState(1);
    }
  }


  const firstSpeak = () => {
    stop();
    speak(post.message, 0);
  }



  // Debounced functions for button click handlers
  const debouncedFirstSpeak = debounce(() => {
    firstSpeak();
  }, 200); // Adjust the debounce delay as per your needs

  const debouncedHandlePause = debounce(() => {
    handlePause();
  }, 200); // Adjust the debounce delay as per your needs



  /*
<span style={{ paddingLeft: '25px' }}>
          <progress strokeColor="yellow" value={progress} max={max} onClick={handleProgressClick}></progress>
        </span>


  */


        // Math.round(progress * 100)

  return (

    <Card className={classes.card} >
      {(user?.result?.name === post?.name) && (
        <div className={classes.overlay2}>

          <Button style={{ color: 'grey' }} size="small" onClick={() => setCurrentId(post._id)}>
            <MoreHorizIcon fontSize="medium" />
          </Button>
        </div>
      )}


        <Typography className={classes.title} variant="h5" gutterBottom >{post.title}</Typography>
      

        <div className={classes.voiceSel}>
          <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} disabled={state} />
        </div>


      <CardContent>

        <div display="flex" flex-direction="row" justify-content="center" align-items="center" style={{width: '130%'}}>
          
          {state == 0 ? 
            <button onClick={() => debouncedFirstSpeak()}>
              <PlayArrow fontSize="small" />
            </button>
            :
            null
          }
          {state == 1 ? 
            <button onClick={debouncedHandlePause}>
              <Pause fontSize="small" />
            </button>
            :
            null
          }
          {state == 2 ? 
          
            <button onClick={debouncedHandlePause}>
              <PlayArrow fontSize="small" />
            </button>
          :
          null
        }
        
      

        <span style={{ paddingLeft: '5px' }}>
        <button onClick={stop}>
          <Stop fontSize="small"/>   
        </button>
        </span>

        


        
        

        <span className={classes.progressBar} >


          <span id="my-progress">
          <progress value={progress} max={max} onClick={handleProgressClick}>            
            
          </progress>
          <span className="marker" style={{ left: `${Math.round(progress * 100)}%` }}></span>

          </span>
        </span>





        


        


        

        </div>

        <h1></h1>

        <ShowMoreText
          lines={3}
          more="Show more"
          less="Show less"
          className="content-css"
          expanded={false}
          truncatedEndingComponent={"... "}
        >


        

        <Typography variant="body2" color="textPrimary" component="h5" href={post.message} target="_blank" gutterBottom>{post.message}</Typography>
        </ShowMoreText>
      </CardContent>

      <CardActions className={classes.cardActions}>

          <Button size="small" color="primary" onClick={() => handleRemove()}>
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        
      </CardActions>




    </Card>

  )
};

export default Post;
