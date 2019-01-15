
exports.signOut=async ctx=>{
    ctx.session = null;
    console.log('登出成功')
    ctx.body = true
}

