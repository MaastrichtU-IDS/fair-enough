
const settings = {
  apiUrl: process.env.API_URL || 'http://localhost',
  restUrl: ((process.env.API_URL) ? process.env.API_URL + '/rest' : null) || 'http://localhost/rest',
  docsUrl: ((process.env.API_URL) ? process.env.API_URL + '/docs' : null) || 'http://localhost/docs',
  graphqlUrl: ((process.env.API_URL) ? process.env.API_URL + '/graphql' : null) || 'http://localhost/graphql'
}

export default settings;
