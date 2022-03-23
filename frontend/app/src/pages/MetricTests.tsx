import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Typography, Container, Button, CardContent, Card, Paper, Box, Tooltip, TextField, CircularProgress, Grid } from "@mui/material";
import RegistrationIcon from '@mui/icons-material/AddLocationAlt';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';


import axios from 'axios';
// import axiosRetry from 'axios-retry';
import { settings } from '../settings'

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

export default function MetricTests() {
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
  const classes = useStyles();

  const [state, setState] = React.useState({
    assessmentsList: [],
    urlToRegister: '',
    testRegistered: '',
    loading: false,
    openSuccess: 'none',
    openError: 'none',
    errorMessage: '',
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  // Run on page init
  React.useEffect(() => {
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    // if (urlToEvaluate) {
    //   updateState({ urlToEvaluate: urlToEvaluate })
    //   doEvaluateUrl(urlToEvaluate)
    // }
    hljs.highlightAll();

    // Get the list of collections from API
    if (state.assessmentsList.length < 1) {
      axios.get(settings.restUrl + '/metrics', {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          console.log(res.data)
          let assessmentsList: any = []
          res.data.map((collec: any, key: number) => {
            // collec['id'] = collec['file_url']
            collec['id'] = collec['_id']
            // collec['fair_metric'] = collec['fair_type'].toUpperCase() + collec['metric_id'] + ' (' + collec['role'] + ')'
            collec['fair_metric'] = collec['info']['x-applies_to_principle']
            collec['title'] = collec['info']['title']
            collec['author'] = collec['info']['contact']['x-id']
            // collec['bonus_percent'] = evaluation['score']['bonus_percent']
            assessmentsList.push(collec)
          })
          console.log(assessmentsList)
          updateState({ assessmentsList: assessmentsList })

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

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    updateState({
      loading: true,
      openError: 'none',
      openSuccess: 'none',
      errorMessage: ''
    })
    // doEvaluateUrl(state.urlToRegister)
    axios.post(settings.restUrl + '/metrics', 
      {'url': state.urlToRegister}, 
      {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + user['access_token']
        },
      }
    )
      .then((res: any) => {
        console.log('New metric test ' + state.urlToRegister + ' successfully registered.')
        if (res.data.errorMessage) {
          updateState({
            loading: false,
            openError: 'inline', 
            openSuccess: 'none',
            errorMessage: res.data.errorMessage})
        } else {
          updateState({openSuccess: 'inline', openError: 'none', loading: false})
          // setTimeout(function(){
          //   history.push("/dsri-documentation/docs/");
          // }, 6000);
        }
      })
      .catch(function (error) {
        updateState({
          openSuccess: 'none', 
          openError: 'inline', 
          loading: false,
          errorMessage: 'Error when registering the metric test, please retry.'
        })
        if (error.response) {
          // Request made and server responded
          // {"detail":[{"loc":["body","homepage"],"msg":"invalid or missing URL scheme","type":"value_error.url.scheme"}]}
          if (error.response.data["detail"]) {
            updateState({ errorMessage: 'Error: ' + JSON.stringify(error.response.data["detail"])})
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
      })
  }

  const columns: GridColumns = [
    // { field: 'id', headerName: 'ID', hide: false },
    // { 
    //   field: '_id', headerName: 'Access test', flex: 0.5,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Button variant="contained" target="_blank" rel="noopener noreferrer"
    //         href={params.value as string}
    //         className={classes.submitButton} 
    //         // startIcon={<CollectionIcon />}
    //         style={{textTransform: 'none'}}
    //         color="primary">
    //       {params.value as string}.py
    //     </Button>
    //     )
    // },
    { field: 'fair_metric', headerName: 'FAIR metric', flex: 0.3 },
    { 
      field: '_id', headerName: 'Test URL', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
          <a href={params.value as string} className={classes.link} target="_blank" rel="noopener noreferrer">
            {params.value as string}
          </a>
        )
    },
    { field: 'title', headerName: 'Title', flex: 0.9 },
    {
      field: 'author', headerName: 'Author', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
  ]
  
  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'fair_metric',
      sort: 'asc',
    },
  ]);

  return(
    <Container className='mainContainer' style={{textAlign: 'center'}}>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(4)}}>
        Metrics Tests
      </Typography>

      <form onSubmit={handleSubmit}>
        <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(0, 0)}}>
          You can register a Metric Test API URL that follows the standard described by the <a href='https://github.com/FAIRMetrics/Metrics' target="_blank" rel="noopener noreferrer" className={classes.link}>FAIRMetrics working group</a>, this will allow FAIR enough users to add this test to collections, and use it in evaluations:
        </Typography>
        <Typography variant="body1" style={{textAlign: 'left', marginBottom: theme.spacing(2), marginTop: theme.spacing(1)}}>
          An example and instructions to quickly build and publish an API exposing metrics tests written with python is available 
          in the <a href='https://github.com/MaastrichtU-IDS/fair-enough-metrics' target="_blank" rel="noopener noreferrer" className={classes.link}>fair-enough-metrics GitHub repository</a>.
        </Typography>

        <Box display="flex" style={{margin: theme.spacing(2, 0)}}>
          <TextField
            id='urlToRegister'
            label='URL of the Metric Test to register'
            placeholder='URL of the Metric Test to register'
            value={state.urlToRegister}
            className={classes.fullWidth}
            variant="outlined"
            onChange={handleTextFieldChange}
            // size='small'
            InputProps={{
              className: classes.formInput
            }}
          />
          
          <Button type="submit" 
            variant="contained" 
            // className={classes.submitButton} 
            style={{marginLeft: theme.spacing(2), textTransform: 'none'}}
            startIcon={<RegistrationIcon />}
            color="secondary" >
              Register a new Metric Test
          </Button>

        </Box>

      </form>

      <Box style={{margin: theme.spacing(4, 0)}}>
        {state.loading && 
          <CircularProgress style={{marginTop: '20px'}} />
        }
        <Paper elevation={4} 
            style={{backgroundColor: "#81c784", padding: '15px', fontFamily: "Open Sans", fontSize: 12}} 
            sx={{ display: state.openSuccess }}>
          ✔️&nbsp;&nbsp;Metric test {state.urlToRegister} registered successfully.
        </Paper>
        <Card elevation={4} 
            style={{background: "#e57373", padding: '15px', fontFamily: "Open Sans", fontSize: 12}} 
            sx={{ display: state.openError }}>
          ⚠️&nbsp;&nbsp;{state.errorMessage}
        </Card>
      </Box>


      {/* Display the Data table listing the FAIR metrics tests */}
      {state.assessmentsList.length > 0 && 
        <div style={{ height: 600, width: '100%' }}>
          {console.log(state.assessmentsList)}
          <DataGrid
            columns={columns}
            rows={state.assessmentsList}
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

