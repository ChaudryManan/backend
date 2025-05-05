import connectDB from "./db/index.js"
import app  from "./app.js"
connectDB().then(()=>{
    app.listen(process.env.PORT||8000,(()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
        app.on("error",((error)=>{
console.log(error)
throw error
        }))
    }))
}).catch((error)=>{
    console.log("there is erroe in index.js",error)
})