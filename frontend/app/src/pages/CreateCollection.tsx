import React, { useContext } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, IconButton, Paper, Card, CardContent, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import CreateCollectionIcon from '@mui/icons-material/Send';
// import CreateCollectionIcon from '@mui/icons-material/PlaylistAddCheck';
import CreateCollectionIcon from '@mui/icons-material/LibraryAdd';
import ArrowIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { settings } from '../settings'
import { useAuth } from 'oidc-react';
import UserContext from '../UserContext';

// import OAuth2Login from 'react-simple-oauth2-login';

export default function Evaluation() {
  const theme = useTheme();
  const history = useHistory();
  const { user }: any = useContext(UserContext);
  // const auth = useAuth();

  const useStyles = makeStyles(() => ({
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      // color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.light,
        textDecoration: 'none',
      },
    },
    submitButton: {
      textTransform: 'none',
      margin: theme.spacing(2, 2),
    },
    fullWidth: {
      width: '100%',
      margin: theme.spacing(2, 2)
    },
    autocomplete: {
      marginRight: theme.spacing(2)
    },
    formInput: {
      background: 'white',
      width: '100%'
    },
    paperPadding: {
      padding: theme.spacing(2, 2),
      margin: theme.spacing(2, 2),
    },
  }))
  const classes = useStyles();

  // useLocation hook to get URL params
  // let location = useLocation();  
  let evaluationResults: any = null;
  let currentUser: any = null;
  let addedAssessments: any = [];
  const [state, setState] = React.useState({
    currentUser: currentUser,
    accessToken: null,
    loggedIn: false,
    assessmentsList: [],
    addedAssessments: addedAssessments,
    collectionId: '',
    collectionTitle: '',
    collectionDescription: '',
    collectionHomepage: '',
    collectionCreatedSnackbar: null,
    errorMessage: null,
    // urlToEvaluate: "https://doi.org/10.1594/PANGAEA.908011",
    // // urlToEvaluate: "https://doi.org/10.1038/sdata.2016.18",
    // evaluationResults: evaluationResults,
    // adviceLogs: [],
    // evaluationRunning: false,
    // evaluationsList: [],
    // metadata_service_endpoint: 'https://ws.pangaea.de/oai/provider',
    // use_datacite: true,
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
  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    // setAnchorEl(anchorEl ? null : document.body);
    setOpen((prev) => !prev);
  };
  const handleClickAway = () => {
    setOpen(false);
    setAnchorEl(anchorEl ? null : anchorEl);
  };
  const id = open ? 'simple-popper' : undefined;
  
  // response.headers.get("Authorization").replace('Bearer ', '')
  // Run on page init
  React.useEffect(() => {
    // Check if user logged in
    const localStorageConfig: any = localStorage.getItem("fairEnoughSettings");
    let configState: any = JSON.parse(localStorageConfig);
    console.log(localStorageConfig);
    console.log(settings.restUrl);
    // if (!state.currentUser && configState && configState['access_token']) {
    //   console.log(configState);
    //   // Qet current user from API to check if access token still valid
    //   axios.get(settings.restUrl + '/current-user', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Bearer ' + configState['access_token']
    //     },
    //   })
    //     .then((res: any) => {
    //       console.log('got current user')
    //       console.log(res.data)
    //       if (res.data['id']) {
    //         updateState({ currentUser: res.data, accessToken: configState['access_token'], loggedIn: true})
    //       }
    //       // if (res.data['error'] == 'access_denied') {
    //     })

    //   updateState({ currentUser: {token: configState.access_token} })
    // }

    // axios.post(settings.restUrl + '/login', {
    //   headers: {'Content-Type': 'application/json'},
    // })
    //   .then((res: any) => {
    //     // let assessmentsList: any = []
    //     // res.data.map((evaluation: any, key: number) => {
    //     //   evaluation['id'] = evaluation['_id']
    //     //   evaluation['score_percent'] = evaluation['score']['percent']
    //     //   evaluation['bonus_percent'] = evaluation['score']['bonus_percent']
    //     //   evaluationsList.push(evaluation)
    //     // })
    //     console.log('got login')
    //     console.log(res.data)
    //     console.log(res.headers)
    //     // updateState({ assessmentsList: res.data })

    //   })

    // Get the list of assessments from API
    if (state.assessmentsList.length < 1) {
      axios.get(settings.restUrl + '/assessments', {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          // let assessmentsList: any = []
          // res.data.map((evaluation: any, key: number) => {
          //   evaluation['id'] = evaluation['_id']
          //   evaluation['score_percent'] = evaluation['score']['percent']
          //   evaluation['bonus_percent'] = evaluation['score']['bonus_percent']
          //   evaluationsList.push(evaluation)
          // })
          console.log('got assesments')
          console.log(res.data)
          updateState({ assessmentsList: res.data })

        })
    }
  }, [])

  const getUrlHtml = (urlString: string) => {
    if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
      // Process URIs
      return <a href={urlString} className={classes.link} target="_blank" rel="noopener noreferrer">{urlString}</a>
    } else {
      return urlString
    }
  }

  const getBadgeFair  = (fairType: string, metricId: number) => {
    const emojiMap: any = {
      'f': '🔍️',
      'a': '📬️',
      'i': '⚙️',
      'r': '♻️'
    }
    return <Chip size='medium' label={emojiMap[fairType] + ' ' + fairType.toUpperCase() + metricId.toString()}/> // blue
  }
  const getBadgeRole  = (role: string) => {
    const colorMap: any = {
      'harvest': 'secondary',
      'test': 'default',
    }
    return <Chip size='medium' color={colorMap[role]} label={role}/>
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
  function handleClose (event: any, reason: any) {
    updateState({ collectionCreatedSnackbar: null, errorMessage: null});
  };
  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    // doEvaluateUrl(state.urlToEvaluate)
    let assessmentsInCollec: any = []
    state.addedAssessments.map((item: any, key: number) => {
      assessmentsInCollec.push(item.id)
    })
    const postCollec = {
      'id': state.collectionId,
      'title': state.collectionTitle,
      'description': state.collectionDescription,
      'homepage': state.collectionHomepage,
      'assessments': assessmentsInCollec,
    }
    // console.log(settings.restUrl);
    console.log(user['access_token']);
    axios.post(settings.restUrl + '/collections', 
      postCollec, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user['access_token']
        },
      }
    )
      .then((res: any) => {
        console.log('New collection ' + postCollec.id + ' successfully created.')
        console.log(res.data)
        updateState({ collectionCreatedSnackbar: 'Collection ' + postCollec.id + ' successfully created' })
        // if (res.data['id']) {
        //   updateState({ currentUser: res.data, loggedIn: true })
        // }
        // if (res.data['error'] == 'access_denied') {
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          // {"detail":[{"loc":["body","homepage"],"msg":"invalid or missing URL scheme","type":"value_error.url.scheme"}]}
          
          if (error.response.data["detail"]) {
            updateState({ errorMessage: 'Error: ' + JSON.stringify(error.response.data["detail"])})
          // } else if (error.response.data["detail"][0]['loc']) {
          //   const errorMsg = 'Error: ' + error.response.data["detail"][0]['loc'][1] + ' ' + error.response.data["detail"][0]['msg']
          //   updateState({ errorMessage: errorMsg })
          } else {
            updateState({ errorMessage: JSON.stringify(error.response.data) })
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log('request err');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          updateState({ errorMessage: error.message })
        }
    
      });

  }
  const addAssessment  = (assessment: any) => {
    // event.preventDefault();
    // console.log(user)
    updateState({addedAssessment: state.addedAssessments.push(assessment)})
  }
  const removeAssessment  = (assessmentId: any) => {
    // event.preventDefault();
    // console.log(state.addedAssessments)
    // console.log(state.addedAssessments.filter(( obj: any ) => {
    //   return obj.id !== assessmentId;
    // }))
    updateState({addedAssessments: state.addedAssessments.filter(( obj: any ) => {
      return obj.id !== assessmentId;
    })})
  }

  // const BorderLinearProgress = withStyles({
  //   root: {
  //     height: 20,
  //     width: "100%",
  //     // backgroundColor: hex ? lighten(internalColor, 0.5) : undefined,
  //     borderRadius: "10px"
  //   },
  //   bar: {
  //     borderRadius: 20,
  //     // backgroundColor: hex ? internalColor : undefined
  //   }
  // })(LinearProgress);

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
        Create a collection of assessments
      </Typography>

      { user['username'] &&
        <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
          ✅ Logged in as {user['username']}
        </Typography>
      }
      { !user['username'] &&
          <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            ⚠️ You need to login with your ORCID to create a new collection
          </Typography>
        }

      {/* Form to provide the URL to evaludate */}
      <form onSubmit={handleSubmit}>
        {/* <Box display="flex" style={{margin: theme.spacing(0, 6)}}> */}
          <TextField
            id='collectionId'
            label='Collection ID'
            placeholder='Collection ID'
            value={state.collectionId}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            // size='small'
            InputProps={{
              className: classes.formInput
            }}
            style={{margin: theme.spacing(1, 0)}}
          />

          <TextField
            id='collectionTitle'
            label='Collection Title'
            placeholder='Collection Title'
            value={state.collectionTitle}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            InputProps={{
              className: classes.formInput
            }}
            style={{margin: theme.spacing(1, 0)}}
          />

          <TextField
            id='collectionDescription'
            label='Collection Description'
            placeholder='Collection Description'
            value={state.collectionDescription}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            InputProps={{
              className: classes.formInput
            }}
          />

          <TextField
            id='collectionHomepage'
            label='Collection Homepage'
            placeholder='Collection Homepage'
            value={state.collectionHomepage}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            InputProps={{
              className: classes.formInput
            }}
            style={{margin: theme.spacing(1, 0)}}
          />

          <Typography variant="h5" style={{textAlign: 'center', margin: theme.spacing(3, 0)}}>
            Assessments in your collection:
          </Typography>
          <Grid container spacing={1}>
            { state.addedAssessments
              .map((item: any, key: number) => (
                <Grid item xs={3} display="flex" key={key} style={{alignItems: 'center'}} >
                  <ArrowIcon />
                  <div onClick={() => removeAssessment(item.id)}>
                    <Tooltip title='Click to remove this assessment from your collection'>
                      <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'left', cursor: 'pointer'}}>
                        {/* <Box display='flex' style={{alignItems: 'center'}}> */}
                        <Typography>
                          {item.title}
                        </Typography>
                        {getBadgeFair(item.fair_type, item.metric_id)}&nbsp;
                        {getBadgeRole(item.role)}&nbsp;
                        {/* </Box> */}
                        {/* <Typography variant='body2'>
                          <a href={item.file_url} className={classes.link} target="_blank" rel="noopener noreferrer">{item.id}</a>
                        </Typography> */}
                      </Paper>
                    </Tooltip>
                  </div>
                </Grid>
              ))
              // .join(<ArrowIcon />)
            }
            { state.addedAssessments.length < 1 &&
              <Grid item xs={12}>
                <Typography style={{textAlign: 'center'}}>
                  No assessments added, click on the assessments in the list below to add them to your collection.
                </Typography>
              </Grid>
            }
          </Grid>

          <Typography variant="h5" style={{textAlign: 'center', margin: theme.spacing(3, 0)}}>
            Add assessments to your collection:
          </Typography>
          <Typography variant="body1" style={{textAlign: 'center', margin: theme.spacing(3, 0)}}>
            ⚠️ The order of the assessments in your collection matters, since they will be run one after the other in this order.
            Some assessments harvest metadata, when others assessments will run some checks (sometime on the previously harvested metadata). 
            It is recommended to put harvester assessments at the start of your collection.
          </Typography>
          <Grid container spacing={1}>
            { state.assessmentsList
              .filter((item: any) => {
                let filterItem = true
                state.addedAssessments.map((addedAssess: any, key: number) => {
                  if (addedAssess.id == item.id) {
                    filterItem = false
                  }
                })
                return filterItem
              })
              .sort((a: any, b: any) => {
                // harvest first, then F, then per alphabetic order to get FAIR order
                if ( a.role == 'harvest' && b.role != 'harvest' ){
                  return -1;
                }
                if ( a.role != 'harvest' && b.role == 'harvest' ){
                  return 1;
                }
                if ( a.fair_type == 'f' && b.fair_type != 'f' ){
                  return -1;
                }
                if ( a.fair_type != 'f' && b.fair_type == 'f' ){
                  return 1;
                }
                if ( a.fair_type + a.metric_id < b.fair_type + b.metric_id ){
                  return -1;
                }
                if ( a.fair_type + a.metric_id > b.fair_type + b.metric_id ){
                  return 1;
                }
                return 0;
              })
              .map((item: any, key: number) => (
                <Grid item xs={6} key={key} style={{alignItems: 'center'}}>
                  {/* onClick={addAssessment(item)}  */}
                  {/* <div onClick={(event) => { addAssessment(item)} }> */}
                    <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'left'}}>
                        <Box display='flex' style={{alignItems: 'center'}}>
                          <Tooltip title={'Add ' + item.id + ' to your collection'}>
                            <IconButton color='primary'
                                // sx={{ borderRadius: 28 }} 
                                style={{marginRight: theme.spacing(1)}} 
                                onClick={() => addAssessment(item)}>
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                          {getBadgeFair(item.fair_type, item.metric_id)}&nbsp;
                          {getBadgeRole(item.role)}&nbsp;
                          <Typography variant='h6'>
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant='body2'>
                          <a onClick={(event) => {} } href={item.file_url} className={classes.link} target="_blank" rel="noopener noreferrer">{item.id}</a>
                        </Typography>
                        <Typography variant='body2'>{item.description}</Typography>
                        <Typography variant='body2'>Max score: {item.max_score} | Max bonus: {item.max_bonus}</Typography>
                    </Paper>
                  {/* </div> */}
                </Grid>
            ))}
          </Grid>


          {/* <Tooltip  title='Evaluator settings'>
            <Button style={{margin: theme.spacing(1)}} onClick={handleClick}>
              <SettingsIcon />
            </Button>
          </Tooltip> */}
          {/* <Popper open={open} anchorEl={anchorEl}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'center'}}>
                <Typography variant="h6" style={{textAlign: 'center'}}>
                  Evaluator settings
                </Typography> 
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Tooltip title='By default, the FAIR Enough evaluator uses content negociation based on the DOI URL to retrieve DataCite JSON metadata. If you uncheck this option F-UJI will try to use the landing page URL instead.'>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.use_datacite}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              updateState({[event.target.name]: event.target.checked});
                            }}
                            name="use_datacite"
                            color="primary"
                          />
                        }
                        label="Use DataCite"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip title='OAI-PMH (Open Archives Initiative Protocol for Metadata Harvesting) endpoint to use when searching for metadata about this resource.'>
                      <TextField
                        id='metadata_service_endpoint'
                        label='OAI-PMH metadata endpoint URL'
                        placeholder='OAI-PMH metadata endpoint URL'
                        value={state.metadata_service_endpoint}
                        className={classes.fullWidth}
                        variant="outlined"
                        onChange={handleTextFieldChange}
                        // size='small'
                        InputProps={{
                          className: classes.formInput
                        }}
                      />
                    </Tooltip>
                    <FormHelperText>List of OAI-PMH providers: {getUrlHtml('https://www.openarchives.org/Register/BrowseSites')}</FormHelperText>
                  </Grid>
                </Grid>
              </Paper>
            </ClickAwayListener>
          </Popper> */}
        {/* </Box> */}

        <Button type="submit" 
          variant="contained" 
          disabled={!user['username']}
          // className={classes.submitButton} 
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(4)}}
          startIcon={<CreateCollectionIcon />}
          color="secondary" >
            Publish the collection
        </Button>

        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} open={state.collectionCreatedSnackbar ? true : false} onClose={handleClose} autoHideDuration={6000}>
          <MuiAlert elevation={6} severity="success">
            {state.collectionCreatedSnackbar}
          </MuiAlert>
        </Snackbar>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} open={state.errorMessage ? true : false} onClose={handleClose} autoHideDuration={6000}>
          <MuiAlert elevation={6} severity="error">
            {state.errorMessage}
          </MuiAlert>
        </Snackbar>

        { !user['username'] &&
          <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            ⚠️ You need to login with your ORCID to create a new collection.
          </Typography>
        }
      </form>

    </Container>
  )
}

