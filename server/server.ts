import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import path from "path";
// import cors from 'cors';
// import * as swaggerUi from 'swagger-ui-express';


// Now we define the Express server:
export const app = express();
// For production (cf. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment)
app.use(compression());
// Security: https://github.com/helmetjs/helmet
app.use(helmet({
  contentSecurityPolicy: false,
}));
// app.use(cors());

// // Add RESTful API endpoint with Sofa at /api
// const openApi = OpenAPI({
//   schema,
//   info: {
//     title: 'Bio2KG Registry API',
//     version: '3.0.0',
//   },
// });
// app.use(
//   useSofa({
//       basePath: '/api',
//       schema,
//       onRoute(info) {
//           openApi.addRoute(info, {
//             basePath: '/api',
//           });
//         },
//   })
// );
// Add OpenAPI docs at /apidocs
// openApi.save('./swagger.yml');
// app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(openApi.get()));


// We could use an express server
// app.use('/mysub-application1', express.static(path.resolve(__dirname, `../public`)))
// app.get('/mysub-application1/*', (req,res) => { //this is required to support any client side routing written in react.
//  res.sendFile(path.join(__dirname, '../../public', 'index.html'))
// })

// Serve React app at /
app.use(express.static(path.join(__dirname, ".", "public")));

app.get('/*', (req,res) => { //this is required to support any client side routing written in react.
 res.sendFile(path.join(__dirname, ".", "public", 'index.html'))
})

app.listen({ port: 4000 }, () =>
  console.log(`⚛️  React app ready at http://localhost:4000`)
);
