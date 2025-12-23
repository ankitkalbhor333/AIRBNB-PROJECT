function Wrapasync(fun){
  return function(req,res,next){
    fun(req,res,next).catch(err)
  }
}
export default Wrapasync;