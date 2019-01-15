const router = require("koa-router")()
const controller=require('../controllers/signup')


router.prefix('/signup')

router.post('/',controller.postSignup)
router.post('/changepass',controller.changePass)
router.post('/changeavator',controller.changeAvator)
router.post('/changesummary',controller.changeSummary)

module.exports=router