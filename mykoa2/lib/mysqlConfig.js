var mysql = require('mysql')
var config = require('./default')

var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

let allServices = {
    query: function (sql, values) {
        return new Promise(async (resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })
    },
    //登录注册部分
    //查找用户
    FindUserByName: function (name) {
        let _sql = `select * from users where username="${name}";`
        return allServices.query(_sql)
    },
    //查找用户
    FindUserById: function (id) {
        let _sql = `select * from users where id="${id}";`
        return allServices.query(_sql)
    },
    //修改密码
    ChangePass:function(name,pass){
        let _sql=`update users set pass="${pass}" where username="${name}";`
        return allServices.query(_sql)
    },
    //修改头像
    ChangeAvator:function(name,avator){
        let _sql=`update users set avator="${avator}" where username="${name}";`
        return allServices.query(_sql)
    },
    //注册用户
    InsertUserData: (obj) => {
        let _sql = `insert into users set username=?,pass=?,avator=?,moment=?;`
        return allServices.query(_sql, obj)
    },
    //修改简介
    ChangeSummary:function(name,summary){
        let _sql=`update users set summary="${summary}" where username="${name}";`
        return allServices.query(_sql)
    },
    //删除用户
    DeleteUserData: function (name) {
        let _sql = `delete from users where username="${name};`
        return allServices.query(_sql)
    },
    //根据用户名查找用户数量判断是否已经存在
    FindDataCountByName: function (name) {
        let _sql = `select count(*) as count from users where username="${name}";`
        return allServices.query(_sql)
    },

    //查询文章部分
    //根据用户id查询某用户文章数量
    FindPostCountById: function (id) {
        let _sql = `select count(*) as count from posts where uid="${id}" and isdelete=0;`
        return allServices.query(_sql)
    },
    //根据用户id查询个人分页文章
    FindPostByUserPage: function (id, page) {
        let _sql = `select *from posts where uid="${id}" and isdelete=0 order by id desc limit ${(page-1)*10},10;`
        return allServices.query(_sql)
    },
    //查询所有文章数量
    FindAllPostCount: function () {
        let _sql = 'select count(*) as count from posts where isdelete=0;'
        return allServices.query(_sql)
    },
    //查询所有分页文章
    FindPostByPage: function (page) {
        let _sql = `select posts.*,users.username,users.avator from posts inner join users on posts.uid=users.id where isdelete=0 order by id desc limit ${(page-1)*10},10;`
        return allServices.query(_sql)
    },
    //查询文章是否被删除
    FindPostIsdeleteById:function(id){
       let _sql=`select isdelete from posts where id="${id}";`
       return allServices.query(_sql)
    },
    //查询文章详情
    FindDataById: function (id) {
        let _sql = `select * from posts where id="${id}";`
        return allServices.query(_sql)
    },
    //更新浏览数
    UpdatePostPv: function (id) {
        let _sql = `update posts set pv= pv + 1 where id="${id}";`
        return allServices.query(_sql)
    },
    //评论分页
    FindCommentByPostId: function (postId) {
        let _sql = `select comments.*,users.username,users.avator from comments inner join users on comments.uid=users.id where postid="${postId}" order by id desc;`
        return allServices.query(_sql)
    },
    //通过文章id查找评论
    FindCommentById: function (id) {
        let _sql = `select *from comments where postid="${id}";`
        return allServices.query(_sql)
    },
    //通过文章id查找评论数
    FindCommentCountById: function (id) {
        let _sql = `select count(*) as count from comments where postid="${id}";`
        return allServices.query(_sql)
    },
    //发表文章
    InsertPost: function (obj) {
        let _sql = `insert into posts set uid=?,content=?,picture=?,moment=?;`
        return allServices.query(_sql, obj)
    },
    //发表评论
    InsertComment: function (obj) {
        let _sql = `insert into comments set uid=?,postid=?,content=?,moment=?;`
        return allServices.query(_sql, obj)
    },
    //点赞
    AddZanCount:function(obj){
        let _sql=`insert into zan set uid=?,postid=?;`
        return allServices.query(_sql,obj)
    },
    //删除某文章所有评论
    DeleteAllPostComment: function (id) {
        let _sql = `update comments set isdelete=1 where postId=${id};`
        return allServices.query(_sql)
    },
    //查询文章评论数
    FindPostPv:function(id){
        let _sql=`select pv from posts where id="${id}";`
        return allServices.query(_sql)
    },
    //删除文章
    DeletePost: function (id) {
        let _sql = `update posts set isdelete=1 where id=${id};`
        return allServices.query(_sql)
    },
    //通过评论id查找评论
    FindComment: function (id) {
        let _sql = `select *from comments where id=${id};`
        return allServices.query(_sql)
    },
    //删除评论
    DeleteComment: function (id) {
        let _sql = `update comments set isdelete=1 where id=${id};`
        return allServices.query(_sql)
    },
    //查询是否已点赞
    FindIszanCount:function(uid,postid){
        let _sql=`select count(*) as count from zan where uid="${uid}" and postid="${postid}";`
        return allServices.query(_sql)
    },
    //查询点赞数
    FindZanCountByPostId:function(postid){
        let _sql=`select count(*) as count from zan where postid="${postid}";`
        return allServices.query(_sql)
    }
}

module.exports = allServices;