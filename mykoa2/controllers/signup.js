const userService = require('../lib/mysqlConfig')
const md5 = require('md5')
const moment = require('moment')
const fs = require('fs')

//注册
exports.postSignup = async ctx => {
    let {
        name,
        password,
        avator
    } = ctx.request.body
    await userService.FindDataCountByName(name)
        .then(async (result) => {
            if (result[0].count >= 1) {
                ctx.body = {
                    code: 500,
                    message: '用户已存在'
                };
            } else if (avator && avator.trim() === '') {
                ctx.body = {
                    code: 500,
                    message: '请上传头像'
                };
            } else {
                let base64Data = avator.replace(/^data:image\/\w+;base64,/, ""),
                    dataBuffer = new Buffer(base64Data, 'base64'),
                    getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
                    upload = await new Promise((reslove, reject) => {
                        fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
                            if (err) {
                                throw err;
                                reject(false)
                            };
                            reslove(true)
                        })
                    })
                if (upload) {
                    await userService.InsertUserData([name, md5(password), getName + '.png', moment().format('YYYY-MM-DD HH:mm:ss')])
                        .then(res => {
                            console.log('注册成功', res)
                            ctx.body = {
                                code: 200,
                                message: '注册成功'
                            }
                        })
                } else {
                    ctx.body = {
                        code: 500,
                        messgae: '头像上传失败'
                    }
                }
            }
        })
}
//修改密码
exports.changePass = async ctx => {
    let {
        name,
        password,
        newpass
    } = ctx.request.body
    await userService.FindDataCountByName(name)
        .then(async (result) => {
            if (result[0].count < 1) {
                ctx.body = {
                    code: 500,
                    message: '该用户不存在'
                }
            } else {
                await userService.FindUserByName(name)
                    .then(async (result) => {
                        if (result[0].pass === md5(password.trim())) {
                            await userService.ChangePass(name, md5(newpass))
                                .then(() => {
                                    ctx.body = {
                                        code: 200,
                                        message: '修改密码成功'
                                    }
                                }).catch(() => {
                                    ctx.body = {
                                        code: 500,
                                        message: '修改密码失败'
                                    }
                                })
                        } else {
                            ctx.body = {
                                code: 500,
                                message: '密码错误'
                            }
                        }
                    })
            }
        })
}
//更改头像
exports.changeAvator = async ctx => {
    let {
        name,
        avator
    } = ctx.request.body
    let base64Data = avator.replace(/^data:image\/\w+;base64,/, ""),
        dataBuffer = new Buffer(base64Data, 'base64'),
        getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
        upload = await new Promise((reslove, reject) => {
            fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
                if (err) {
                    throw err;
                    reject(false)
                };
                reslove(true)
            })
        })
    if (upload) {
        await userService.ChangeAvator(name, getName + '.png')
            .then(res => {
                ctx.body = {
                    code: 200,
                    message: '修改头像成功'
                }
            })
    } else {
        ctx.body = {
            code: 500,
            messgae: '修改头像失败'
        }
    }
}
//编辑个人简介
exports.changeSummary=async ctx=>{
    let {
        name,
        summary
    }=ctx.request.body
    await userService.FindDataCountByName(name)
    .then(async(result)=>{
        if(result[0].count<1){
            ctx.body={
                code:500,
                message:'该用户不存在'
            }
        }else{
            await userService.ChangeSummary(name,summary)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '修改简介成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '修改简介失败'
                }
            })
        }
    })
}