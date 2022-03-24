import React, { useContext } from "react";
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Tooltip, Icon, IconButton, Box, ButtonBase } from '@mui/material';
import { Popper, ClickAwayListener, Typography, Paper, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
// import ApiIcon from '@mui/icons-material/Http';
// import GraphqlIcon from '@mui/icons-material/Code';
// import LoginIcon from '@mui/icons-material/Login';
import CollectionsIcon from '@mui/icons-material/CollectionsBookmark';
import AssessmentsIcon from '@mui/icons-material/AssignmentTurnedIn';
import EvaluationIcon from '@mui/icons-material/NetworkCheck';
import axios from 'axios';

// @ts-ignore
import iconImage from '../../assets/icon.png';
// @ts-ignore
import GraphqlIcon from '../../assets/graphql_logo.svg';
// @ts-ignore
import ApiIcon from '../../assets/openapi_logo.svg';
// @ts-ignore
import OrcidIcon from '../../assets/orcid_logo.svg';

import { getUrlHtml, settings } from '../settings';
// import { useAuth } from 'oidc-react';
// @ts-ignore
import OAuth2Login from 'react-simple-oauth2-login';
import UserContext from '../UserContext'

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
    loginButton: {
      padding: '0px',
      border: '0',
      backgroundColor: 'inherit',
    },
    icon: {
      paddingRight: theme.spacing(1),
    }
  }))
  const classes = useStyles();

  const { user, setUser }: any = useContext(UserContext)

  const [state, setState] = React.useState({
    currentUsername: null,
    accessToken: null,
    loggedIn: false
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // Settings for Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl]: any = React.useState(null);
  const showUserInfo = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    // setAnchorEl(anchorEl ? null : document.body);
    setOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(anchorEl ? null : anchorEl);
  };
  const id = open ? 'simple-popper' : undefined;


  const onSuccess = (response: any) => {
    getCurrentUser(response)
    // console.log(response)
    // const tokenRes: any = JSON.stringify(response)
    // console.log('tokenRes')
    // console.log(response['access_token'])
    // console.log(response)

    // axios.get(settings.restUrl + '/current-user', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + response['access_token']
    //   },
    // })
    //   .then((res: any) => {
    //     console.log('got current user')
    //     let user = res.data
    //     user['access_token'] = response['access_token']
    //     console.log(user)
    //     setUser(user)
    //     localStorage.setItem("fairEnoughSettings", JSON.stringify(user));
    //     // window.location.reload();
    //     // TODO: refactor to use Context without reload
    //   })

    // localStorage.setItem("fairEnoughSettings", JSON.stringify(response));
    // window.location.reload();
  };
  const onFailure = (response: any) => console.error(response);

  const logout = () => {
    localStorage.clear();
    setUser({})
    handleClickAway()
    // window.location.reload();
  }


  const getCurrentUser = (configState: any) => {
    axios.get(settings.restUrl + '/current-user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + configState['access_token']
      },
    })
      .then((res: any) => {
        let current_user = res.data
        console.log('current_user!!', current_user)
        current_user['access_token'] = configState['access_token']
        // setUser(current_user)
        if (!current_user.error) {
          current_user['access_token'] = configState['access_token']
          if (current_user['given_name'] || current_user['family_name']) {
            current_user['username'] = current_user['given_name'] + ' ' + current_user['family_name']
          } else if (current_user['name']) {
            current_user['username'] = current_user['name']
          } else {
            current_user['username'] = current_user['sub']
          }
          setUser(current_user)
          localStorage.setItem("fairEnoughSettings", JSON.stringify(current_user));
        }
        // https://stackoverflow.com/questions/25686484/what-is-intent-of-id-token-expiry-time-in-openid-connect
        // If the token is expired, it should make another auth request, except this time with prompt=none in the URL parameter
        // Getting an error with prompt if not login
        
        // localStorage.setItem("fairEnoughSettings", JSON.stringify(user));
        // window.location.reload();
      })
      .catch((error: any) => {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })
      // Also possible and lighter on the Auth API: just check the cookie
      // const username = configState['given_name'] + ' ' + configState['family_name']
      // updateState({ currentUsername: username, accessToken: configState['access_token'], loggedIn: true})
      // console.log('access_token before setUser')
      // console.log(configState)
      // setUser({
      //   username: username, 
      //   access_token: configState['access_token'],
      //   id: configState['id'],
      // })
  }

  React.useEffect(() => {
    const localStorageConfig: any = localStorage.getItem("fairEnoughSettings");
    // console.log(localStorageConfig)
    let configState: any = JSON.parse(localStorageConfig);
    if (configState && configState['access_token']) {
      getCurrentUser(configState)
    }

    // if (configState && configState['access_token']) {
    //   axios.get(settings.restUrl + '/current-user', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + configState['access_token']
    //     },
    //   })
    //     .then((res: any) => {
    //       let user = res.data
    //       if (!user.error) {
    //         user['access_token'] = configState['access_token']
    //         if (user['given_name'] || user['family_name']) {
    //           user['username'] = configState['given_name'] + ' ' + configState['family_name']
    //         } else if (user['name']) {
    //           user['username'] = user['name']
    //         }
    //         setUser(user)
    //       }
    //       // https://stackoverflow.com/questions/25686484/what-is-intent-of-id-token-expiry-time-in-openid-connect
    //       // If the token is expired, it should make another auth request, except this time with prompt=none in the URL parameter
    //       // Getting an error with prompt if not login
          
    //       // localStorage.setItem("fairEnoughSettings", JSON.stringify(user));
    //       // window.location.reload();
    //     })
    //   // Also possible and lighter on the Auth API: just check the cookie
    //   // const username = configState['given_name'] + ' ' + configState['family_name']
    //   // updateState({ currentUsername: username, accessToken: configState['access_token'], loggedIn: true})
    //   // console.log('access_token before setUser')
    //   // console.log(configState)
    //   // setUser({
    //   //   username: username, 
    //   //   access_token: configState['access_token'],
    //   //   id: configState['id'],
    //   // })
    // }
    // const { setSalad } = useContext(SaladContext)
  // }, [user])
  }, [])

  // const localStorageConfig = localStorage.getItem("fairEnoughSettings");
  //     if (localStorageConfig) {
  //       let configState: any = JSON.parse(localStorageConfig);
  //       access_token = configState.access_token;
  //     }


  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        {/* <Link to="/" className={classes.linkLogo}>
          <Tooltip title='⚖️ FAIR Enough'>
            <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" />
          </Tooltip>
        </Link> */}
        <Link to="/" className={classes.linkButton}>
          <Tooltip title='Browse existing evaluations, or submit a new one'>
            <Button style={{color: '#fff', textTransform: 'none'}}>
              <EvaluationIcon className={classes.icon} />FAIR Evaluations
            </Button>
          </Tooltip>
        </Link>
        <Link to="/collections" className={classes.linkButton}>
          <Tooltip title='Browse existing Collections of assessments, or create a new one'>
            <Button style={{color: '#fff', textTransform: 'none'}} className={classes.linkButton}>
              <CollectionsIcon className={classes.icon}/>Collections
            </Button>
          </Tooltip>
        </Link>
        <Link to="/metrics" className={classes.linkButton}>
          <Tooltip title='Browse existing Metrics Tests, or register a new one'>
            <Button style={{color: '#fff', textTransform: 'none'}} className={classes.linkButton}>
              <AssessmentsIcon className={classes.icon}/>Metrics Tests
            </Button>
          </Tooltip>
        </Link>

        <div className="flexGrow"></div>

        <Tooltip title='Access the OpenAPI documentation of the API used by this website'>
          <Button style={{color: '#fff', textTransform: 'none'}} target="_blank" rel="noopener noreferrer"
          href={settings.docsUrl}>
            {/* <ApiIcon style={{ marginRight: theme.spacing(1)}} /> */}
            <Icon style={{display: 'flex', marginRight: theme.spacing(1)}}>
              <img src={ApiIcon}/>
            </Icon> RESTful API
          </Button>
        </Tooltip>
        <Tooltip title='Access the experimental GraphQL API'>
          <Button style={{color: '#fff', textTransform: 'none'}} target="_blank" rel="noopener noreferrer"
          href={settings.graphqlUrl}>
            {/* + '?query=query%20%7B%0A%20%20evaluations%20%7B%0A%20%20%20%20title%0A%20%20%20%20resourceUri%0A%20%20%20%20collection%0A%20%20%20%20score%20%7B%0A%20%20%20%20%20%20totalScore%0A%20%20%20%20%20%20totalScoreMax%0A%20%20%20%20%20%20percent%0A%20%20%20%20%20%20totalBonus%0A%20%20%20%20%20%20totalBonusMax%0A%20%20%20%20%20%20bonusPercent%0A%20%20%20%20%7D%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20fairType%0A%20%20%20%20%20%20metricId%0A%20%20%20%20%20%20score%0A%20%20%20%20%20%20maxScore%0A%20%20%20%20%20%20bonusScore%0A%20%20%20%20%20%20maxBonus%0A%20%20%20%20%20%20logs%0A%20%20%20%20%7D%0A%20%20%20%20data%0A%20%20%7D%0A%7D' */}
            {/* <GraphqlIcon style={{ marginRight: theme.spacing(1)}} /> */}
            <Icon style={{display: 'flex', marginRight: theme.spacing(1)}}>
              <img src={GraphqlIcon} />
            </Icon> GraphQL
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
        {/* {} */}
        { user.username && 
            <Button variant='contained' onClick={showUserInfo} color='secondary' 
                style={{textTransform: 'none'}} size='small'>
              {user.username}
            </Button>
        }
        { !user.username && 
          <OAuth2Login
            className={classes.loginButton}
            authorizationUrl="https://orcid.org/oauth/authorize"
            responseType="token"
            clientId={process.env.ORCID_CLIENT_ID}
            clientSecret={process.env.ORCID_CLIENT_SECRET}
            redirectUri={settings.OauthRedirectUri}
            // redirectUri=""
            style={{textTransform: 'none', textDecoration: 'none', padding: '0px'}}
            onSuccess={onSuccess}
            onFailure={onFailure}>
              <Button variant='contained' color='secondary' size='small' component="span" 
                  style={{textTransform: 'none'}}>
                Login with ORCID
                <Icon style={{display: 'flex', marginLeft: theme.spacing(1)}}>
                  <img src={OrcidIcon} />
                </Icon>
              </Button>
          </OAuth2Login>
          }
        <Popper open={open} anchorEl={anchorEl}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper elevation={4} style={{padding: theme.spacing(2, 2), textAlign: 'left'}}>
                <Typography style={{marginBottom: theme.spacing(1)}}>
                  Logged in with ORCID: {getUrlHtml(user.id)}
                </Typography>
                <Typography style={{marginBottom: theme.spacing(1)}}>
                  Username: {user.username}
                </Typography>
                <Button onClick={logout} variant='contained' size='small'>
                  Logout
                </Button>
              </Paper>
            </ClickAwayListener>
          </Popper>    
        {/* </Button> */}
        {/* </Tooltip> */}

        {/* <Tooltip title='Login with ORCID'>
          <Button href="http://localhost/login" style={{color: '#fff'}} >
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