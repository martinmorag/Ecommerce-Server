const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const session = require('express-session');
const cors = require('cors');

const port = process.env.PORT || 4000;
const app = express();


app
  .use(bodyParser.json({ limit: '10mb' }))
  .use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
  .use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
  }))
  .use(cors({ 
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  }))
  .use('/', require('./routes'));
  

mongodb.initDb((err) => {
    if (err) {
      console.log(err);
    } else {
        app.listen(port, () => {console.log(`Server is listening on port ${port}`)});
    }
  });


module.exports = app;
