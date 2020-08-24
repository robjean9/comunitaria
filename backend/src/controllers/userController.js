import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
class UserController {
	async post(req, res) {
		let user = await User.findOne({ email: req.body.email });
		if (user) {
			res.status(409).send();
		} else {
			req.body.password = bcrypt.hashSync(req.body.password, Number(process.env.BCRYPT_SALT))
			return await User.create(req.body)
				.then((user) => {
					if (user) {
						return res.status(201).send();
					} else {
						console.log(user);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	async auth(req, res) {
		let user = await User.findOne({ email: req.body.email });
		if (user) {
			let password = bcrypt.compareSync(req.body.password, user.password);
			if (password) {
				let token = jwt.sign({
					_id:user._id,
					name:user.name
				},process.env.JWT_SECRET,{algorithm:"HS256"}); 
				res.send({token});
			} else {
				res.status(401).send();
			}
		} else {
			res.status(401).send();
		}
	}

	async me(req,res){
		let user = await User.findOne({_id: req.user._id},{password:0,__v:0})
		if(user){
			res.send(user);
		}
	}

	 put(req, res) {
		try{
			if(req.body.password != "" && req.body.password != undefined && req.body != null){
				req.body.password = bcrypt.hashSync(req.body.password, Number(process.env.BCRYPT_SALT))
			}else{
				delete req.body.password;
			}
			delete req.body.email;
			delete req.body._id;
			
			return User.findOneAndUpdate({_id: req.user._id},{$set:req.body})
				.then((user) => {
						return res.status(200).send(user);
					
				})
				.catch((err) => {
					console.log(err);
				});
			}catch(err){
				res.status(400).send();
				console.log(err);
			}
	}
}

export default UserController;
