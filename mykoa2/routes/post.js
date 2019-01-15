const router = require("koa-router")()
const controller=require('../controllers/post')

router.prefix('/post')

router.get('/posts',controller.getPostsPage)//文章
router.get('/userposts',controller.postUserPostsPage)//用户文章
router.get('/singleposts',controller.getSinglePosts)//文章详情

router.post('/create',controller.postCreate)//创建文章
router.post('/comment',controller.postComment)//评论
router.post('/zan',controller.postZan)//点赞
router.post('/delete',controller.postDeletePost)//删除文章
router.post('/deletecomment',controller.postDeleteComment)//删除评论
module.exports=router