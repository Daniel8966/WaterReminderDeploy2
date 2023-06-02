
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

    const query = `SELECT  idUsuario, idPersona, Usuario, meta_agua,  email FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario where persona.Privilegio_idPrivilegio = 1; `
    connection.query(query, async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);

        res.render('Administrador', { usuarios: respuesta })
    })

})

router.post('/registros', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {

    const idPersona = req.body.idPersona

    console.log('poniendo registros aleaotrios en: ' + idPersona)

    function generarRegistros(idPersona) {

        // Obtenemos la fecha actual
        const fechaActual = new Date();

        // Creamos un objeto Date para ayer
        const ayer = new Date(fechaActual);
        ayer.setDate(fechaActual.getDate() - 1);

        // Creamos un objeto Date para antier
        const antier = new Date(fechaActual);
        antier.setDate(fechaActual.getDate() - 2);

        // Creamos un objeto Date para hace 3 días
        const hace3Dias = new Date(fechaActual);
        hace3Dias.setDate(fechaActual.getDate() - 3);

        // Creamos un objeto Date para hace 4 días
        const hace4Dias = new Date(fechaActual);
        hace4Dias.setDate(fechaActual.getDate() - 4);

        // Creamos un objeto Date para hace 5 días
        const hace5Dias = new Date(fechaActual);
        hace5Dias.setDate(fechaActual.getDate() - 5);

        // Creamos un objeto Date para hace 6 días
        const hace6Dias = new Date(fechaActual);
        hace6Dias.setDate(fechaActual.getDate() - 6);

        // Creamos un objeto Date para hace 7 días
        const hace7Dias = new Date(fechaActual);
        hace7Dias.setDate(fechaActual.getDate() - 7);

        // Formateamos las fechas en formato YYYY-MM-DD
        const formatoFecha = (fecha) => {
            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
            const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
            //regresar un string con formato desiado
            return `${year}-${month}-${day}`;
        }

        const fechas = [formatoFecha(fechaActual),
        formatoFecha(ayer),
        formatoFecha(antier),
        formatoFecha(hace3Dias),
        formatoFecha(hace4Dias),
        formatoFecha(hace5Dias),
        formatoFecha(hace6Dias),
        formatoFecha(hace7Dias)]




        var querygrandota = 'insert into consumo_agua values';



        for (let i = 0; i < 7; i++) {

            var randomConsumo = Math.trunc(Math.random() * (200, 1500));




            if (i == 6) {
                querygrandota += `(null, ${randomConsumo}, 0,  '${fechas[i]}' , ${idPersona} , 1 ,1) \n`
            }
            else {
                querygrandota += `(null, ${randomConsumo}, 0,  '${fechas[i]}' , ${idPersona} , 1 ,1), \n`
            }


        }
        return (querygrandota += `;`);

    }

    const query = generarRegistros(idPersona)
    console.log(query)
    connection.query(query, async (err, respuesta, fields) => {
        if (err) return console.log("Error", err);

        res.redirect('/admin')
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

