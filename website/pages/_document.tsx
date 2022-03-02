import Document, { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'


import React, { createContext, useReducer } from "react";
// import { View } from "react-native";
// import { HashRouter } from "react-router-dom";
// import { BrowserRouter as Router, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';

import UserContext from "../components/UserContext";

// Change theme color and typography here
const theme = createTheme({
  palette: {
    primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' }, // blue
    secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' }, // green
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // secondary: { light: '#ffcc80', main: '#ffa726', dark: '#c88719' }, // Orange
    // secondary: { light: '#ff7043', main: '#ff5722', dark: '#087f23' }, // Orange
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
    "fontSize": 11,
  },
  // spacing: 2
  // overrides: {
  //   MuiTooltip: {
  //       tooltip: {
  //           fontSize: "1em",
  //       },
  //   },
  // },
});

// context for User
function reducer(state: any, item: any) {
  // return [...state, item]
  // return {...state, item}
  return item
}



export default class MyDocument extends Document {
  
  render() {
    const [user, setUser]: any = useReducer(reducer, []);
    
    return (
      <Html>
        <Head />
        <body style={{display: "flex", flexDirection: "column", minHeight: '100vh',
            backgroundColor: '#f5f6f7', // ligther grey
            // backgroundColor: '#eceff1', // darker grey
        }}>
          <ThemeProvider theme={theme}>
            <UserContext.Provider value={{ user, setUser }}>
              <NavBar />
              <Main />
              <NextScript />
              <Footer />
            </UserContext.Provider>
          </ThemeProvider>
        </body>
      </Html>
    )
  }
}
