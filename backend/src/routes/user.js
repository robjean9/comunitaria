import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import UserController from '../controllers/userController';
import middleware from '../middlewares/middleware';

const router = express.Router();
const userController = new UserController();

router.post(
	'/',
	[
		//validate fields
		body('name').isString().isLength({ min: 1 }),
		body('email').isEmail(),
		body('password').isString().isLength({ min: 1 }),
		body('zip_code').isString().isLength({ min: 1}),
		body('latitude').isNumeric(),
		body('longitude').isNumeric(),
		body('city').isString().isLength({ min: 1 }),
		body('neighborhood').isString().isLength({ min: 1 }),
		body('street').isString().isLength({ min: 1 }),
		body('number').isNumeric(),
		body('complement').isString().isLength({ min: 1 }),
		body('phone').isString().isLength({ min: 1 }),
	],
	(req, res) => {
		if (!validationResult(req).isEmpty()) {
			console.error(validationResult(req).mapped());
			return res
				.status(400)
				.send({ error: 'Campos obrigatórios não preenchidos' });
		} else {
			return userController.post(req, res);
		}
	}
);


router.put(
	'/',middleware.middleware,
	[
		//validate fields
		body('name').isString().isLength({ min: 1 }),
		body('zip_code').isString().isLength({ min: 1 }),
		body('latitude').isNumeric(),
		body('longitude').isNumeric(),
		body('city').isString().isLength({ min: 1 }),
		body('neighborhood').isString().isLength({ min: 1 }),
		body('street').isString().isLength({ min: 1 }),
		body('number').isNumeric(),
		body('complement').isString().isLength({ min: 1 }),
		body('phone').isString().isLength({ min: 1 }),
	],
	(req, res) => {
		if (!validationResult(req).isEmpty()) {
			console.error(validationResult(req).mapped());
			return res
				.status(400)
				.send({ error: 'Campos obrigatórios não preenchidos' });
		} else {
			return userController.put(req, res);
		}
	}
);



export default router;
