const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {readdirSync} = require('fs'); // access to file system
require('dotenv').config();

//import routes
// const authRoutes = require('./routes/auth');


//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
})
    .then(() => {
        console.log('DB CONNECTED');
    })
    .catch(error => {
        console.log('DB CONNECTION ERROR = ', error);
    })

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

// routes middleware
// app.use('/api', authRoutes);
readdirSync('./routes').map(r => app.use('/api', require('./routes/' + r)));


//route
// app.get('/api', (req, res) => {
//     res.json({
//         data: 'hey you hit node API',
//     })
// })

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`))


// to connect db type    node server.js



//   33
