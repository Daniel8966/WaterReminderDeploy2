import express from 'express';
const router = express.Router();
import manageSession   from '../middlewares/sesiones.js';
import {connection} from '../database/DatabaseConexion.js'


//utilizar manageSession como middleware usa un string para el nombre de la pagina

router.get('/', manageSession('nombre de la pagina ') , (req, res, next) => {
  
         //Aqui el codigo de la ruta 
      
});


export default router;