import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import ShowMoreText from "react-show-more-text";

import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './styles';

// each post card

const Post = ({ post, setCurrentId }) => {

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
      
      <CardContent>
        
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

          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        
      </CardActions>


    </Card>

  )
};

export default Post;
