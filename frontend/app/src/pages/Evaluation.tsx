import React from 'react';
import { useLocation, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
// import { useParams } from 'react-router';
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
// import { makeStyles, useTheme, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem } from "@mui/material";
import { LinearProgress, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadJsonIcon from '@mui/icons-material/GetApp';
import PassIcon from '@mui/icons-material/CheckCircle';
import FailIcon from '@mui/icons-material/Error';
import axios from 'axios';
import {settings} from '../settings'

import hljs from 'highlight.js/lib/core';
// // import hljs from 'highlight.js'; // Too heavy, loading only required languages
import 'highlight.js/styles/github-dark-dimmed.css';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('json', json);
// Custom codeblocks highlight 
hljs.registerLanguage("pythonlogging",function(e){return {
  // Define codeblock highlight for API tests logs ouput 
  // purple: title https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html
  aliases: ['pythonlogging'],
  contains: [
    {className: 'deletion', variants: [{ begin: '^FAILURE', end: ':' }]},
    {className: 'built_in', variants: [{ begin: '^WARN', end: ':' }]},
    {className: 'string', variants: [{ begin: '^INFO', end: ':' }]},
    {className: 'addition', variants: [{ begin: '^SUCCESS', end: ':' }]},
    {className: 'strong', variants: [
        { begin: '^WARN', end: ':' },
        { begin: '^FAILURE', end: ':' },
        { begin: '^SUCCESS', end: ':' },
    ]}
  ]
}});


export default function Evaluation() {
  const theme = useTheme();

  const useStyles = makeStyles(() => ({
    link: {
      color: theme.palette.primary.dark,
      textDecoration: 'none',
      // color: 'inherit',
      '&:hover': {
        color: theme.palette.primary.main,
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
  let evaluationResults: any = null;
  let resourceMetadata: any = null;
  let metricsTestsMap: any = null;
  let evalArray: any = null;
  const [state, setState] = React.useState({
    evaluationResults: evaluationResults,
    metricsTestsMap: metricsTestsMap,
    evalArray: evalArray,
    adviceLogs: [],
    logLevel: 'warning',
    resourceMetadata: resourceMetadata,
    loading: true,
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
    axios.get(settings.restUrl + '/evaluations/' + evalParams.id, {
      headers: {'Content-Type': 'application/json'},
    })
      .then((res: any) => {
        const evalResults = res.data
        console.log(evalResults);
        const metricsResults = evalResults['contains'];
        // console.log('metricsResults', metricsResults);
        const evalArray: any = []
        Object.keys(metricsResults).map((metricTest: any) => {
          if (metricTest !== 'summary' && metricTest !== '_id' && metricTest !== '@id') {
            // const metricWithUrl: any = {'results': metricsResults[metricTest]}
            const metricRes: any = {'metrics_test_url': metricTest}

            try {
              metricRes['score'] = metricsResults[metricTest][0]['http://semanticscience.org/resource/SIO_000300'][0]['@value']
            } catch (e) {
              metricRes['score'] = 0
            }
            try {
              metricRes['subject'] = metricsResults[metricTest][0]['http://semanticscience.org/resource/SIO_000332'][0]['@id']
            } catch (e) {
              metricRes['subject'] = 'Not provided'
            }
            try {
              metricRes['version'] = metricsResults[metricTest][0]['http://schema.org/softwareVersion'][0]['@value']
            } catch (e) {
              metricRes['version'] = 'not provided'
            }
            try {
              metricRes['test_url'] = metricsResults[metricTest][0]['@id']
            } catch (e) {
              metricRes['test_url'] = 'not provided'
            }
            try {
              metricRes['comment'] = metricsResults[metricTest][0]['http://schema.org/comment'][0]['@value']
            } catch (e) {
              metricRes['comment'] = 'FAILURE: The metric test endpoint did not returned anything'
            }
            evalArray.push(metricRes)
          }
        })
        updateState({ 
          evaluationResults: evalResults, 
          evalArray: evalArray,
        })

        axios.get(settings.restUrl + '/metrics')
          .then((res: any) => {
            const metricsTestsMap: any = {};
            const metricsTestsArray: any = []
            res.data.map((test: any) => {
              metricsTestsMap[test['_id']] = test
              metricsTestsArray.push(test)
            })
            updateState({ 
              metricsTestsMap: metricsTestsMap, metricsTestsArray: metricsTestsArray,
              loading: false
            })
          })

        setTimeout(function(){
          hljs.highlightAll();
        }, 500);
      })


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

  // const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   // Set the TextField input to the state variable corresponding to the field id  
  //   updateState({[event.target.id]: event.target.value})
  // }

  const handleLogLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({'logLevel': event.target.value})
    setTimeout(function(){
      hljs.highlightAll();
    }, 500);
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
    } else if (state.logLevel == 'success') {
      return (log.startsWith('SUCCESS:') || log.startsWith('FAILURE:'))
    } else if (state.logLevel == 'warning') {
      return (log.startsWith('SUCCESS:') || log.startsWith('FAILURE:') || log.startsWith('WARN:') || log.startsWith('ℹ️'))
    }
  }

  const getBadgeMaturity  = (maturity: number) => {
    if (maturity == 1) {
      // return <Chip label={maturity + '/1'} style={{backgroundColor: colors.i}}/> // green
      return <PassIcon color='success' />
    } else {
      // return <Chip label={maturity + '/1'} style={{backgroundColor: colors.fail}}/> // red
      return <FailIcon color='error' />
    }
  }
  

  const getResultsForCategory  = (category: string) => {
    const emojiMap: any = { 'f': '🔍️', 'a': '📬️', 'i': '⚙️', 'r': '♻️' }
    const charCategory = category.substring(0, 1).toLowerCase();
    console.log('state.evalArray', state.evalArray)
    const filteredResults = state.evalArray
      .filter((item: any) => {
        let filterItem = false
        if (state.metricsTestsMap[item['metrics_test_url']]['info']['x-applies_to_principle'].toLowerCase().startsWith(charCategory)) {
          filterItem = true
          // Don't show the test if all logs are filtered out
          // item.logs.map((log: string, key: number) => {
          //   if (filterLog(log) == true) {
          //     filterItem = true
          //   }
          // })
        }
        return filterItem
      })
    console.log('filteredResults!!', filteredResults);
    return <>
    { filteredResults.length > 0 &&
      <Accordion key={category} defaultExpanded={true}
          style={{backgroundColor: colorsLight[charCategory]}}
          >
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
                  <Accordion defaultExpanded={item['score'] == 0 ? true : false}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {/* {getBadgeTestStatus(item.test_status)}&nbsp; */}
                      {/* {getBadgeMaturity(item['results'][0]['http://semanticscience.org/resource/SIO_000300'][0]['@value'])}&nbsp; */}
                      <Typography variant="h6" style={{display: 'inline-flex',alignItems: 'center'}}>
                        {getBadgeMaturity(item['score'])}&nbsp;
                        {state.metricsTestsMap[item.metrics_test_url]['info']['x-applies_to_principle']} - {state.metricsTestsMap[item.metrics_test_url]['info']['title']}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container style={{textAlign: 'left'}}>
                        <Grid item xs={12} md={12}>
                          <>
                            <Typography variant="body1" style={{marginBottom: theme.spacing(1)}}>
                              <a href={item.metrics_test_url} className={classes.link} target="_blank" rel="noopener noreferrer">{item.metrics_test_url}</a>
                              &nbsp;- Version: <i>{item['version']}</i>
                              &nbsp;- {state.metricsTestsMap[item.metrics_test_url]['info']['description']}
                            </Typography>
                            {/* <Typography variant="body1" style={{marginBottom: theme.spacing(1)}}>
                              Test version: {item['results'][0]['http://schema.org/softwareVersion'][0]['@value']}
                            </Typography> */}
                            <Typography variant="body1">
                              Test result URL: <a href={item['test_url']} className={classes.link} target="_blank" rel="noopener noreferrer">
                                {item['test_url']}
                              </a>
                              {/* style={{textDecoration: 'none'}} */}
                            </Typography>
                          </>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <pre>
                            <code className="language-pythonlogging" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
                              {/* {item[0]['http://schema.org/comment'][0]['@value'].replace(/\n\n/g, '\n')} */}
                              {item['comment'].split("\n\n")
                              .filter((log: string) => {
                                return filterLog(log)
                              }).join("\n")}
                            </code>
                          </pre>
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

  return(
    <Container className='mainContainer'>

      {state.loading && 
        <CircularProgress style={{marginTop: theme.spacing(10)}} />
      }

      {state.evaluationResults && state.metricsTestsMap &&
        // Display results from the JSON from the API
        <>
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify(state.evaluationResults)}
            </script>
          </Helmet>
          <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
            {getUrlHtml(state.evaluationResults['subject'])}
          </Typography>
          {state.evaluationResults['@id'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
              Identifier of this evaluation: {getUrlHtml(state.evaluationResults['@id'])}
            </Typography>
          }
          {state.evaluationResults['created_at'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
              Evaluated with the <Link to={'/collections/' + state.evaluationResults.collection} style={{color: theme.palette.primary.main, textDecoration: 'none'}}>{state.evaluationResults.collection}</Link> collection on the {state.evaluationResults['created_at'].substring(0, state.evaluationResults['created_at'].indexOf('T'))}
            </Typography>
          }
          {state.evaluationResults['author'] &&
            <Typography variant="body1" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
              By {getUrlHtml(state.evaluationResults['author'])}
            </Typography>
          }

          <Grid container spacing={1}>
            <Grid item xs={3} md={3}></Grid>
            <Grid item xs={6} md={6}>
              <Typography variant="h5" style={{margin: theme.spacing(2, 0)}}>
                🎓️ Evaluation score: {state.evaluationResults['score']}/{state.evaluationResults['score_max']}
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={state.evaluationResults['score_percent']}/>
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
                    {`${state.evaluationResults['score_percent']}%`}<br/>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Log level dropdown select */}
          <Box style={{alignItems: 'center', marginTop: theme.spacing(3)}}>
            <TextField select
                value={state.logLevel} 
                label={"Log level"} 
                id="logLevel" 
                style={{backgroundColor: 'white', 
                  marginRight: theme.spacing(2),
                  marginBottom: theme.spacing(1)
                }}
                onChange={handleLogLevelChange} 
                variant="outlined"> 
              <MenuItem key='success' value={'success'}>Only success and failures</MenuItem>
              <MenuItem key='warning' value={'warning'}>Success, warnings and failures</MenuItem>
              <MenuItem key='all' value={'all'}>All logs</MenuItem>
            </TextField>
            {/* <Tooltip
              title={<Typography>✅ Indicates a successful test, +1 to the FAIR score<br/>
                  🚀 Indicates a successful non-mandatory test, +1 to the bonus score<br/>
                  ❌ Indicates a failed test<br/>
                  ⚠️ Indicates a warning from a test<br/>
                  🔎 Gives informations on the test performed<br/>
                </Typography>}>
              <HelpIcon />
            </Tooltip> */}
          </Box>

          {/* Display results per category */}
          {getResultsForCategory('Findable')}
          {getResultsForCategory('Accessible')}
          {getResultsForCategory('Interoperable')}
          {getResultsForCategory('Reusable')}
            
          {/* { state.evaluationResults &&
          <>
            <Divider variant="middle" style={{margin: theme.spacing(6, 0)}}/>
            <Accordion defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h4">
                  📋️ Evaluation output
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{textAlign: 'left'}}>
                <Typography>
                  All metadata found:
                </Typography>
                <pre>
                  <code className="language-json" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
                    {JSON.stringify(state.evaluationResults.data, null, 2)}
                  </code>
                </pre>
                <Typography>
                  Main RDF metadata retrieved:
                </Typography>
                <pre>
                  <code className="language-json" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
                    {state.evaluationResults.data['main_rdf_metadata']}
                  </code>
                </pre>
              </AccordionDetails>
            </Accordion>
          </>} */}
          
          <Button
            variant="contained" 
            style={{textTransform: 'none', margin: theme.spacing(2, 2)}}
            onClick={downloadEvaluation}
            startIcon={<DownloadJsonIcon />}>
              Download the evaluation results JSON file
          </Button>


        </>
      }

    </Container>
  )
}
