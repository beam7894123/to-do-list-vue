const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path: '.env'});
const PORT = process.env.PORT || '3001';
const HOST = process.env.HOST || 'localhost';
const app = express();
const CorsOrigin = process.env.APP_URL || 'http://localhost:8080';

/*** CORS Options ***/
const corsOptions = {
  origin: CorsOrigin,
  credentials: true,
};

/*** Middleware ***/
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors(corsOptions));

/*** Routes ***/

app.get('/', (request, response) => {
  response.status(200).send(":3")
})

const userRouter = require('./api/user');
app.use('/user',userRouter);

const guestRouter = require('./api/guest');
app.use('/guest',guestRouter);

/**Start listening */
app.listen(PORT, HOST, function() {
  console.log("Start Listening for requests on port %d in %s", PORT, HOST);
  console.log("➜  http://%s:%d/", HOST, PORT);
});
