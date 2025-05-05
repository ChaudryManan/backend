require("dotenv").config()
const express=require ("express")
const app=express()
const port =4000
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.get("/twitter",(req,res)=>{
    res.send("abdul Manan ")
})
app.get("/login",(req,res)=>{
    res.send("<h1>Follow Abdul Manan</h1> ")
})
app.listen(process.env.PORT,()=>{
    console.log((`example app listening on ${port}`))
})