import express, { Router } from 'express';
import { body, validationResult } from 'express-validator';
import OcurrenceController from '../controllers/ocurrenceController';
import middleware from '../middlewares/middleware';


const router = express.Router();
const ocurrenceController = new OcurrenceController();

router.post(
  '/', middleware.middleware,
  [
    body('description').isString().isLength({min: 1}),
    body('type').isString().isIn(['assalto',
    'agressao',
    'covid',
    'perturbacao',
    'homicidio',
    'atividade_suspeita',
    'acidente',
    'desaparecimento',
    'animal_perdido']),
    body('zip_code').isString().isLength({min: 1}),
    body('city').isString().isLength({min: 1}),
    body('ocurred_at').isNumeric(),
    body('neighborhood').isString().isLength({min: 1}),
    body('street').isString().isLength({min: 1}),
    body('number').isNumeric(),
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
    body('anonymous').isBoolean()
  ],
  async (req,res)=>{
    if(!validationResult(req).isEmpty()){
      console.log(+ validationResult(req).mapped());  
      console.log(validationResult(req));  
      let errors  = [];
      await validationResult(req).array({onlyFirstError:true}).map((item=>  errors.push(item.param)));
      errors = errors.join(', ');
      return res.status(400).send({error:`Campos obrigatórios não preenchidos: ${errors}` });
    }else{
    
      ocurrenceController.post(req,res);
    }
  }
)

router.get('/',
    middleware.middleware,
    (req,res)=>{
      ocurrenceController.get(req,res)
    }
)

export default router;