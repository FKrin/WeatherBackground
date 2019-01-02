const router = require("koa-router")()
const userService = require('../controllers/mysqlConfig')


router.prefix('/users')

router.get('/',async(ctx,next)=>{
	ctx.body=await userService.findAllUser();
})


router.post('/add', async(ctx,next)=>{
	let arr=[];

	arr.push(ctx.request.body['name']);
	arr.push(ctx.request['pass']);
	arr.push(ctx.request['auth']);

	await userService.addUserData(arr)
	.then((data)=>{
		let r='';
		if(data.affectedRows!=0){
			r='ok';
		}
		ctx.body={
			data:r
		}
	}).catch(()=>{
		ctx.body={
			data:'err'
		}
	})
})

module.exports=router