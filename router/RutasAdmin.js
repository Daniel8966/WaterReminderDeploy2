
import express, { query } from 'express';
const router = express.Router();
import { connection } from '../database/DatabaseConexion.js'
import manageSession from './sesiones.js';

function sesionAdmin(nombre) {
    return function (req, res, next) {
        if (req.session.admin) {
            console.log('Sesion de admin en ' + nombre)
            next();
        } else {
            res.redirect('/login')
            console.log('no hay sesion activa como admin')

        }

    }
}


//------RUTAS DE LAS PAGINAS------
router.get('/', sesionAdmin('admin usuarios'), manageSession('admin usuarios'), async (req, res) => {

    const query = `select idUsuario, Usuario, email from usuario;`
    connection.query(query, async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);

        res.render('administrador', { usuarios: respuesta })
    })

})



router.get('/perfilAdmin', sesionAdmin('perfil admin '), manageSession('perfil admin'), (req, res) => {
    
    const idUsuario = req.session.idUsuario;

    const query = `select * from persona join usuario where   Usuario_idUsuario =  idUsuario and idUsuario = ?  ;`
    connection.query(query, [idUsuario], (err, respuesta,) => {
        if (err) { throw err };

        //evaluar si es hombre o mujer 1, 2
        let sexo = respuesta[0].Sexo_idsexo;
        if (sexo == 1) {
            sexo = 'hombre'
        } else if (sexo == 2) {
            sexo = 'mujer'
        }

        res.render('perfil_admin',
            {
                nombre: respuesta[0].Usuario,
                sexo: sexo,
                email: respuesta[0].email,
                telefono: +52,
                edad: respuesta[0].edad,
                altura: respuesta[0].altura,
                peso: respuesta[0].peso,
                horaDormir: respuesta[0].hora_dormir,
                horaDespertar: respuesta[0].hora_desp,
                actFisica: respuesta[0].Actividad_fisica
            })
    })
    


})




export default router;

