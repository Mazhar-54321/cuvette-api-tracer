import mongoose from "mongoose";
import database from "./database.js";
import express from 'express'
database();
export default function logger(){
    return async(req,res,next)=>{
        const apiKey ="qwerty-imadganc-mkuwrtegvsfbas";
        const start = Date.now();
        const logBuffer = [];
        const consoleObj = {
            log:console.log,
            error:console.error,
            warn:console.warn,
            info:console.info
        }
        ["log","error","warn","info"].forEach((method)=>{
            console[method]=(...args)=>{
                logBuffer.push({
                    timestamp: new Date(),
                    type:method,
                    message:args.map((a)=>typeof a ==="object"?JSON.stringify(a):a).join(" ")
                })
                consoleObj[method](...args)
            }
        })
        res.on("finish",async()=>{
            const duration = Date.now()-start;
            Object.keys(consoleObj).forEach((method)=>{
                console[method]=consoleObj[method];
            })
            console.log(res.statusCode,duration,logBuffer)
        })
       next();
    }
}
const app = express();
app.use(express.json())
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Central logger running on port ${PORT}`));
