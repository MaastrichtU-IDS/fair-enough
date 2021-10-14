import React from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import EvaluationIcon from '@mui/icons-material/Send';
// import EvaluationIcon from '@mui/icons-material/PlaylistAddCheck';
import EvaluationIcon from '@mui/icons-material/NetworkCheck';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import axiosRetry from 'axios-retry';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import settings from '../settings'
import { useAuth } from 'oidc-react';

export default function Evaluation() {
  const theme = useTheme();
  const history = useHistory();
  const auth = useAuth();

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
  let location = useLocation();  
  let evaluationResults: any = null;
  let resourceMetadata: any = null;
  let fairDoughnutConfig: any = null;
  const [state, setState] = React.useState({
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
  

  // Run on page init
  React.useEffect(() => {
    // if (process.env.API_URL) {
    //   updateState({ apiUrl: process.env.API_URL })
    // }
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    // if (urlToEvaluate) {
    //   updateState({ urlToEvaluate: urlToEvaluate })
    //   doEvaluateUrl(urlToEvaluate)
    // }

    console.log(settings.apiUrl)

    // Get the list of evaluations from API
    if (state.evaluationsList.length < 1) {
      axios.get(settings.apiUrl + '/evaluations', {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          let evaluationsList: any = []
          res.data.map((evaluation: any, key: number) => {
            evaluation['id'] = evaluation['_id']
            evaluation['score_percent'] = evaluation['score']['percent']
            evaluation['bonus_percent'] = evaluation['score']['bonus_percent']
            evaluationsList.push(evaluation)
          })
          updateState({ evaluationsList: evaluationsList })

        })
    }
  }, [])

  const colors: any = {
    f: '#81d4fa', // blue
    a: '#ffcc80', // orange
    i: '#a5d6a7', // green
    r: '#b39ddb', // purple
    fail: '#ef5350' // red
  }
  const colorsLight: any = {
    f: '#b3e5fc', // blue
    a: '#ffe0b2', // orange
    i: '#c8e6c9', // green
    r: '#d1c4e9', // purple
  }

  const getUrlHtml = (urlString: string) => {
    if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
      // Process URIs
      return <a href={urlString} className={classes.link} target="_blank" rel="noopener noreferrer">{urlString}</a>
    } else {
      return urlString
    }
  }

  const doEvaluateUrl  = (evaluateUrl: string) => {
    updateState({
      evaluationRunning: true,
      evaluationResults: null
    })
    console.log('Starting evaluation of ' + evaluateUrl + ' with API ' + settings.apiUrl)
    const postJson = JSON.stringify({
      "resource_uri": evaluateUrl,
      // "title": "FAIR metrics dataset evaluation",
      "collection": "fair-metrics"
    });
    axios.post(settings.apiUrl + '/evaluations', postJson, {
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => {
        axiosRetry(axios, {
          retries: 30, // number of retries
          retryDelay: (retryCount) => {
            console.log(`Waiting for evaluation to finish: ${retryCount}`);
            return retryCount * 3000; // time interval between retries
          },
          retryCondition: (error: any) => {
            // if retry condition is not specified, by default idempotent requests are retried
            return error.response.status === 404;
          },
        });

        const evalId = res.data['_id']
        // Retry every 3 seconds until the evaluation is available
        axios.get(settings.apiUrl + '/evaluations/' + evalId)
          .then((res: any) => {
            // Redirect to the page of the created evaluation
            history.push("/evaluation/" + evalId);
          })
      })
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    doEvaluateUrl(state.urlToEvaluate)
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


  const columns: GridColumns = [
    { field: '@id', headerName: 'ID', hide: true },
    { 
      field: 'id', headerName: 'Evaluation ID', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <Button href={'/#/evaluation/' + params.value as string}
            variant="contained" 
            className={classes.submitButton} 
            startIcon={<EvaluationIcon />}
            color="primary">
          Evaluation
        </Button>)
    },
    // { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'resource_uri', headerName: 'Resource URI', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
    {
      field: 'score_percent', headerName: 'FAIR compliant', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
        </>)
    },
    {
      field: 'bonus_percent', headerName: 'FAIR Role Model', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
        </>)
    }
  ]
  

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
        ⚖️ Evaluate how FAIR is a resource 🔗
      </Typography>

      {auth && auth.userData &&
        <div>
          <strong>Logged in! 🎉</strong><br />
          <button onClick={() => auth.signOut()}>Log out!</button>
        </div>
      }

      {/* Form to provide the URL to evaludate */}
      <form onSubmit={handleSubmit}>
        <Box display="flex" style={{margin: theme.spacing(0, 6)}}>
          <TextField
            id='urlToEvaluate'
            label='URL of the resource to evaluate'
            placeholder='URL of the resource to evaluate'
            value={state.urlToEvaluate}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            // size='small'
            InputProps={{
              className: classes.formInput
            }}
          />

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
        </Box>

        <Button type="submit" 
          variant="contained" 
          // className={classes.submitButton} 
          style={{margin: theme.spacing(2)}}
          startIcon={<EvaluationIcon />}
          color="secondary" >
            Start the FAIR evaluation
        </Button>
      </form>

      {state.evaluationRunning && 
        <CircularProgress style={{margin: theme.spacing(5, 0)}} />
      }

      {/* Display the Data table listing the Evaluations */}
      {state.evaluationsList.length > 0 && 
        <div style={{ height: 600, width: '100%' }}>
          {console.log(state.evaluationsList)}
          <DataGrid
            columns={columns}
            rows={state.evaluationsList}
            // {...state.evaluationsList}
            components={{
              Toolbar: GridToolbar,
            }}
            style={{backgroundColor: '#fff'}}
          />
        </div>
      }
    </Container>
  )
}

