import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
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
					name:user.name,
					role:user.role
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
			
			return User.findOneAndUpdate({_id: req.user._id},{$set:req.body},{new:true, projection:{password:0}})
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

	forgotPassword(req,res) {
		let password_plain = this.randomPassword(5);
		let password = bcrypt.hashSync(password_plain, Number(process.env.BCRYPT_SALT))
		return User.findOneAndUpdate({email: req.query.email}, {$set:{password: password}},{new:true})
		.then((user)=>{
			if(user){
				var transport = nodemailer.createTransport({
					host: "smtp.mailtrap.io",
					port: 2525,
					auth: {
						user: "0fdb713272bf77",
						pass: "4ef5ddb4f34e8a"
					}
				})
	
				transport.sendMail({
					from:'"CM Solidaria" <5ed6572605-30d32a@inbox.mailtrap.io>',
					to:user.email,
					subject:'Esqueceu a Senha',
					text: `Sua nova senha é: ${password_plain}`
				}, (err,data)=>{
					if(err){
						return console.log(err);
						
					}
					console.log(data);
					// res.send();
				})
			}

			res.send();
		})
	}


 	randomPassword(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
			 result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
 }
}

export default UserController;
