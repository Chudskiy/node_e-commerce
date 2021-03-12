const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const {readdirSync} = require('fs');
require('dotenv').config();

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
})
    .then(() => console.log('DB CONNECTED'))
    .catch(error => console.log('DB CONNECTION ERROR = ', error))

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());


//routes middleware
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
