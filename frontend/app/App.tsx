import React, { createContext, useReducer } from "react";
import { View } from "react-native";
import { HashRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { ThemeProvider } from '@mui/styles';
// import { createTheme } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import blue from '@mui/material/colors/blue';
import './src/App.css';
import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";
import SearchEvaluations from "./src/pages/SearchEvaluations";
import FoundEvaluations from "./src/pages/FoundEvaluations";
import Evaluation from "./src/pages/Evaluation";
import Collection from "./src/pages/Collection";
import CreateCollection from "./src/pages/CreateCollection";
import Collections from "./src/pages/Collections";
import MetricTests from "./src/pages/MetricTests";
import About from "./src/pages/About";
import UserContext from "./src/UserContext";
// import { AuthProvider, useAuth } from 'oidc-react';

// const UserContext = createContext(null);

// https://github.com/kolitiri/fastapi-oidc-react
// const oidcConfig = {
//   onSignIn: async (user: any) => {
//     alert('You just signed in, congratz! Check out the console!');
//     console.log(user);
//     window.location.hash = '';
//   },
//   authority: 'https://orcid.org',
//   clientId: process.env.ORCID_CLIENT_ID,
//   // redirectUri: 'http://localhost/rest/auth',
//   redirectUri: 'http://localhost:19006/',
//   autoSignIn: false
//   // redirectUri="http://localhost:3000/oauth-callback"
// };

// Change theme color and typography here
const theme = createTheme({
  palette: {
    primary: { light: '#6ec6ff', main: blue[500], dark: '#0069c0' }, // blue
    // primary: { light: '#c7a4ff', main: '#9575cd', dark: '#65499c' }, // purple
    secondary: { light: '#6abf69', main: '#388e3c', dark: '#00600f' }, // green
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

// Fix React router:
// https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
// We could use an express server
// app.use('/mysub-application1', express.static(path.resolve(__dirname, `../public`)))
// app.get('/mysub-application1/*', (req,res) => { //this is required to support any client side routing written in react.
//  res.sendFile(path.join(__dirname, '../../public', 'index.html'))
// })


// context for User
function reducer(state: any, item: any) {
  // return [...state, item]
  // return {...state, item}
  return item
}

const App = () => {

  const [user, setUser]: any = useReducer(reducer, []);

  return (<ThemeProvider theme={theme}>
    <UserContext.Provider value={{ user, setUser }}>
    {/* <AuthProvider {...oidcConfig}> */}
      <Router basename="/">
      {/* <HashRouter> */}
        <View style={{height: '100%', backgroundColor: '#eceff1'}}>
          <NavBar />
          <Routes>
            <Route path="/evaluations" element={<FoundEvaluations />} />
            <Route path="/evaluations/:id" element={<Evaluation />} />
            <Route path="/collections/:id" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/metrics" element={<MetricTests />} />
            <Route path="/collection/create" element={<CreateCollection />} />
            <Route path="/" element={<SearchEvaluations />} />
          </Routes>
          <Footer />
        </View>
      {/* </HashRouter> */}
      </Router>
    </UserContext.Provider>
    {/* </AuthProvider> */}
  </ThemeProvider>
)};
export default App;
