
import express, { query } from 'express';
const router = express.Router();
import {connection} from '../database/DatabaseConexion.js'



//------RUTAS DE LAS PAGINAS------
router.get('/',  async (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        const query = `select idUsuario, Usuario, email from usuario;`
        connection.query( query , async (err, respuesta, fields) => {
            if (err) return console.log("Error", err);

            res.render('administrador', {usuarios : respuesta} )

      })
        
    }

})



router.get('/perfilAdmin', (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        res.render('perfil_admin')
    }

})




export default router;

