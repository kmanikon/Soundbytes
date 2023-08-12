import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  media: {
    height: 0,
    paddingTop: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
  },
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
  },
  overlay2: {
    position: 'absolute',
    top: '12px',
    right: '20px',
    color: 'grey',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
  },
  title: {
    padding: '8px 16px 0 16px ',
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 8px',
  },
  progressBar: {
    paddingLeft: '25px',
  },
  marker: {
    content: "",
    position: 'absolute',
    top: 0,
    bottom: 0,

    width: '10px',
    height: '15px',

    backgroundColor: 'black',
    pointerEvents: 'none',
    display: 'block',
  },
  voiceSel: {
    marginLeft: '15px'
  }
  
});



