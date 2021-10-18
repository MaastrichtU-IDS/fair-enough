import React from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Card, CardContent, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import CreateCollectionIcon from '@mui/icons-material/Send';
// import CreateCollectionIcon from '@mui/icons-material/PlaylistAddCheck';
import CreateCollectionIcon from '@mui/icons-material/LibraryAdd';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import axiosRetry from 'axios-retry';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { settings } from '../settings'
import { useAuth } from 'oidc-react';

// import OAuth2Login from 'react-simple-oauth2-login';

export default function Evaluation() {
  const theme = useTheme();
  const history = useHistory();
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
    urlToEvaluate: "https://doi.org/10.1594/PANGAEA.908011",
    // urlToEvaluate: "https://doi.org/10.1038/sdata.2016.18",
    evaluationResults: evaluationResults,
    adviceLogs: [],
    evaluationRunning: false,
    evaluationsList: [],
    metadata_service_endpoint: 'https://ws.pangaea.de/oai/provider',
    use_datacite: true,
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
    if (!state.currentUser && configState && configState['access_token']) {
      console.log(configState);
      // Qet current user from API to check if access token still valid
      axios.get(settings.restUrl + '/current-user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + configState['access_token']
        },
      })
        .then((res: any) => {
          console.log('got current user')
          console.log(res.data)
          if (res.data['id']) {
            updateState({ currentUser: res.data, accessToken: configState['access_token'], loggedIn: true})
          }
          // if (res.data['error'] == 'access_denied') {
        })

      updateState({ currentUser: {token: configState.access_token} })
    }

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

    // Get the list of evaluations from API
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
  }, [state.currentUser, state.loggedIn, state.accessToken])

  const getUrlHtml = (urlString: string) => {
    if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
      // Process URIs
      return <a href={urlString} className={classes.link} target="_blank" rel="noopener noreferrer">{urlString}</a>
    } else {
      return urlString
    }
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
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
    axios.post(settings.restUrl + '/collections', 
      postCollec, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + state.accessToken
        },
      }
    )
      .then((res: any) => {
        console.log('New collection ' + postCollec.id + ' successfully created.')
        console.log(res.data)
        // if (res.data['id']) {
        //   updateState({ currentUser: res.data, loggedIn: true })
        // }
        // if (res.data['error'] == 'access_denied') {
      })

  }
  const addAssessment  = (assessment: any) => {
    // event.preventDefault();
    updateState({addedAssessment: state.addedAssessments.push(assessment)})
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

      { state.loggedIn &&
        <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
          Logged in as {state.currentUser.given_name} {state.currentUser.family_name}
        </Typography>
      }
      { !state.loggedIn &&
          <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            You need to login with your ORCID to create a new collection.
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
                <Grid item xs={3}  key={key}>
                  <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'left'}}>
                    <Typography>{item.title}</Typography>
                  </Paper>
                </Grid>
            ))}
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
              .map((item: any, key: number) => (
                <Grid item xs={6} key={key}>
                  {/* onClick={addAssessment(item)}  */}
                  <div onClick={() => addAssessment(item)}>
                    <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'left', cursor: 'pointer'}}>
                        <Typography>{item.title}</Typography>
                        <Typography>{item.description}</Typography>
                        <Typography>Max score: {item.max_score}</Typography>
                        <Typography>Max bonus: {item.max_bonus}</Typography>
                    </Paper>
                  </div>
                </Grid>
            ))}
          </Grid>


          {/* <Tooltip  title='Evaluator settings'>
            <Button style={{margin: theme.spacing(1)}} onClick={handleClick}>
              <SettingsIcon />
            </Button>
          </Tooltip> */}
          <Popper open={open} anchorEl={anchorEl}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'center'}}>
                {/* <Typography variant="h6" style={{textAlign: 'center'}}>
                  Evaluator settings
                </Typography> */}
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
          </Popper>
        {/* </Box> */}

        <Button type="submit" 
          variant="contained" 
          disabled={!state.loggedIn}
          // className={classes.submitButton} 
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(4)}}
          startIcon={<CreateCollectionIcon />}
          color="secondary" >
            Create the collection
        </Button>

        { !state.loggedIn &&
          <Typography style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            You need to login with your ORCID to create a new collection.
          </Typography>
        }
      </form>

    </Container>
  )
}

