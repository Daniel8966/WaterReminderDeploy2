
import express, { query } from 'express';
const router = express.Router();
import { connection } from '../database/DatabaseConexion.js'
import manageSession from '../middlewares/sesiones.js';
import ping from 'ping'

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

    const query = `SELECT  idUsuario, idPersona, Usuario,  email FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario where persona.Privilegio_idPrivilegio = 1; `
    connection.query(query, async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);

        res.render('Administrador', { usuarios: respuesta })
    })

})

router.post('/delUsuario', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {

    const idPersona = req.body.idPersona
    const idUsuario = req.body.idUsuario

    //borrar a los participantes del grupo que el usuario creo 
    const query1 = `DELETE t1.*
     FROM persona_has_cgrupos AS t1 
     INNER JOIN cgrupos AS t2
      ON t1. CGrupos_idCGrupos = t2.idCGrupos WHERE t2.adminID = ? ;`
    connection.query(query1, [idPersona], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
    })

    //Borrar grupos que el usuario creo
    const query2 = `delete from cgrupos where adminID = ?;`
    connection.query(query2, [idPersona], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
    })

    //Borrar los consumos del usuario 
    const query3 = `delete from consumo_agua where Persona_idPersona = ? ; `
    connection.query(query3, [idPersona], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
    })

    //Borrar a la persona 
    const query5 = `delete from persona where idPersona = ?`
    connection.query(query5, [idPersona], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
    })

    //Borrar el usuario 
    const query4 = `delete from usuario where idUsuario = ? `
    connection.query(query4, [idUsuario], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
        return res.redirect('/admin');
    })


})


router.post('/updateUser', sesionAdmin('admin update User'), manageSession('admin update user'), async (req, res) => {
    const nombre = req.body.nombre;
    const email = req.body.correo;
    const idUsuario = req.body.idUsuario
    console.log(idUsuario)

    const query4 = `update usuario set Usuario=?, email = ? where idUsuario = ? `
    connection.query(query4, [nombre, email, idUsuario], async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);
        return res.redirect(302, '/admin');
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

