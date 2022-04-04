import React, { useContext } from 'react';
import { useLocation, useHistory, Link } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { Typography, Container, Button, Paper, Box, FormControl, Chip, Tooltip, TextField, CircularProgress, Grid, Select, MenuItem, InputLabel } from "@mui/material";
import { Popper, ClickAwayListener, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import CreateCollectionIcon from '@mui/icons-material/Send';
// import CreateCollectionIcon from '@mui/icons-material/PlaylistAddCheck';
import CreateCollectionIcon from '@mui/icons-material/LibraryAdd';
import CollectionIcon from '@mui/icons-material/CollectionsBookmark';

import { DataGrid, GridToolbar, GridColumns, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';

import axios from 'axios';
import axiosRetry from 'axios-retry';
// import { Doughnut } from 'react-chartjs-2';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { settings } from '../settings'
import UserContext from '../UserContext';
// import { useAuth } from 'oidc-react';

export default function Collections() {
  const theme = useTheme();
  const { user }: any = useContext(UserContext);
  const history = useHistory();
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

  // useLocation hook to get URL params
  let location = useLocation();  
  let evaluationResults: any = null;
  let resourceMetadata: any = null;
  let fairDoughnutConfig: any = null;
  const [state, setState] = React.useState({
    urlToEvaluate: "https://doi.org/10.1594/PANGAEA.908011",
    // urlToEvaluate: "https://doi.org/10.1038/sdata.2016.18",
    evaluationResults: evaluationResults,
    collectionsList: [],
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
    // Get the edit URL param if provided
    // const params = new URLSearchParams(location.search + location.hash);
    // let urlToEvaluate = params.get('evaluate');
    // if (urlToEvaluate) {
    //   updateState({ urlToEvaluate: urlToEvaluate })
    //   doEvaluateUrl(urlToEvaluate)
    // } 
    updateState({ evaluationRunning: true })
    // Get the list of collections from API
    if (state.collectionsList.length < 1) {
      axios.get(settings.restUrl + '/collections', {
        headers: {'Content-Type': 'application/json'},
      })
        .then((res: any) => {
          let collectionsList: any = []
          res.data.map((collec: any, key: number) => {
            collec['id'] = collec['_id']
            // evaluation['score_percent'] = evaluation['score']['percent']
            // evaluation['bonus_percent'] = evaluation['score']['bonus_percent']
            collectionsList.push(collec)
          })
          updateState({ collectionsList: collectionsList })
          updateState({ evaluationRunning: false })
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

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set the TextField input to the state variable corresponding to the field id  
    updateState({[event.target.id]: event.target.value})
  }
  // const handleSubmit  = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   doEvaluateUrl(state.urlToEvaluate)
  // }

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
    // { field: 'id', headerName: 'ID', hide: false },
    { 
      field: 'id', headerName: 'Access collection', flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        // <Button href={'/#/evaluations/' + params.value as string}
        <Link to={'/collections/' + params.value as string}>
          <Button variant="contained" 
              className={classes.submitButton} 
              // startIcon={<CollectionIcon />}
              color="primary" style={{textTransform: 'none'}}>
            {params.value as string}
          </Button>
        </Link>)
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'homepage', headerName: 'Homepage', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
    {
      field: 'created', headerName: 'Date created', flex: 0.4,
      renderCell: (params: GridRenderCellParams) => {
        const dateCreated = params.value as string
        return (
        <>
          {dateCreated.substring(0, dateCreated.indexOf('T'))}
        </>)}
    },
    {
      field: 'author', headerName: 'Author', flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {getUrlHtml(params.value as string)}
        </>)
    },
    // TODO: calculate max_score and max_bonus for each collection
    // {
    //   field: 'max_score', headerName: 'FAIR compliant', flex: 0.5,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <>
    //       {params.value as string}%
    //     </>)
    // },
    // {
    //   field: 'max_bonus', headerName: 'FAIR Role Model', flex: 0.5,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <>
    //       {params.value as string}%
    //     </>)
    // }
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
        Collections of Metrics Tests
      </Typography>

      <Link to="/collection/create">
        <Button variant="contained" 
          // className={classes.submitButton} 
          style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(3), textTransform: 'none'}}
          startIcon={<CreateCollectionIcon />}
          color="secondary" >
            Create a new collection
        </Button>
      </Link>

      {user.id &&
        <Typography variant='body2' color='primary' style={{marginBottom: theme.spacing(3)}}>
          ⚠️ Your ORCID will be publicly linked to the collections you publish
        </Typography>
      }

      {/* <Link to="/collections" className={classes.linkButton}>
          <Tooltip title='Browse existing Collections of assessments'>
            <Button style={{color: '#fff'}}>
              <InfoIcon />
              Collections
            </Button>
          </Tooltip>
        </Link> */}

      {/* Display the Data table listing the Evaluations */}
      {state.collectionsList.length > 0 && 
        <div style={{ height: 600, width: '100%' }}>
          {console.log(state.collectionsList)}
          <DataGrid
            columns={columns}
            rows={state.collectionsList}
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


      {/* {state.evaluationRunning && 
        <CircularProgress style={{margin: theme.spacing(5, 0)}} />
      } */}
    </Container>
  )
}

