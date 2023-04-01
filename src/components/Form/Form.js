import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

import * as pdfjsLib from 'pdfjs-dist/webpack';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";


/*
  Reference for pdf text extract:
  https://qawithexperts.com/article/javascript/read-pdf-file-using-javascript/318

*/


const BASE64_MARKER = ';base64,';


function ExtractText(setPDF) {

  var input = document.getElementById("file-id");
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  //console.log(input.files[0]);
  fReader.onloadend = function (event) {
      convertDataURIToBinary(event.target.result, setPDF);
  }
}


function convertDataURIToBinary(dataURI, setPDF) {

  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
  }
  pdfAsArray(array, setPDF)


}

function getPageText(pageNum, PDFDocumentInstance) {
  
  // Return a Promise that is solved once the text of the page is retrieven
  return new Promise(function (resolve, reject) {
      PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
          // The main trick to obtain the text of the PDF page, use the getTextContent method
          pdfPage.getTextContent().then(function (textContent) {
              var textItems = textContent.items;
              var finalString = "";

              // Concatenate the string of the item to the final string
              for (var i = 0; i < textItems.length; i++) {
                  var item = textItems[i];

                  finalString += item.str + " ";
              }

              // this is the extracted text
              //console.log(finalString);

              // Solve promise with the text retrieven from the page
              resolve(finalString);
          });
      });
  });
}

function pdfAsArray(pdfAsArray, setPDF) {

  //console.log(pdfAsArray)
  pdfjsLib.getDocument(pdfAsArray).promise.then(function (pdf) {

      var pdfDocument = pdf;
      // Create an array that will contain our promises
      var pagesPromises = [];


      for (var i = 0; i < pdf._pdfInfo.numPages; i++) {
          // Required to prevent that i is always the total of pages
          (function (pageNumber) {
              // Store the promise of getPageText that returns the text of a page
              pagesPromises.push(getPageText(pageNumber, pdfDocument));
          })(i + 1);
      }
      

      
      // Execute all the promises
      Promise.all(pagesPromises).then(function (pagesText) {

          //console.log(pagesText)
          setPDF(pagesText);

      });

  }, function (reason) {
      // PDF loading error
      console.error(reason);
  });
}
















// this form handles post creation and updates

const Form = ({ currentId, setCurrentId }) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  // state for post data
  const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
  
  // whether user has selected a post
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
  
  const classes = useStyles();
  
  // keep user id
  const user = JSON.parse(localStorage.getItem('profile'));

  const dispatch = useDispatch();


  const [pdf, setPDF] = useState();

  const [sumtext, setSumText] = useState('');



  // extract text from pdf (from input tag) and store in pdf state
  // async, done once handleSubmit is called
  const doPDFSTUFF = async (setPDF) => {
    console.log('hit')

    ExtractText(setPDF)

  }



  const makePost = async (text) => {


    if (text == ''){
      postData.message = 'Sorry! There was an error parsing text.'
    }
    else {
      postData.message = text
    }

    console.log(postData)
    
    if (currentId === 0) { // create
      dispatch(createPost({ ...postData, name: user?.result?.name }));
      clear();
    } else { // update
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }

  }



  
  // makes call to textminer NLP API
  const makeAPICall = async (text) => {

    

    let input = ""
    
    for (let i = 0; i < text.length; i++){
      input += text[i]
    }


      makePost(input);
  }

  

    


  
  
  // if user selects a new post, show it in form
  useEffect(() => {
    if(post) setPostData(post);
  }, [post])

  // clear form data
  const clear = () => {
    setCurrentId(0); // might change back to null
    setPostData({ title: '', message: '', tags: '', selectedFile: '' });
  }




 
  // send form data to actions
  const handleSubmit = async (e) => {
    e.preventDefault();

    // call API here
    await makeAPICall(pdf)

  };


  // form if user is not logged in
  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to Create Soundbytes.
        </Typography>
      </Paper>
    );
  }


  return (
    <Paper className={classes.paper}>


      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
      <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a Soundbyte</Typography>
      
      <TextField 
        name="title" 
        variant="outlined" 
        label="Title" 
        fullWidth 
        value={postData.title}
        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
      />




      <input type="file" id="file-id" name="file_name" 
      className={classes.fileInput}
      onChange={() => doPDFSTUFF(setPDF)}
      accept=".pdf"
      />


      


      <Button 
        className={classes.buttonSubmit} 
        variant="contained" 
        color="primary" 
        size="large" 
        type="submit" 
        fullWidth>
          Submit
      </Button>

      <Button 
        variant="contained" 
        color="secondary" 
        size="small" 
        onClick={clear}
        fullWidth>
          Clear
      </Button>

      </form>
    </Paper>
  )
};

export default Form;
