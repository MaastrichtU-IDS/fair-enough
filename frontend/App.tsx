import React from "react";
import { View } from "react-native";
import { HashRouter } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import './src/App.css';
import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";
import Evaluations from "./src/pages/Evaluations";
import About from "./src/pages/About";

// Change theme color and typography here
const theme = createTheme({
  palette: {
    primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' }, // blue
    secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' }, // green
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // secondary: { light: '#ff7043', main: '#ff5722', dark: '#087f23' },
    // red: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
    // success: { light: '#ffe0b2', main: '#a5d6a7', dark: '#00600f' }, // green
    // info: { light: '#b3e5fc', main: '#81d4fa', dark: '#00600f' }, // blue
    // warning: { light: '#c8e6c9', main: '#ffcc80', dark: '#00600f' }, // orange
    // error: { light: '#ffcdd2', main: '#ef9a9a', dark: '#e57373' }, // red
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500,
    "fontSize": 11
  },
  overrides: {
    MuiTooltip: {
        tooltip: {
            fontSize: "1em",
        },
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    {/* <Router basename="/fairificator/"> */}
    <HashRouter>
      <View style={{height: '100%', backgroundColor: '#eceff1'}}>
        <NavBar />

        <Route exact path="/" component={Evaluations} />
        <Route path="/about" component={About} />
        <Footer />
      </View>
    </HashRouter>
  </MuiThemeProvider>
);
export default App;
