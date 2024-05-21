const express = require('express');
const dotenv = require('dotenv');
dotenv.config({path: '.env'});
const PORT = process.env.PORT || '3001';
const app = express();


/*** Middleware ***/
app.use(express.json());
app.use(express.urlencoded({extended:false}));

/*** Routes ***/

app.get('/', (request, response) => {
  response.status(200).send(":3")
})

const userRouter = require('./api/user');
app.use('/user',userRouter);

const guestRouter = require('./api/guest');
app.use('/guest',guestRouter);

/**Start listening */
app.listen(PORT, () => {
  console.log(`Start Listening for requests on port ${PORT}`)
})
