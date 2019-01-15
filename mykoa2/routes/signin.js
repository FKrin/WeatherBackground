const router = require("koa-router")()
const controller=require('../controllers/signin')


router.prefix('/signin')

router.post('/',controller.postSignin)

module.exports=router