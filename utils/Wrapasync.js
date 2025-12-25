function Wrapasync(fun){
  return function(err,req,res,next){
    fun(err,req,res,next).catch(err)
  }
}
export default Wrapasync;