const router = require("koa-router")()
const controller=require('../controllers/signout')

router.prefix('/signout')

router.get('/', controller.signOut)

module.exports=router