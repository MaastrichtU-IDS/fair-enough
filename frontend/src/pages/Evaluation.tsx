import React from 'react';
import { useLocation, useParams } from "react-router-dom";
// import { useParams } from 'react-router';
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
// import { makeStyles, useTheme, withStyles } from '@mui/styles';
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

  const classes = useStyles(theme);
  const { id } = useParams();
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
  // const id = open ? 'simple-popper' : undefined;
  

  // Run on page init
  React.useEffect(() => {
    // Get the edit URL param if provided
    const params = new URLSearchParams(location.search + location.hash);
    let urlToEvaluate = params.get('evaluate');
    if (process.env.API_URL) {
      updateState({ apiUrl: process.env.API_URL })
    }
    if (urlToEvaluate) {
      updateState({ urlToEvaluate: urlToEvaluate })
      doEvaluateUrl(urlToEvaluate)
    }
    // get evaluation
    if (state.evaluationsList.length < 1) {
      axios.get(state.apiUrl + '/evaluations/' + id, {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          console.log(res.data)
          let evaluationsList: any = []
          // res.data.map((evaluation: any, key: number) => {
          //   evaluation['id'] = evaluation['_id']
          //   evaluation['score_percent'] = evaluation['score']['percent']
          //   evaluation['bonus_percent'] = evaluation['score']['bonus_percent']
          //   evaluationsList.push(evaluation)
          // })
          updateState({ evaluationResults: res.data })
          hljs.highlightAll();
          // console.log("state.evaluationsList")
          // console.log(evaluationsList)
          // console.log(state.evaluationsList)
          // const evaluationsList = res.data
        })
    }
  }, [state.evaluationsList])
  // }, [state.apiUrl, state.evaluationRunning])

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
      headers: {'Content-Type': 'application/json'},
      // crossDomain: true
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
        hljs.highlightAll();
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
  const downloadEvaluation  = (event: React.FormEvent) => {
    event.preventDefault();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.evaluationResults, null, 4)));
    element.setAttribute('download', 'evaluation.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const filterLog = (log: string) => {
    if (state.logLevel == 'all') {
      return true
    } else if (state.logLevel == 'warning') {
      return (log.startsWith('❌') || log.startsWith('⚠️') || log.startsWith('ℹ️'))
    } else if (state.logLevel == 'error') {
      return (log.startsWith('❌') || log.startsWith('ℹ️'))
    }
  }

  const getBadgeTestStatus  = (status: string) => {
    if (status == 'pass') {
      return <PassIcon color='secondary' fontSize='large'/>
    } else if (status == 'fail') {
      return <FailIcon style={{color: colors.fail}} fontSize='large'/>
    }
    return <Chip label={status} color='primary'/>
  }
  const getBadgeMaturity  = (maturity: number) => {
    if (maturity == 3) {
      return <Chip label={maturity + '/3'} color='primary'/> // blue
    } else if (maturity == 2) {
      return <Chip label={maturity + '/3'} style={{backgroundColor: colors.r}}/> // purple
    } else if (maturity == 1) {
      return <Chip label={maturity + '/3'} style={{backgroundColor: colors.a}}/> // orange
    } else if (maturity == 0) {
      return <Chip label={maturity + '/3'} style={{backgroundColor: colors.fail}}/> // red
    }
    return <Chip label={maturity + '/3'}/>
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

  // const { data } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 6,
  // });

  // const { data } = {
  //   columns: [
  //     {
  //       field: "id",​​​
  //       headerName: "ID",
  //       width: 110
  //     },
  //     {
  //       field: "title",​​​
  //       headerName: "Title",
  //       width: 110
  //     }
  //   ],
  //   rows: state.evaluationsList
  //   // dataSet: 'Commodity',
  //   // rowLength: 100,
  //   // maxColumns: 6,
  // };

  const columns: GridColumns = [
    { field: '@id', headerName: 'ID', hide: true },
    { 
      field: 'id', headerName: 'Evaluation ID', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Button href={'/evaluation/' + params.value as string}
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
  

  const getResultsForCategory  = (category: string) => {
    const emojiMap: any = {
      'f': '🔍️',
      'a': '📬️',
      'i': '⚙️',
      'r': '♻️'
    }
    const charCategory = category.substring(0, 1).toLowerCase();
    // const fairScore = state.evaluationResults['score']['percent'][charCategory]
    // console.log(state.evaluationResults.results);
    // console.log(category);
    // console.log(charCategory);

    const filteredResults = state.evaluationResults.results
      .filter((item: any) => {
        let filterItem = false
        if (item.fair_type.startsWith(charCategory)) {
          // Don't show the test if all logs are filtered out
          item.logs.map((log: string, key: number) => {
            if (filterLog(log) == true) {
              filterItem = true
            }
          })
        }
        return filterItem
      })

    // return <Accordion key={category} defaultExpanded={fairScore < 100}
    return <>
    {filteredResults.length > 0 &&
      <Accordion defaultExpanded={true}
        // <Accordion key={category} defaultExpanded={true}
          style={{backgroundColor: colorsLight[charCategory]}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">
            {emojiMap[charCategory]} {category}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={1} style={{textAlign: 'left'}}>
          {
            // Iterate over the evaluation results to show the different metrics tests, output and debug log
            filteredResults.map((item: any, key: number) => (
                <Grid item xs={12} md={12} key={key}>
                  <Accordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {/* {getBadgeTestStatus(item.test_status)}&nbsp;
                      {getBadgeMaturity(item.maturity)}&nbsp; */}
                      <Typography variant="h6">
                        {item.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1} style={{textAlign: 'left'}}>
                        <Grid item xs={12} md={12}>
                          <>
                            <Typography variant="body1">
                              {item.description}
                            </Typography>
                            <Typography variant="body1">
                              Metric: {item.fair_type.toUpperCase()}{item.metric_id}
                            </Typography>
                            <Typography variant="body1">
                              Assessment URL: {getUrlHtml(item.file_url)}
                            </Typography>
                            <Typography variant="body1">
                              FAIR score: {item.score}/{item.max_score}
                            </Typography>
                            { item.bonus_score > 0 || item.max_bonus > 0 &&
                              <Typography variant="body1">
                                Bonus score: {item.bonus_score}/{item.max_bonus}
                              </Typography>
                            }
                          </>
                        </Grid>

                        <Grid item xs={12} md={12}>
                          {/* {state.adviceLogs.join("\n").length > 0 && */}
                          <pre>
                            <code className="language-pythonlogging" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
                              {item.logs.filter((log: string) => {
                                return filterLog(log)
                              }).join("\n")}
                            </code>
                          </pre>
                          {/* <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="h6">
                                Tests logs
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {console.log(item.logs)}
                              <pre>
                                <code className="language-pythonlogging" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
                                  {item.logs.join("\n")}
                                </code>
                              </pre>
                            </AccordionDetails>
                          </Accordion> */}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))
          }
          </Grid>
        </AccordionDetails>
      </Accordion>
    }
    </>
  }

  // const skipMetadataArray = ['title', 'summary']

  return(
    <Container className='mainContainer'>

      {state.evaluationResults &&
        // Display results from the JSON from the API
        <>
          <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            {state.evaluationResults['resource_uri']}
          </Typography>
          {/* {state.resourceMetadata &&
            // Display resources metadata if found
            <>
              <Typography variant="h4" style={{margin: theme.spacing(3, 0), textAlign: 'center'}}>Metadata found</Typography>
              <Paper className={classes.paperPadding} style={{textAlign: 'left'}}>
                {state.resourceMetadata.title &&
                  <Typography variant="h5" style={{marginBottom: theme.spacing(1)}}>
                    <b>title</b>: {state.resourceMetadata.title}
                  </Typography>
                }
                {state.resourceMetadata.summary &&
                  <Typography variant="body1" style={{marginBottom: theme.spacing(1)}}>
                    <b>summary</b>: {state.resourceMetadata.summary}
                  </Typography>
                }
                {
                  Object.keys(state.resourceMetadata).map((metadata: any, key: number) => {
                    if (!skipMetadataArray.includes(metadata)) {
                      return <Typography variant="body1" style={{marginBottom: theme.spacing(1)}} key={key}>
                          <b>{metadata}</b>: {getUrlHtml(state.resourceMetadata[metadata])}
                        </Typography>
                    }
                  })
                }
              </Paper>
            </>
          } */}

          {/* <Typography variant="h4" style={{margin: theme.spacing(3, 0)}}>
            FAIR score: {state.evaluationResults['score']['percent']} ({state.evaluationResults['score']['total_score']}/{state.evaluationResults['score']['total_score_max']})
          </Typography> */}

          <Grid container spacing={1}>
            <Grid item xs={3} md={3}></Grid>
            <Grid item xs={3} md={3}>
              <Typography variant="h5" style={{margin: theme.spacing(3, 0)}}>
                FAIR score: {state.evaluationResults['score']['total_score']}/{state.evaluationResults['score']['total_score_max']}
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={state.evaluationResults['score']['percent']}/>
                {/* <CircularProgress variant="determinate" value={60} size='50%'/> */}
                <Box
                  sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div">
                    {`${state.evaluationResults['score']['percent']}%`}<br/>
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={3} md={3}>
              <Typography variant="h5" style={{margin: theme.spacing(3, 0)}}>
                Bonus score: {state.evaluationResults['score']['total_bonus']}/{state.evaluationResults['score']['total_bonus_max']}
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={state.evaluationResults['score']['bonus_percent']}/>
                <Box
                  sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div">
                    {`${state.evaluationResults['score']['bonus_percent']}%`}<br/>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* <InputLabel id="logLevel-select-label">Log level</InputLabel> */}
          <Select
            // labelId="logLevel-select-label"
            id="logLevel"
            variant="outlined"
            value={state.logLevel}
            label="Log level"
            onChange={handleLogLevelChange}
            style={{margin: theme.spacing(2, 0)}}
          >
            <MenuItem value={'all'}>All logs</MenuItem>
            <MenuItem value={'warning'}>Warnings and errors</MenuItem>
            <MenuItem value={'error'}>Errors only</MenuItem>
          </Select>

          {getResultsForCategory('Findable')}
          {getResultsForCategory('Accessible')}
          {getResultsForCategory('Interoperable')}
          {getResultsForCategory('Reusable')}
          
          <Button
            variant="contained" 
            className={classes.submitButton} 
            onClick={downloadEvaluation}
            startIcon={<DownloadJsonIcon />}>
              Download the evaluation results JSON file
          </Button>


        </>
      }

      {state.evaluationRunning && 
        <CircularProgress style={{marginTop: theme.spacing(5)}} />
      }

      {state.evaluationsList.length > 0 && 
        <div style={{ height: 400, width: '100%' }}>
          {console.log(state.evaluationsList)}
          <DataGrid
            columns={columns}
            rows={state.evaluationsList}
            // {...state.evaluationsList}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      }
    </Container>
  )
}

