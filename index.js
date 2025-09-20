const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
function logger(){
    return (req,res,next)=>{
        console.log(`${req.method} ${req.url}`, req.body);
        next();
    }
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = {logger}