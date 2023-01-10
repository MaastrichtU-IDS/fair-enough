import React, { useContext } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, Snackbar, Tooltip, TextField, CircularProgress, Card, CardContent, CardHeader, IconButton, MenuItem } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutlined';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';
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
  const navigate = useNavigate();
  // const auth = useAuth();

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

  const { user }: any = useContext(UserContext);

  // useLocation hook to get URL params
  let location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  let evaluationResults: any = null;
  let resourceMetadata: any = null;
  let fairDoughnutConfig: any = null;
  const [state, setState] = React.useState({
    urlToEvaluate: "",
    // urlToEvaluate: "https://doi.org/10.1594/PANGAEA.908011",
    // urlToEvaluate: "https://doi.org/10.1038/sdata.2016.18",
    evaluationResults: evaluationResults,
    adviceLogs: [],
    evaluationRunning: false,
    evaluationsList: [],
    collectionsList: [],
    collectionSelected: 'fair-evaluator-maturity-indicators',
    showReleaseMsg: true,
    openError: 'none',
    errorMessage: '',
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

  const getEvaluations  = (subjectUrl: string) => {
    const graphqlQuery = `{
      evaluations(subject: "` + subjectUrl + `") {
        score
        scoreMax
        createdAt
        subject
        collection
        author
        scorePercent
        id
      }
    }`
    axios.post(settings.graphqlUrl, { query: graphqlQuery })
      .then((res: any) => {
        console.log('HISTORY', res.data);
        if (res.data.data && res.data.data.evaluations) {
          updateState({
            evaluationsList: res.data.data.evaluations,
          })
          return res.data.data.evaluations
        } else {
          return []
        }
      })
      .catch(function (error) {
        return []
      })

    // axios.get(settings.restUrl + '/metrics')
    //   .then((res: any) => {
    //     const metricsTestsMap: any = {};
    //     const metricsTestsArray: any = []
    //     res.data.map((test: any) => {
    //       metricsTestsMap[test['_id']] = test
    //       metricsTestsArray.push(test)
    //     })
    //     updateState({
    //       metricsTestsMap: metricsTestsMap, metricsTestsArray: metricsTestsArray,
    //       loading: false
    //     })
    //   })

  }



  // Run on page init
  React.useEffect(() => {
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    if (searchParams.get("uri")) {
      // @ts-ignore
      const evals = getEvaluations(searchParams.get("uri"))
      updateState({
        urlToEvaluate: searchParams.get("uri"),
      })
    }

    // TODO: search evals

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
          updateState({
            collectionsList: collectionsList,
          })
        })
    }

    // Get the list of evaluations from API
    // if (state.evaluationsList.length < 1) {
    //   axios.get(settings.restUrl + '/evaluations', {
    //     headers: {'Content-Type': 'application/json'},
    //   })
    //     .then((res: any) => {
    //       let evaluationsList: any = []
    //       res.data.map((evaluation: any, key: number) => {
    //         evaluation['id'] = evaluation['_id']
    //         evaluation['score_percent'] = evaluation['score_percent']
    //         evaluation['score'] = evaluation['score'] + '/' + evaluation['score_max']
    //         evaluation['subject'] = evaluation['subject']
    //         evaluation['collection'] = evaluation['collection']
    //         evaluation['created'] = evaluation['created_at']
    //         evaluation['author'] = evaluation['author']
    //         // evaluation['bonus_percent'] = evaluation['bonus']
    //         evaluation['bonus_percent'] = 0
    //         evaluationsList.push(evaluation)
    //       })
    //       updateState({ evaluationsList: evaluationsList })
    //       updateState({ evaluationRunning: false })
    //     })
    //     .catch(function (error) {
    //       updateState({
    //         openError: 'inline',
    //         evaluationRunning: false,
    //         errorMessage: 'Error when retrieving the evaluations, please retry. If it persists, it means the server is probably having some issues! 😱'
    //       })
    //     })
    // }
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
      evaluationResults: null,
      openError: 'none'
    })
    console.log('Starting evaluation of ' + evaluateUrl + ' with API ' + settings.docsUrl)
    const postJson: any = {
      "subject": evaluateUrl,
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
            navigate("/evaluations/" + evalId);
          })
      })
      .catch(function (error) {
        updateState({
          openError: 'inline',
          evaluationRunning: false,
          errorMessage: 'Error when running the evaluation, please retry.'
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

  const handleCollectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({'collectionSelected': event.target.value})
    // hljs.highlightAll();
  }

  const columns: GridColumns = [
    { field: '@id', headerName: 'ID', hide: true },
    {
      field: 'id', headerName: 'Access evaluation', flex: 0.4,
      renderCell: (params: GridRenderCellParams) => (
        <Link to={'/evaluations/' + params.value as string}>
          <Button variant="contained"
              className={classes.submitButton}
              startIcon={<EvaluationIcon />}
              color="primary" style={{textTransform: 'none'}}>
            Results
          </Button>
        </Link>)
    },
    // { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'subject', headerName: 'Resource URI', flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
    {
      field: 'title', headerName: 'Resource title', flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value as string}>
          <span>{params.value as string}</span>
        </Tooltip>)
    },
    {
      field: 'collection', headerName: 'Collection', flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Link to={'/collections/' + params.value as string} style={{textDecoration: 'none', color: theme.palette.primary.dark}}>
            {params.value as string}
          </Link>
        </>)
    },
    {
      field: 'score', headerName: 'Score', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}
        </>)
    },
    {
      field: 'score_percent', headerName: 'Completion', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value as string}%
          { params.value == 100 &&
            <>
              &nbsp;🔥
            </>
          }
        </>)
    },
    // {
    //   field: 'bonus_percent', headerName: 'Bonus score', flex: 0.3,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <>
    //       {params.value as string}%
    //     </>)
    // },
    {
      field: 'createdAt', headerName: 'Date created', flex: 0.3,
      renderCell: (params: GridRenderCellParams) => {
        const dateCreated = params.value as string
        return (
        <>
          {dateCreated.substring(0, dateCreated.indexOf('T'))}
        </>)}
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
      field: 'createdAt',
      sort: 'desc',
    },
  ]);

  return(
    <Container className='mainContainer'>

      {/* <Card style={{
        display: state.showReleaseMsg ? 'flow' : 'none', textAlign: 'center',
        backgroundColor: '#e8f5e9',
        marginBottom: theme.spacing(3)
      }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={() => {updateState({showReleaseMsg: false})}}>
              <CloseIcon />
            </IconButton>
          }
          title="🍾 New Release"
          // subheader='Endpoints are tested to make sure they are active. They are extracted from queries metadata and the LOD. We automatically import all SPARQL queries in YASGUI for the endpoint you select'
          style={{paddingBottom: '0px'}}
        />
        <CardContent style={{paddingTop: theme.spacing(1), paddingBottom: theme.spacing(2)}}>
          <Typography>
            The service has evolved to support the specifications used by the <a href='https://github.com/FAIRMetrics/Metrics' target="_blank" rel="noopener noreferrer" className={classes.link}>FAIRMetrics working group</a>.
            This means you can run the exact same suite of metrics tests as with the <a href='https://fairsharing.github.io/FAIR-Evaluator-FrontEnd' target="_blank" rel="noopener noreferrer" className={classes.link}>FAIR Evaluator</a>, or easily register new metrics tests deployed in external APIs.
          </Typography>
          <Typography>
            Thanks a lot everyone for your contributions to making research more FAIR, and feel free to <a href='https://github.com/MaastrichtU-IDS/fair-enough/issues' target="_blank" rel="noopener noreferrer" className={classes.link}>create issues</a>,
            or contact vincent.emonet@maastrichtuniversity.nl for remarks or requests 💌
          </Typography>
        </CardContent>
      </Card> */}

      <Typography variant="h4" style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
        {/* ⚖️ Evaluate how FAIR a resource is 🔗 */}
        🎯 Evaluate how <Tooltip
          title={<Typography>🔍️ Findable<br/>
            📬️ Accessible<br/>
            ⚙️ Interoperable<br/>
            ♻️ Reusable</Typography>}
        >
          <span>
            FAIR
          </span>
        </Tooltip> a resource is

        <Tooltip
          title={<Typography>🔍️ Findable<br/>
            📬️ Accessible<br/>
            ⚙️ Interoperable<br/>
            ♻️ Reusable</Typography>}
        >
          <HelpIcon color="action" style={{marginLeft: theme.spacing(1)}}/>
        </Tooltip>
      </Typography>

      {/* {auth && auth.userData &&
        <div>
          <strong>Logged in! 🎉</strong><br />
          <button onClick={() => auth.signOut()}>Log out!</button>
        </div>
      } */}

      {/* Form to provide the URL to evaludate */}
      <form onSubmit={handleSubmit} style={{textAlign: 'left'}}>

        <Typography variant='body1' style={{marginBottom: theme.spacing(3)}}>
          1. Choose the collection of FAIR Maturity Indicators (aka. FAIR Metrics tests) to validate your resource against:
        </Typography>

        <Box display="flex" style={{marginBottom: theme.spacing(1)}}>
          {/* Collection dropdown */}
          <Box>
            <TextField select
                value={state.collectionSelected}
                label={"Use the collection"}
                id="collectionSelected"
                onChange={handleCollectionChange}
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
                style={{margin: theme.spacing(0, 0), backgroundColor: 'white'}}
                variant="outlined">
              { state.collectionsList.map((collec: any, key: number) => (
                <MenuItem value={collec.id}>{collec.title} ({collec.id})</MenuItem>
              ))}
            </TextField>
          </Box>

          { state.collectionsList.map((collec: any, key: number) => {
            if (collec.id === state.collectionSelected) {
              return (
                <Card style={{marginLeft: theme.spacing(1), padding: '15px'}} key={key}>
                  <Typography variant='body1'>
                    {collec.description}
                  </Typography>
                </Card>
              )
            }
          })}
        </Box>

        <Typography variant='body1' style={{marginBottom: theme.spacing(1)}}>
          2. Provide the URL to the resource, or digital object, you want to evaluate <Tooltip
          title={<Typography>
            🔗 The best is to a URL, aka. URI, as it is the most standard and unambiguous protocol for identifying a resource online.
            <br/>But DOI and handles are also accepted by some collections
          </Typography>}
        >
          <HelpIcon color="action" style={{marginLeft: theme.spacing(1)}}/>
        </Tooltip>
        </Typography>

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
            className: classes.formInput,
          }}
        />

        <Button type="submit"
          variant="contained"
          // className={classes.submitButton}
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1), textTransform: 'none'}}
          startIcon={<EvaluationIcon />}
          color="secondary" >
            Start the evaluation
        </Button>
        {user.id &&
          <Typography variant='body2' color='primary' style={{marginBottom: theme.spacing(3)}}>
            ⚠️ Your ORCID will be publicly linked to the results of the evaluations you run while logged in.
          </Typography>
        }
      </form>

      <Box style={{margin: theme.spacing(4, 0)}}>
        {state.evaluationRunning &&
          <>
            <Typography>
              An evaluation can take up to 1 minute depending on the URL evaluated, and the collection used.
            </Typography>
            <Typography>
              If you leave this page the evaluation will not stop, and you will be able to find it in the list below when it is done.
            </Typography>
            <CircularProgress style={{marginTop: '20px'}} />
          </>
        }
        <Card elevation={4}
            style={{background: "#e57373", padding: '15px', fontFamily: "Open Sans", fontSize: 12}}
            sx={{ display: state.openError }}>
          ⚠️&nbsp;&nbsp;{state.errorMessage}
        </Card>
      </Box>

      {/* Display the Data table listing the Evaluations */}
      {state.evaluationsList.length > 0 &&
        <div style={{ height: 600, width: '100%' }}>
          {/* {console.log(state.evaluationsList)} */}
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

