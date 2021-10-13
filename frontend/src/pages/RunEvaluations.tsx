import React from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { LinearProgress, Accordion, AccordionSummary, AccordionDetails, Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadJsonIcon from '@mui/icons-material/GetApp';
import SettingsIcon from '@mui/icons-material/Settings';
import PassIcon from '@mui/icons-material/CheckCircle';
import FailIcon from '@mui/icons-material/Error';
// import EvaluationIcon from '@mui/icons-material/Send';
// import EvaluationIcon from '@mui/icons-material/PlaylistAddCheck';
import EvaluationIcon from '@mui/icons-material/NetworkCheck';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

import hljs from 'highlight.js/lib/core';
// import hljs from 'highlight.js'; // Too heavy, loading only required languages
import 'highlight.js/styles/github-dark-dimmed.css';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);
hljs.registerLanguage("pythonlogging",function(e){return {
  // Define codeblock highlight for API tests logs ouput 
  // purple: title https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html
  aliases: ['pythonlogging'],
  contains: [
    {className: 'deletion', variants: [{ begin: '^ERROR', end: ':' }]},
    {className: 'built_in', variants: [{ begin: '^WARNING', end: ':' }]},
    {className: 'string', variants: [{ begin: '^INFO', end: ':' }]},
    {className: 'addition', variants: [{ begin: '^SUCCESS', end: ':' }]},
    {className: 'strong', variants: [
        { begin: '^WARNING', end: ':' },
        { begin: '^ERROR', end: ':' },
        { begin: '^SUCCESS', end: ':' },
    ]}
  ]
}});

export default function Evaluation() {
  const theme = useTheme();
  const history = useHistory();

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
    // apiUrl: 'https://fuji-137-120-31-148.sslip.io/fuji/api/v1',
    // apiUrl: 'http://localhost/api',
    apiUrl: 'http://localhost:8888/api',
    urlToEvaluate: "https://doi.org/10.1594/PANGAEA.908011",
    // urlToEvaluate: "https://doi.org/10.1038/sdata.2016.18",
    evaluationResults: evaluationResults,
    adviceLogs: [],
    resourceMetadata: resourceMetadata,
    logLevel: 'all',
    evaluationRunning: false,
    evaluationsList: [],
    metadata_service_type: 'oai_pmh',
    metadata_service_endpoint: 'https://ws.pangaea.de/oai/provider',
    use_datacite: true,
    fairDoughnutConfig: fairDoughnutConfig
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
    if (process.env.API_URL) {
      updateState({ apiUrl: process.env.API_URL })
    }
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    // if (urlToEvaluate) {
    //   updateState({ urlToEvaluate: urlToEvaluate })
    //   doEvaluateUrl(urlToEvaluate)
    // }

    // Get the list of evaluations from API
    if (state.evaluationsList.length < 1) {
      axios.get(state.apiUrl + '/evaluations', {
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
          // console.log("state.evaluationsList")
          // console.log(evaluationsList)
          // console.log(state.evaluationsList)
          // const evaluationsList = res.data
        })
    }
  }, [state.evaluationsList])

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
    console.log('Starting evaluation of ' + evaluateUrl + ' with API ' + state.apiUrl)
    const postJson = JSON.stringify({
      "resource_uri": evaluateUrl,
      "title": "FAIR metrics dataset evaluation",
      "collection": "fair-metrics"
    });
    axios.post(state.apiUrl + '/evaluations', postJson, {
      headers: {'Content-Type': 'application/json'}
    })
      .then(res => {
        const evaluationResults = res.data
        updateState({
          evaluationResults: evaluationResults,
          evaluationRunning: false,
          // fairDoughnutConfig: buildCharts(evaluationResults)
        })
        console.log(evaluationResults);
        let adviceLogs: any = []
        evaluationResults.results.map((evaluation: any, key: number) => {
          evaluation.logs.map((log: any, key: number) => {
            if (log.startsWith('❌') || log.startsWith('ℹ️')) {
              adviceLogs.push(log);
            }
          })
        })
        updateState({adviceLogs: adviceLogs})
        // Check for metadata found in output (core metadata, license)
        // let resourceMetadata = {}
        // evaluationResults.results.map((item: any, key: number) => {
        //   if (item.output.core_metadata_found) {
        //     resourceMetadata = {...resourceMetadata, ...item.output.core_metadata_found}
        //   }
        //   if (Array.isArray(item.output)) {
        //     item.output.map((outputEntry: any, key: number) => {
        //       if (outputEntry.license) {
        //         resourceMetadata = {...resourceMetadata, ...{license: outputEntry.license}}  
        //       }
        //     })
        //   }
        // })
        // updateState({resourceMetadata: resourceMetadata})
        // hljs.highlightAll();

        // Redirect to the page of the created evaluation
        history.push("/evaluation/" + evaluationResults['_id']);
      })
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
  const handleLogLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({'logLevel': event.target.value})
    hljs.highlightAll();
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
      field: 'id', headerName: 'Evaluation ID', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Button href={'/#/evaluation/' + params.value as string}
            variant="contained" 
            className={classes.submitButton} 
            startIcon={<EvaluationIcon />}
            color="primary">
          Evaluation
        </Button>)
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'resource_uri', headerName: 'Resource URI', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
    {
      field: 'score_percent', headerName: 'Score', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
        </>)
    },
    {
      field: 'bonus_percent', headerName: 'Bonus', flex: 1,
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

