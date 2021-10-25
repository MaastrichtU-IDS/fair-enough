import React, { useContext } from 'react';
import { useLocation, useHistory, Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import EvaluationIcon from '@mui/icons-material/Send';
// import EvaluationIcon from '@mui/icons-material/PlaylistAddCheck';
import EvaluationIcon from '@mui/icons-material/NetworkCheck';
import UserContext from '../UserContext';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import axiosRetry from 'axios-retry';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { settings } from '../settings'
// import { useAuth } from 'oidc-react';

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

  const { user }: any = useContext(UserContext);

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
    collectionsList: [],
    collectionSelected: 'fair-metrics',
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
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    // if (urlToEvaluate) {
    //   updateState({ urlToEvaluate: urlToEvaluate })
    //   doEvaluateUrl(urlToEvaluate)
    // }
    if (state.collectionsList.length < 1) {
      axios.get(settings.restUrl + '/collections', {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          let collectionsList: any = []
          res.data.map((collec: any, key: number) => {
            collec['id'] = collec['_id']
            collectionsList.push(collec)
          })
          updateState({ collectionsList: collectionsList })
        })
    }

    // Get the list of evaluations from API
    if (state.evaluationsList.length < 1) {
      axios.get(settings.restUrl + '/evaluations', {
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
    console.log('Starting evaluation of ' + evaluateUrl + ' with API ' + settings.docsUrl)
    const postJson: any = {
      "resource_uri": evaluateUrl,
      // "title": "FAIR metrics dataset evaluation",
      "collection": state.collectionSelected
    };
    console.log(user)
    // Getting User access_token from context set by NavBar
    let headers: any = {'Content-Type': 'application/json'}
    if (user && user['access_token']) {
      headers['Authorization'] = 'Bearer ' + user['access_token']
    }
    axios.post(settings.restUrl + '/evaluations', JSON.stringify(postJson), 
      { headers: headers }
    )
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
        axios.get(settings.restUrl + '/evaluations/' + evalId)
          .then((res: any) => {
            // Redirect to the page of the created evaluation
            history.push("/evaluation/" + evalId);
          })
      })
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    console.log('user from context')
    console.log(user)
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

  const handleCollectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({'collectionSelected': event.target.value})
    // hljs.highlightAll();
  }

  const columns: GridColumns = [
    { field: '@id', headerName: 'ID', hide: true },
    { 
      field: 'id', headerName: 'Access evaluation', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <Link to={'/evaluation/' + params.value as string}>
          <Button variant="contained" 
              className={classes.submitButton} 
              startIcon={<EvaluationIcon />}
              color="primary">
            Evaluation
          </Button>
        </Link>)
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
      field: 'collection', headerName: 'Collection', flex: 0.4,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Link to={'/collection/' + params.value as string} style={{textDecoration: 'none', color: theme.palette.primary.main}}>
            {params.value as string}
          </Link>
        </>)
    },
    {
      field: 'score_percent', headerName: 'FAIR score', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
        </>)
    },
    {
      field: 'bonus_percent', headerName: 'Bonus score', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
        </>)
    },
    {
      field: 'created', headerName: 'Date created', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}
        </>)
    },
    {
      field: 'author', headerName: 'Author', flex: 0.6,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    }
  ]
  
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'created',
      sort: 'desc',
    },
  ]);

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
        ⚖️ Evaluate how FAIR is a resource 🔗
      </Typography>

      {/* {auth && auth.userData &&
        <div>
          <strong>Logged in! 🎉</strong><br />
          <button onClick={() => auth.signOut()}>Log out!</button>
        </div>
      } */}

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
          {/* Log level dropdown select */}
          <TextField select
              value={state.collectionSelected} 
              label={"Using the collection"} 
              id="collectionSelected" 
              onChange={handleCollectionChange} 
              style={{margin: theme.spacing(0, 2), backgroundColor: 'white'}}
              variant="outlined"> 
            { state.collectionsList.map((collec: any, key: number) => (
              <MenuItem value={collec.id}>{collec.title} ({collec.id})</MenuItem>
            ))}
          </TextField>

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
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(4)}}
          startIcon={<EvaluationIcon />}
          color="secondary" >
            Start the evaluation
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
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            style={{backgroundColor: '#fff'}}
          />
        </div>
      }
    </Container>
  )
}

