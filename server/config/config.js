const mongoose = require('mongoose')
const keys = require('./keys')

mongoose.connect(keys.mongodb_URI)
.then(function(result) {
    console.log('Database is connected');
})
.catch((err) => console.log(err));