
import express, { query } from 'express';
const router = express.Router();
import {connection} from '../database/DatabaseConexion.js'
import manageSession from './sesiones.js';


//------RUTAS DE LAS PAGINAS------
router.get('/', manageSession('admin usuarios'), async (req, res) => {
    if (req.session.admin) {
        const query = `select idUsuario, Usuario, email from usuario;`
        connection.query( query , async (err, respuesta, fields) => {
            if (err) return console.log("Error", err);

            res.render('administrador', {usuarios : respuesta} )

      })
        
    }else{
        res.redirect('/login')
    }

})



router.get('/perfilAdmin', (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        res.render('perfil_admin')
    }

})




export default router;

