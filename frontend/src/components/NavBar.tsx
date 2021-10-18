import React from "react";
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Tooltip, IconButton, Box, ButtonBase } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import ApiIcon from '@mui/icons-material/Http';
import GraphqlIcon from '@mui/icons-material/Code';
import LoginIcon from '@mui/icons-material/Login';

// @ts-ignore
import iconImage from '../../assets/icon.png';

import { settings } from '../settings';
import { useAuth } from 'oidc-react';
import OAuth2Login from 'react-simple-oauth2-login';

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
  // const auth = useAuth();

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


  const onSuccess = (response: any) => {
    console.log(response)
    localStorage.setItem("fairEnoughSettings", JSON.stringify(response));
    window.location.reload();
  };
  const onFailure = (response: any) => console.error(response);


  // const localStorageConfig = localStorage.getItem("fairEnoughSettings");
  //     if (localStorageConfig) {
  //       let configState: any = JSON.parse(localStorageConfig);
  //       access_token = configState.access_token;
  //     }


  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <Link to="/" className={classes.linkLogo}>
          <Tooltip title='☑️ FAIR Enough'>
            <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" />
          </Tooltip>
        </Link>
        <Link to="/collections" className={classes.linkButton}>
          <Tooltip title='Browse existing Collections of assessments'>
            <Button style={{color: '#fff'}}>
              {/* <InfoIcon /> */}
              Collections
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>

        <Tooltip title='Access the OpenAPI documentation of the API used by this web interface'>
          <Button style={{color: '#fff'}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            <ApiIcon style={{ marginRight: theme.spacing(1)}} />
            API
          </Button>
        </Tooltip>
        <Tooltip title='Access the GraphQL API used by this web interface'>
          <Button style={{color: '#fff'}} target="_blank" rel="noopener noreferrer"
          href={settings.graphqlUrl}>
            {/* + '?query=query%20%7B%0A%20%20evaluations%20%7B%0A%20%20%20%20title%0A%20%20%20%20resourceUri%0A%20%20%20%20collection%0A%20%20%20%20score%20%7B%0A%20%20%20%20%20%20totalScore%0A%20%20%20%20%20%20totalScoreMax%0A%20%20%20%20%20%20percent%0A%20%20%20%20%20%20totalBonus%0A%20%20%20%20%20%20totalBonusMax%0A%20%20%20%20%20%20bonusPercent%0A%20%20%20%20%7D%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20fairType%0A%20%20%20%20%20%20metricId%0A%20%20%20%20%20%20score%0A%20%20%20%20%20%20maxScore%0A%20%20%20%20%20%20bonusScore%0A%20%20%20%20%20%20maxBonus%0A%20%20%20%20%20%20logs%0A%20%20%20%20%7D%0A%20%20%20%20data%0A%20%20%7D%0A%7D' */}
            <GraphqlIcon style={{ marginRight: theme.spacing(1)}} />
            GraphQL
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
          href="https://github.com/MaastrichtU-IDS/fair-enough">
            <GitHubIcon />
          </Button>
        </Tooltip>

        {/* <Tooltip title='Login with ORCID'> */}
        {/* <Button variant='contained' color='primary' size='small' component="span"> */}
        <OAuth2Login
          className="MuiButton‑root MuiButton‑contained"
          authorizationUrl="https://orcid.org/oauth/authorize"
          responseType="token"
          clientId={process.env.ORCID_CLIENT_ID}
          clientSecret={process.env.ORCID_CLIENT_SECRET}
          redirectUri={settings.OauthRedirectUri}
          // redirectUri=""
          style={{textTransform: 'none', textDecoration: 'none'}}
          onSuccess={onSuccess}
          onFailure={onFailure}>
          <Button variant='contained' color='primary' size='small' component="span">
            Login
          </Button>

        </OAuth2Login>    
        {/* </Button> */}
        {/* </Tooltip> */}

        {/* <Tooltip title='Login with ORCID'>
          <Button href="http://localhost/rest/login" style={{color: '#fff'}} >
            <LoginIcon />
          </Button>
        </Tooltip> */}
        {/* <Tooltip title='Login with ORCID'>
          <Button onClick={() => {auth.signIn()}} style={{color: '#fff'}} >
            <LoginIcon />
          </Button>
        </Tooltip> */}

      </Toolbar>
    </AppBar>
  );
}