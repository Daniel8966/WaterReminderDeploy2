import express from 'express';
const router = express.Router();
import manageSession from './sesiones.js';
import { connection } from '../database/DatabaseConexion.js'

//obtener la lista de grupos a los que pertenece el usuario
router.get('/', manageSession('grupos lista'), (req, res, next) => {

    //Aqui el codigo de la ruta 
    console.log('Sesion existente - grupos')
    var idPersona = req.session.idPersona;
    var query = String("select persona_has_cgrupos.CGrupos_idCGrupos as 'codigo1', CGrupos.idcGrupos as 'codigo2', persona_has_cgrupos.persona_idPersona as 'idPersona' , CGrupos.Nombre_Grupo as 'nombreGrupo' from persona_has_cgrupos Inner join CGrupos	on persona_has_cgrupos.CGrupos_idCGrupos = CGrupos.idCGrupos where persona_has_cgrupos.persona_idPersona = ?; ")
    connection.query(query, [idPersona], (error, respuesta) => {
        if (error) {
            console.log("errror al seleccionar" + error);
            throw error;
        } else {
            //console.log(respuesta[0].Persona_Grupoid);
            res.render('grupos', { respuesta: respuesta })
        }
    })

});

//consultar un grupo y sus participantes
router.get('/grupo/:idGrupo', manageSession('grupo - participantes'), (req, res, next) => {



    const idGrupo = req.params.idGrupo;
    console.log(idGrupo)
    const nombre = req.session.nombre;
    const query = String("select " +
        "idUsuario as 'idUsuario', " +
        "idPersona as 'idPersona', " +
        "adminID as 'admin', " +
        "Usuario as 'nombre', " +
        "email as 'email', " +
        "meta_agua as 'meta_agua', " +
        "CGrupos_idCGrupos as 'idGrupo', " +
        "Nombre_Grupo as 'Nombre_Grupo' " +

        "from usuario u " +
        "inner join persona p " +
        "on u.idUsuario = p.Usuario_idUsuario " +
        "inner join persona_has_cgrupos pg " +
        "on p.idPersona = pg.persona_idPersona " +
        "inner join CGrupos g " +
        "on pg.CGrupos_idCGrupos = g.idCGrupos where g.idCGrupos = ? ;")
    try {
        connection.query(query, [idGrupo], (error, respuesta) => {
            if (error) {
                console.log("errror al seleccionar" + error);
                throw error;
            } else {
                //comprobar si el usuario es admin o usuario

                //Obtener datos de la query
                var admin = respuesta[0].admin;
                var codigo = respuesta[0].idGrupo;
                var nombreGrupo = respuesta[0].Nombre_Grupo;

                console.log('el id del admin es: ' + admin)
                if (req.session.idPersona == admin) {
                    console.log('el usuario' + nombre + ' es admin');
                    var admon = 1;
                    res.render('grupo', { respuesta: respuesta, codigo, nombreGrupo, admon, nombre })
                } else {
                    console.log('el usuario' + nombre + ' no  es admin');
                    var admon = 0;
                    res.render('grupo', { respuesta: respuesta, codigo, nombreGrupo, admon, nombre })
                }


            }
        })
    } catch (error) {
        console.log(error)
        res.redirect('/grupos')
    }

});

//crear un grupo
router.post('/crearGrupo', manageSession('grupos - crear'), (req, res, next) => {


    var nombreGrupo = req.body.nombreGrupo;
    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = null;

    //insertar en grupos
    connection.query('INSERT INTO CGrupos SET ?', { idCgrupos: idCgrupo, Nombre_Grupo: nombreGrupo, estadoGrupo: 0, adminID: idPersona }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {

            //obtener el codigo generado
            connection.query("SELECT LAST_INSERT_ID() as 'idCgrupos' ", (error, respuesta, field) => {
                console.log("el identificador del grupo es : " + respuesta[0].idCgrupos)
                var codigo = respuesta[0].idCgrupos;

                //relacionar la persona con el grupo en

                connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Usuario y grupo conectados con exito')

                    }

                })


            })

            res.redirect('/grupos')
            console.log('grupo Registrado con exito')
        }

    })


});

router.post('/unirseGrupo', manageSession('unirse a grupo'), (req, res, next) => {


    //codigo con el q se une
    var codigo = req.body.codigo;

    //obtener esta id de la sesion
    var idPersona = req.session.idPersona;

    //Validar q la persona no este en el grupo
    connection.query('select  * from persona_has_cgrupos where CGrupos_idCGrupos = ' + codigo + '', (error, results) => {
        if (error) throw error;
        try {
            var integrante = results[0].persona_idPersona;
            console.log('el integrante es: ' + integrante)

            if (idPersona === integrante) {
                console.log('la persona ya esta en el grupo')
                res.redirect('/grupos')
            } else {

                //Relacionar person y grupo
                connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Usuario y grupo relacionados con exito')
                        res.redirect('/grupos')
                    }

                })
            }

        } catch (error) {
            console.log(error)
            res.redirect('/grupos')
        }
    })


});

router.post('/borrarGrupo', manageSession('borrar grupo'), (req, res, next) => {

    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = req.body.codigo;
    console.log('idGrupo:' + idCgrupo)
    //borrar en tabla relacional
    connection.query('delete from persona_has_cgrupos where CGrupos_idCGrupos = ?;', [idCgrupo], async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('grupo borrado de tabla relacional con exito')
        }
    })

    //-borrar de grupos
    connection.query('delete from CGrupos where idCGrupos = ?;', [idCgrupo], async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('grupo borrado con exito')
        }
    })
    res.redirect('/grupos');

});

router.post('/salirGrupo', manageSession('salir grupo'), (req, res, next) => {


    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = req.body.codigo;

    console.log('el id de la persona que se quiere salir es: ' + idPersona)

    connection.query('delete from persona_has_cgrupos where CGrupos_idCGrupos = ? and persona_idPersona = ? ;', [idCgrupo, idPersona], async (error, results) => {
        if (error) {
            console.log(error);
        } else {


            console.log('persona salio del grupo con exito')

        }

    })
    res.redirect('/grupos');

});



export default router;
