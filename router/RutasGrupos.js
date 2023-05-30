import express from 'express';
const router = express.Router();
import manageSession from '../middlewares/sesiones.js';
import { connection } from '../database/DatabaseConexion.js'

//obtener la lista de grupos a los que pertenece el usuario
router.get('/', manageSession('grupos lista'), (req, res, next) => {

    //Aqui el codigo de la ruta 
    console.log('Sesion existente - grupos')
    var idPersona = req.session.idPersona;
    var query = String("select persona_has_cgrupos.cgrupos_idcgrupos as 'codigo1', cgrupos.idcgrupos as 'codigo2', persona_has_cgrupos.persona_idPersona as 'idPersona' , cgrupos.Nombre_Grupo as 'nombreGrupo' from persona_has_cgrupos Inner join cgrupos	on persona_has_cgrupos.cgrupos_idcgrupos = cgrupos.idcgrupos where persona_has_cgrupos.persona_idPersona = ?; ")
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

    //consultar un grupo al que el usuario ya se a unido, establecer permisos de administrador y salir
    //consultar meta de agua de cada usuarios y porcentaje con respecto al consumo por dia 


    //primero obtener la fecha de hoy esto nos servira para la query

    const fechaActual = new Date();

    const formatoFecha = (fecha) => {
        const year = fecha.getFullYear();
        const month = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
        const day = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
        //regresar un string con formato desiado
        return `${year}-${month}-${day}`;
    }

    formatoFecha(fechaActual);


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
        "cgrupos_idcgrupos as 'idGrupo', " +
        "Nombre_Grupo as 'Nombre_Grupo' " +

        "from usuario u " +
        "inner join persona p " +
        "on u.idUsuario = p.Usuario_idUsuario " +
        "inner join persona_has_cgrupos pg " +
        "on p.idPersona = pg.persona_idPersona " +
        "inner join cgrupos g " +
        "on pg.cgrupos_idcgrupos = g.idcgrupos where g.idcgrupos = ? ;")
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


                const consumos = [];

                //esta funcion nos ayuda a obtener la suma de los consumos diarios de cada usuario  
                //con base a la respuesta que es un array de la consulta anterior
                
                const obtenerConsumos = async (respuesta) => {
                    for (let i = 0; i < respuesta.length; i++) {
                        console.log('valor de i es igual a: ' + i);

                        const query = `SELECT SUM(Consumo_total) AS sumaConsumo, Persona_idPersona AS idPersona FROM consumo_Agua WHERE fecha = ? AND Persona_idPersona = ? GROUP BY Persona_idPersona`;

                        const idPersona = respuesta[i].idPersona;


                        try {
                            const respuestadois = await new Promise((resolve, reject) => {
                                connection.query(query, [fechaActual, idPersona], (error2, result) => {
                                    if (error2) {
                                        console.log("error al seleccionar" + error2);
                                        reject(error2);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });

                            if (respuestadois.length > 0) {
                                consumos.push(respuestadois[0].sumaConsumo);
                            } else {
                                consumos.push(0);
                            }
                        } catch (error) {
                            console.log("error en la consulta: " + error);
                            throw error;
                        }
                    }

                    console.log('los consumos son: ' + consumos);

                    console.log('el id del admin es: ' + admin)
                    if (req.session.idPersona == admin) {
                        console.log('el usuario' + nombre + ' es admin');
                        let admon = 1;

                        res.render('grupo', { respuesta: respuesta, consumos: consumos, codigo, nombreGrupo, admon, nombre })

                    } else {
                        console.log('el usuario' + nombre + ' no  es admin');
                        let admon = 0;
                        res.render('grupo', { respuesta: respuesta, consumos: consumos, codigo, nombreGrupo, admon, nombre })
                    }



                };
                console.log('los siguen siendo' + consumos);

                obtenerConsumos(respuesta);

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
    connection.query('INSERT INTO cgrupos SET ?', { idcgrupos: idCgrupo, Nombre_Grupo: nombreGrupo, estadoGrupo: 0, adminID: idPersona }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {

            //obtener el codigo generado
            connection.query("SELECT LAST_INSERT_ID() as 'idcgrupos' ", (error, respuesta, field) => {
                console.log("el identificador del grupo es : " + respuesta[0].idcgrupos)
                var codigo = respuesta[0].idcgrupos;

                //relacionar la persona con el grupo en

                connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, cgrupos_idcgrupos: codigo }, async (error, results) => {
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
    connection.query('select  * from persona_has_cgrupos where cgrupos_idcgrupos = ' + codigo + '', (error, results) => {
        if (error) throw error;
        try {
            var integrante = results[0].persona_idPersona;
            console.log('el integrante es: ' + integrante)

            if (idPersona === integrante) {
                console.log('la persona ya esta en el grupo')
                res.redirect('/grupos')
            } else {

                //Relacionar person y grupo
                connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, cgrupos_idcgrupos: codigo }, async (error, results) => {
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
    connection.query('delete from persona_has_cgrupos where cgrupos_idcgrupos = ?;', [idCgrupo], async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('grupo borrado de tabla relacional con exito')
        }
    })

    //-borrar de grupos
    connection.query('delete from cgrupos where idcgrupos = ?;', [idCgrupo], async (error, results) => {
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

    connection.query('delete from persona_has_cgrupos where cgrupos_idcgrupos = ? and persona_idPersona = ? ;', [idCgrupo, idPersona], async (error, results) => {
        if (error) {
            console.log(error);
        } else {


            console.log('persona salio del grupo con exito')

        }

    })
    res.redirect('/grupos');

});



export default router;
