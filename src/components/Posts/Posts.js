import React from 'react';
import { Grid, CircularProgress, TextField } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';

// grid for holding post components

const Posts = ({ setCurrentId }) => {

  // user info
  const user = JSON.parse(localStorage.getItem('profile'));

  // access redux store
  const myposts = useSelector(state => {
    
    return state.posts.filter((post) => {
      if (user?.result?.name === post?.name){
        
        return post;
      }
    })
      
  
  });


  const classes = useStyles();

  // if (!length), circularprogress (loading)
  // else grid with posts

  return (
    myposts.length === null ? <CircularProgress /> : (
      <div>
        
        <Grid className={classes.container} container alignItems="stretch" spacing={3}>
          {myposts
          
          .map((post) => (
            
            <Grid key={post._id} item xs={12} sm={12} md={12}>
              <Post post={post} setCurrentId={setCurrentId}/>
            </Grid>
            
          ))}
        </Grid>
      </div>
    )
  );
};

export default Posts;