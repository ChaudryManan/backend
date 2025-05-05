const asyncHandler=(requestHandler)=>{
return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((error)=>{
        next(error)
    })
}
}
export {asyncHandler}
// const asyncHandler=(fun)=>async()=>{
//     try{
// await fun(req,res,res)
//     }
//     catch(error){
//         res.status(error.code||555).json({
//             success:false,
//             message:error.message
//         })
//     }
// }