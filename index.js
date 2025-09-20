const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
function logger(){
    return (req,res,next)=>{
        console.log(req);
        next();
    }
}
app.listen(process.env.PORT,()=>{

})
module.exports = {logger}