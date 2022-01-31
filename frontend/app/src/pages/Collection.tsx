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
import ArrowIcon from '@mui/icons-material/ArrowForward';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

import {settings, getUrlHtml} from '../settings'


export default function Collection() {
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
  // const { id } = useParams();
  const evalParams: any = useParams();
  // useLocation hook to get URL params
  let location = useLocation();  
  let collectionResults: any = null;
  let assessmentsDict: any = {};
  const [state, setState] = React.useState({
    collectionResults: collectionResults,
    adviceLogs: [],
    // logLevel: 'all',
    assessmentsDict: assessmentsDict,
    resourceMetadata: null,
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  // Run on page init
  React.useEffect(() => {
    // get evaluations
    axios.get(settings.restUrl + '/collections/' + evalParams.id, {
      headers: {'Content-Type': 'application/json'},
    })
      .then((res: any) => {
        const evalResults = res.data;
        updateState({ collectionResults: res.data })
      })

    
    // Get the list of assessments from API
    if (Object.keys(state.assessmentsDict).length < 1) {
      axios.get(settings.restUrl + '/metrics', {
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
          let assessmentsDict: any = {}
          res.data.map((assess: any, key: number) => {
            console.log(assess);
            assessmentsDict[assess['id']] = assess
          })
          console.log(assessmentsDict)
          updateState({ assessmentsDict: assessmentsDict })

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

  // const getUrlHtml = (urlString: string) => {
  //   if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
  //     // Process URIs
  //     return <a href={urlString} className={classes.link} target="_blank" rel="noopener noreferrer">{urlString}</a>
  //   } else {
  //     return urlString
  //   }
  // }

  const handleLogLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({'logLevel': event.target.value})
    // hljs.highlightAll();
  }
  const downloadJson  = (event: React.FormEvent) => {
    event.preventDefault();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.collectionResults, null, 4)));
    element.setAttribute('download', 'evaluation.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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

  return(
    <Container className='mainContainer'>

      {state.collectionResults &&
        // Display results from the JSON from the API
        <>
          <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
            {state.collectionResults['title']} [{state.collectionResults['_id']}]
          </Typography>
          <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
            {state.collectionResults['description']}
          </Typography>
          {state.collectionResults['homepage'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
              Homepage: {getUrlHtml(state.collectionResults['homepage'])}
            </Typography>
          }
          {state.collectionResults['author'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
              Author: {getUrlHtml(state.collectionResults['author'])}
            </Typography>
          }
          {state.collectionResults['created'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
              Collection created on the {state.collectionResults['created']}
            </Typography>
          }

          <Typography variant="h5" style={{textAlign: 'center', marginBottom: theme.spacing(2)}}>
            Contains assessments:
          </Typography>
          <Grid container spacing={1}>
            { state.collectionResults['assessments']
              .map((item: any, key: number) => (
                <Grid item xs={4} display="flex" key={key} style={{alignItems: 'center'}} >
                  <ArrowIcon />
                  {/* <div onClick={() => removeAssessment(item.id)}> */}
                    {/* <Tooltip title='Click to remove this assessment from your collection'> */}
                      <Paper elevation={4} className={classes.paperPadding} style={{textAlign: 'left'}}>
                        { state.assessmentsDict[item] && 
                          <>
                            <Box display='flex' style={{alignItems: 'center'}}>
                              {getBadgeFair(state.assessmentsDict[item]['fair_type'], state.assessmentsDict[item]['metric_id'])}&nbsp;
                              <Typography variant='body1'>
                                <a href={state.assessmentsDict[item]['file_url']} target="_blank" 
                                    rel="noopener noreferrer" style={{color: theme.palette.primary.main, textDecoration: 'none'}}>
                                  {state.assessmentsDict[item]['title']}
                                </a>
                              </Typography>
                            </Box>
                            <Typography variant='body2'>
                              {state.assessmentsDict[item]['description']}
                            </Typography>
                            <Typography variant='body2'>
                              Max score: {state.assessmentsDict[item]['max_score']} | Max bonus: {state.assessmentsDict[item]['max_bonus']}
                            </Typography>
                          </>
                        }
                        { !state.assessmentsDict[item] && 
                          <Typography>
                            {item}
                          </Typography>
                        }
                      </Paper>
                    {/* </Tooltip> */}
                  {/* </div> */}
                </Grid>
              ))
              // .join(<ArrowIcon />)
            }
          </Grid>
          
          <Button
            variant="contained" 
            style={{textTransform: 'none', margin: theme.spacing(2, 2)}}
            onClick={downloadJson}
            startIcon={<DownloadJsonIcon />}>
              Download the Collection as JSON-LD
          </Button>

        </>
      }

    </Container>
  )
}


// Custom codeblocks highlight 
// import hljs from 'highlight.js/lib/core';
// // import hljs from 'highlight.js'; // Too heavy, loading only required languages
// import 'highlight.js/styles/github-dark-dimmed.css';
// import json from 'highlight.js/lib/languages/json';
// hljs.registerLanguage('json', json);
// hljs.registerLanguage("pythonlogging",function(e){return {
//   // Define codeblock highlight for API tests logs ouput 
//   // purple: title https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html
//   aliases: ['pythonlogging'],
//   contains: [
//     {className: 'deletion', variants: [{ begin: '^ERROR', end: ':' }]},
//     {className: 'built_in', variants: [{ begin: '^WARNING', end: ':' }]},
//     {className: 'string', variants: [{ begin: '^INFO', end: ':' }]},
//     {className: 'addition', variants: [{ begin: '^SUCCESS', end: ':' }]},
//     {className: 'strong', variants: [
//         { begin: '^WARNING', end: ':' },
//         { begin: '^ERROR', end: ':' },
//         { begin: '^SUCCESS', end: ':' },
//     ]}
//   ]
// }});