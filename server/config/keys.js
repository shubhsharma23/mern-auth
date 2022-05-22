const dotenv = require('dotenv');
dotenv.config();

module.exports={
    mongodb_URI : process.env.mongodb_URI || "mongodb://localhost:27017/aaa",
}
