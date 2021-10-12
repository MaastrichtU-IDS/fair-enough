import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  },
  mainText: {
    textAlign: 'center', 
    marginBottom: '20px'
  }
}))


export default function About() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    project_license: '',
    language_autocomplete: [],
  });
  // const form_category_dropdown = React.createRef(); 

  return(
    <Container className='mainContainer'>
        {/* <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
          About
        </Typography> */}

      <Typography variant="body1" className={classes.mainText}>
        A web interface to evaluate how much a resource URL follows to the <a href="https://www.go-fair.org/fair-principles" className={classes.link} target="_blank" rel="noopener noreferrer">FAIR principles ♻️</a> (Findable, Accessible, Interoperable, Reusable).
      </Typography>
      <Typography variant="body1" className={classes.mainText}>
        Relies on a <a href="https://github.com/vemonet/fair-enough" className={classes.link} target="_blank" rel="noopener noreferrer">custom F-UJI API</a> hosted by the <a href="https://www.maastrichtuniversity.nl/research/institute-data-science" className={classes.link} target="_blank" rel="noopener noreferrer">Institute of Data Science</a> at Maastricht University.
      </Typography>
      

    </Container>
  )
}