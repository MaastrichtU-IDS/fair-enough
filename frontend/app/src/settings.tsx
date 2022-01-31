import React from "react";
import { useTheme } from '@mui/material/styles';

const settings = {
  apiUrl: process.env.EXPO_API_URL || 'http://localhost',
  restUrl: ((process.env.EXPO_API_URL) ? process.env.EXPO_API_URL + '/rest' : null) || 'http://localhost/rest',
  docsUrl: ((process.env.EXPO_API_URL) ? process.env.EXPO_API_URL + '/docs' : null) || 'http://localhost/docs',
  graphqlUrl: ((process.env.EXPO_API_URL) ? process.env.EXPO_API_URL + '/graphql' : null) || 'http://localhost/graphql',
  OauthRedirectUri: process.env.OAUTH_REDIRECT_FRONTEND || "http://localhost:19006/collections/create"
}

const getUrlHtml = (urlString: string) => {
  const theme = useTheme();
  if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
    // Process URIs
    return <a href={urlString}  target="_blank" rel="noopener noreferrer"
        style={{color: theme.palette.primary.main,
          textDecoration: 'none',
          // '&:hover': {
          //   color: theme.palette.primary.light,
          //   textDecoration: 'none',}
          }}>{urlString}</a>
  } else {
    return urlString
  }
}

// export default settings;
export {
  settings,
  getUrlHtml
}