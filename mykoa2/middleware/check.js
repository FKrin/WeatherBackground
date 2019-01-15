module.exports={
    checkNotLogin:(ctx)=>{
        if(ctx.session&&ctx.session.user){
            return false;
        }
        return true;
    },
    checkLogin:(ctx)=>{
        if(!ctx.session||!ctx.session.user){
            return false;
        }
        return true;
    }
}