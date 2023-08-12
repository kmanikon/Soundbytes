import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
  },
  /*
  heading: {
    color: 'rgba(0,183,255, 1)',
    textDecoration: 'none',
  },
  */
  heading: {
    color: 'rgba(0, 183, 255, 1)',
    textDecoration: 'none',

    // Add media queries for different screen widths
    [theme.breakpoints.down('xs')]: {
      fontSize: '3.15rem', // Adjust this value as needed for smaller screens
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: '4rem', // Adjust this value as needed for medium screens
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '4rem', // Adjust this value as needed for larger screens
    },
  },
  image: {
    marginLeft: '25px',
    marginTop: '5px'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '400px',
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));