import React from "react";
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import ApiIcon from '@mui/icons-material/Http';

// @ts-ignore
import iconImage from '../../assets/icon.png';


// const theme = useTheme();

// const useStyles = makeStyles(() => ({
//   menuButton: {
//     // color: theme.palette.common.white
//     color: '#fff'
//   },
//   linkButton: {
//     textTransform: 'none',
//     textDecoration: 'none',
//     color: '#fff'
//   },
//   linkLogo: {
//     // Seems to fit the 48px navbar height...
//     // height: '48px',
//     alignItems: 'center',
//     display: 'flex',
//   },
// }))
  
export default function NavBar() {
  const theme = useTheme();

  const useStyles = makeStyles(() => ({
    menuButton: {
      color: theme.palette.common.white
      // color: '#fff'
    },
    linkButton: {
      textTransform: 'none',
      textDecoration: 'none',
      color: '#fff'
    },
    linkLogo: {
      // Seems to fit the 48px navbar height...
      // height: '48px',
      alignItems: 'center',
      display: 'flex',
    },
  }))
  const classes = useStyles();

  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <Link to="/" className={classes.linkLogo}>
          <Tooltip title='☑️ FAIR Enough'>
            <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" />
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>

        <Tooltip title='Access the API used by this web interface'>
          <Button style={{color: '#fff'}} target="_blank" rel="noopener noreferrer"
          href="/api">
            <ApiIcon style={{ marginRight: theme.spacing(1)}} />
            API
          </Button>
        </Tooltip>
        <Link to="/about" className={classes.linkButton}>
          <Tooltip title='About'>
            <Button style={{color: '#fff'}}>
              <InfoIcon />
            </Button>
          </Tooltip>
        </Link>
        <Tooltip title='Source code'>
          <Button style={{color: '#fff'}} target="_blank"
          href="https://github.com/MaastrichtU-IDS/fair-enough ">
            <GitHubIcon />
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}