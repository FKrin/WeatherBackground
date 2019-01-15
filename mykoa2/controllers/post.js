const userService = require('../lib/mysqlConfig')
const moment = require('moment')
const fs = require('fs')

//文章
exports.getPostsPage = async ctx => {
    let page = ctx.request.body.page,
        count;
    await userService.FindAllPostCount() //查询所有文章数量
        .then(result => {
            count = result[0].count
        }).catch(() => {
            ctx.body = 'error'
        })
    if (page < (count / 10 + 1)) {
        await userService.FindPostByPage(page) //文章数据
            .then(result => {
                for (i = 0; i < result.length; i++) {
                    let dataP = fs.readFileSync('./public/images/post/' + result[i].picture)
                    let dataA = fs.readFileSync('./public/images/' + result[i].avator)
                    dataP = new Buffer(dataP).toString('base64')
                    dataA = new Buffer(dataA).toString('base64')
                    result[i].avator = dataA
                    result[i].picture = dataP
                }
                ctx.body = result
            }).catch(() => {
                ctx.body = 'error'
            })
    } else {
        ctx.body = '已无更多'
    }
}
//用户文章
exports.postUserPostsPage = async ctx => {
    let {
        name,
        page
    } = ctx.request.body,
        uid,
        count;
    await userService.FindUserByName(name)
        .then(res => {
            uid = res[0].id
        })
    await userService.FindPostCountById(uid) //查询某用户文章数量
        .then(result => {
            count = result[0].count
        }).catch(() => {
            ctx.body = 'error'
        })
    if (page < (count / 10 + 1)) {
        await userService.FindPostByUserPage(uid, page) //个人文章数据
            .then(result => {
                for (i = 0; i < result.length; i++) {
                    let dataP = fs.readFileSync('./public/images/post/' + result[i].picture)
                    let dataA = fs.readFileSync('./public/images/' + result[i].avator)
                    dataP = new Buffer(dataP).toString('base64')
                    dataA = new Buffer(dataA).toString('base64')
                    result[i].avator = dataA
                    result[i].picture = dataP
                }
                ctx.body = result
            }).catch(() => {
                ctx.body = 'error'
            })
    } else {
        ctx.body = '已无更多'
    }
}
//文章详情
exports.getSinglePosts = async ctx => {
    let postId = ctx.request.body.postId,
        allow;
    await userService.FindPostIsdeleteById(postId) //文章是否被删除
        .then(result => {
            if (result[0].isdelete === 0) {
                allow = true
            } else {
                allow = false
            }
        })
    if (allow) {
        await userService.UpdatePostPv(postId) //更新浏览量
        await userService.FindDataById(postId) //文章内容
            .then(result => {
                let dataP = fs.readFileSync('./public/images/post/' + result[0].picture)
                dataP = new Buffer(dataP).toString('base64')
                result[0].picture = dataP
                res = result
            })
        await userService.FindCommentByPostId(postId) //文章评论
            .then(result => {
                for (i = 0; i < result.length; i++) {
                    let dataA = fs.readFileSync('./public/images/' + result[i].avator)
                    dataA = new Buffer(dataA).toString('base64')
                    result[i].avator = dataA
                }
                comment = result
            })
        await userService.FindZanCountByPostId(postId)//点赞数
        .then(result=>{
            zan=result
        })
        var postres = {
            post: res[0],
            zan:zan[0].count,
            comment
        }
        ctx.body = postres
    } else {
        ctx.body = {
            code: 500,
            message: '该文章已被删除'
        }
    }
}
//发表文章
exports.postCreate = async ctx => {
    let {
        name,
        content,
        picture,
    } = ctx.request.body,
        uid,
        time = moment().format('YYYY-MM-DD HH:mm:ss')
    await userService.FindUserByName(name)
        .then(res => {
            uid = res[0].id
        })
    let base64Data = picture.replace(/^data:image\/\w+;base64,/, ""),
        dataBuffer = new Buffer(base64Data, 'base64'),
        getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now(),
        upload = await new Promise((reslove, reject) => {
            fs.writeFile('./public/images/post/' + getName + '.png', dataBuffer, err => {
                if (err) {
                    throw err;
                    reject(false)
                };
                reslove(true)
            })
        })
    if (upload) {
        await userService.InsertPost([uid, content, getName + '.png', time])
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '文章发表成功'
                }
            })
    } else {
        ctx.body = {
            code: 500,
            message: '文章发表失败'
        }
    }
}
//发表评论
exports.postComment = async ctx => {
    let {
        name,
        content,
        postId,
    } = ctx.request.body,
        uid,
        allow,
        time = moment().format('YYYY-MM-DD HH:mm:ss')
    await userService.FindPostIsdeleteById(postId) //文章是否被删除
        .then(result => {
            if (result[0].isdelete === 0) {
                allow = true
            } else {
                allow = false
            }
        })
    if (allow) {
        await userService.FindUserByName(name)
            .then(res => {
                uid = res[0].id
            })
        await userService.InsertComment([uid, postId, content, time])
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '发表评论成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '发表评论失败'
                }
            })
    } else {
        ctx.body = {
            code: 500,
            message: '很抱歉，该文章已被删除'
        }
    }
}
//点赞
exports.postZan = async ctx => {
    let {
        name,
        postId
    } = ctx.request.body,
    uid,
    allow;
    await userService.FindUserByName(name)
    .then(res => {
        uid = res[0].id
    })
    await userService.FindIszanCount(uid,postId)
    .then(result=>{
        if(result[0].count>0){
            allow=false
        }else{
            allow=true
        }
    })
    if(allow){
    await userService.AddZanCount([uid,postId])
        .then(() => {
            ctx.body = {
                code: 200,
                message: '点赞成功'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: '点赞失败'
            }
        })
    }else{
        ctx.body={
            code: 500,
            message: '已点赞'
        }
    }
}
//删除文章
exports.postDeletePost = async ctx => {
    let {
        name,
        postId
    } = ctx.request.body,
        uid,
        allow;
    await userService.FindUserByName(name)
        .then(res => {
            uid = res[0].id
        })
    await userService.FindDataById(postId)
        .then(res => {
            if (res[0].uid != uid) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userService.DeleteAllPostComment(postId)
        await userService.DeletePost(postId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '文章删除成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '文章删除失败'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}
//删除评论
exports.postDeleteComment = async ctx => {
    let {
        name,
        commentId
    } = ctx.request.body,
        uid,
        allow;
    await userService.FindUserByName(name)
        .then(res => {
            uid = res[0].id
        })
    await userService.FindComment(commentId)
        .then(res => {
            if (res[0].uid != uid) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userService.DeleteComment(commentId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: '删除评论成功'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: '删除评论失败'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: '无权限'
        }
    }
}