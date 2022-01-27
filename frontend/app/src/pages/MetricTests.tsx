import React from 'react';
import { useLocation, useHistory, Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import RegistrationIcon from '@mui/icons-material/AddLocationAlt';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
// import axiosRetry from 'axios-retry';
import { settings } from '../settings'

import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

export default function MetricTests() {
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

  // useLocation hook to get URL params
  let location = useLocation();  
  let evaluationResults: any = null;
  let resourceMetadata: any = null;
  let fairDoughnutConfig: any = null;
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

  // Settings for Popper
  // const [open, setOpen] = React.useState(false);
  // const [anchorEl, setAnchorEl]: any = React.useState(null);
  // const handleClick = (event: any) => {
  //   setAnchorEl(anchorEl ? null : event.currentTarget);
  //   // setAnchorEl(anchorEl ? null : document.body);
  //   setOpen((prev) => !prev);
  // };
  // const handleClickAway = () => {
  //   setOpen(false);
  //   setAnchorEl(anchorEl ? null : anchorEl);
  // };
  // const id = open ? 'simple-popper' : undefined;
  

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
      axios.get(settings.restUrl + '/metric-tests', {
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

  // const colors: any = {
  //   f: '#81d4fa', // blue
  //   a: '#ffcc80', // orange
  //   i: '#a5d6a7', // green
  //   r: '#b39ddb', // purple
  //   fail: '#ef5350' // red
  // }
  // const colorsLight: any = {
  //   f: '#b3e5fc', // blue
  //   a: '#ffe0b2', // orange
  //   i: '#c8e6c9', // green
  //   r: '#d1c4e9', // purple
  // }

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
    axios.post(settings.restUrl + '/metric-test', 
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

      {/* <Typography variant="body1" style={{textAlign: 'left', marginBottom: theme.spacing(3), marginTop: theme.spacing(2)}}>
        You can find an example of API exposing metrics tests in the fair-enough GitHub repository: <a href='https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments' target="_blank" rel="noopener noreferrer">backend/app/assessments</a>
      </Typography> */}


      <form onSubmit={handleSubmit}>
        {/* <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(4, 0)}}>
          Register a new Metric Test
        </Typography> */}
        <Typography variant="body1" style={{textAlign: 'left', margin: theme.spacing(0, 0)}}>
          You can register a Metric Test API URL that follows the standard described by the <a href='https://github.com/FAIRMetrics/Metrics' target="_blank" rel="noopener noreferrer" className={classes.link}>FAIRMetrics working group</a>, this will allow FAIR enough users to add this test to collections, and use it in evaluations:
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
        <Paper elevation={4} style={{backgroundColor: "#81c784", padding: '15px'}} sx={{ display: state.openSuccess }}>
          {/* <Typography> */}
            ✔️&nbsp;&nbsp;Metric test {state.urlToRegister} registered successfully.
          {/* </Typography> */}
        </Paper>
        <Paper elevation={4} style={{background: "#e57373", padding: '15px'}} sx={{ display: state.openError }}>
          {/* <Typography> */}
            ⚠️&nbsp;&nbsp;{state.errorMessage}
          {/* </Typography> */}
        </Paper>
      </Box>


      {/* Display the Data table listing the Assessments */}
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


      {/* <Typography variant="h4" style={{textAlign: 'center', margin: theme.spacing(4, 0)}}>
        Add new assessments
      </Typography>

      <Typography variant="body1" style={{textAlign: 'left', marginBottom: theme.spacing(1), marginTop: theme.spacing(4)}}>
        To add new assessments you will need to fork the <a href='https://github.com/MaastrichtU-IDS/fair-enough' target="_blank" rel="noopener noreferrer">fair-enough GitHub repository</a>, add new assessments in <a href='https://github.com/MaastrichtU-IDS/fair-enough/tree/main/backend/app/assessments' target="_blank" rel="noopener noreferrer">backend/app/assessments</a>, and send a pull request! To create a new assessment follow those instructions:
      </Typography>

      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NewFolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            Fork this repository, and optionally create a new folder in <code>backend/app/assessments</code> if you want to group multiple assessments under a same folder 
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CopyIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            Copy an existing assessment to get started, such as <a href='https://github.com/MaastrichtU-IDS/fair-enough/blob/main/backend/app/assessments/a1_access_protocol.py' target="_blank" rel="noopener noreferrer"><code>a1_access_protocol.py</code></a>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EditIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText> 
            Change the attributes of the <code>Assessment</code> class to describe it so that users can easily understand what your assessment does. Provide your ORCID URL in the <code>author</code> attribute,
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CodeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText> 
            Add the code in the <code>evaluate()</code> function, 2 variables are passed to the assessment, plus you can access the assessment object itself to log what the test is trying to do, and why it success or fail. 
            Here are the main variables you have access to in the assessment:
          </ListItemText>
        </ListItem>
        <ListItem>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <EvaluationIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <code>eval</code>: evaluation object that you can use to pass data between assessments (e.g. to pass the license URL, or JSON-LD metadata your assessment retrieves)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <RdfIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <code>g</code>: RDFLib graph of the RDF retrieved when searching for the resource metadata
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AssessmentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <code>self</code>: the assessment object itself, can be used to perform various logging actions related to the test (don't use <code>print</code> otherwise it will not show up in the evaluation results returned by the API)
              </ListItemText>
            </ListItem>
          </List>
        </ListItem>

      </List>

      <pre>
        <code className="language-python" style={{whiteSpace: 'pre-wrap', overflowX: 'auto'}}>
          {`self.log('This print a regular event', '✔️')
self.success('This will also increase the score of the assessment by 1')
self.bonus('This will also increase the bonus score of the assessment by 1')
self.warning('This will print a warning while running the assessment')
self.error('This will print a failure while running the assessment')
# We provide also some helpers, e.g. to parse RDF (cf. models/assessments.py)
g = self.parseRDF(rdf_data, 'text/turtle', msg='content negotiation RDF')`}
        </code>
      </pre>

      <Typography variant="body1" style={{textAlign: 'left', marginTop: theme.spacing(3), marginBottom: theme.spacing(1)}}>
        Once you created your assessment, you can test it locally before submitting a pull request.
        <br/><br/>
        Start the stack with docker-compose following the instructions in the <a href='https://github.com/MaastrichtU-IDS/fair-enough#readme' target="_blank" rel="noopener noreferrer">README</a>. 
        You can directly test your assessment on a given resource URI with the <a href={settings.docsUrl + '#/assessments/run_assessment_rest_assessments_post'} target="_blank" rel="noopener noreferrer">POST /assessments</a> operation in the API, 
        or you can also create a new collection, if you want to try it as part of a collection.
      </Typography> */}

      {/* <Link to="/collection/create">
        <Button variant="contained" 
          // className={classes.submitButton} 
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(4)}}
          startIcon={<CreateCollectionIcon />}
          color="secondary" >
            Create a new collection
        </Button>
      </Link> */}

      {/* <Link to="/collections" className={classes.linkButton}>
          <Tooltip title='Browse existing Collections of assessments'>
            <Button style={{color: '#fff'}}>
              <InfoIcon />
              Collections
            </Button>
          </Tooltip>
        </Link> */}

      {/* {state.evaluationRunning && 
        <CircularProgress style={{margin: theme.spacing(5, 0)}} />
      } */}

    </Container>
  )
}

