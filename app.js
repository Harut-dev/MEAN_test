const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(express.static('dist/MEAN_test'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
let url = '';
if (MONGO_USERNAME && MONGO_PASSWORD) {
   url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
} else { // for local development
   url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
}

mongoose.connect(url, options).then( function() {
  console.log('MongoDB is connected');
})
  .catch( function(err) {
    console.log(err);
  });


// Require api routes into the application.

require('./server/routes')(app);

app.get('*', (req, res) => {
  const options = {
    root: path.join(__dirname, 'dist/MEAN_test'),
  };

  res.sendFile('index.html', options);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
