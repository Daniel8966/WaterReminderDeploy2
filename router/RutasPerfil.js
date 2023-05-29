import express, { query } from 'express';

import { comparar } from '../database/encriptar.js';
import { connection } from '../database/DatabaseConexion.js'

import manageSession from '../middlewares/sesiones.js';


const router = express.Router();


//mostrar Perfil ruta por defecto 
router.get('/', manageSession('Perfil'), (req, res, next) => {



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

        res.render('../views/perfil',
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


});

//Editar datos del perfil 

//vista formulario de edicion
router.get('/editarPerfil', manageSession('editar perfil'), (req, res, next) => {


    const idUsuario = req.session.idUsuario;

    const query = `select * from persona join usuario where  Usuario_idUsuario = idUsuario and idUsuario = ?  ;`
    connection.query(query, [idUsuario], (err, respuesta,) => {
        if (err) { throw err };

        //evaluar si es hombre o mujer 1, 2
        let sexo = respuesta[0].Sexo_idsexo;
        if (sexo == 1) {
            sexo = 'hombre'
        } else if (sexo == 2) {
            sexo = 'mujer'
        }

        res.render('Editar',
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

});

router.post('/actualizarPerfil', manageSession('actualizar datos perfil'), async (req, res, next) => {
    //en esta ruta haremos que el usaurio actualize sus datos en la base de datos 

    const idUsuario = req.session.idUsuario
    const nombre = req.body.name;
    const correo = req.body.correo;
    const password = req.body.pass;
    const peso = parseInt(req.body.peso);
    const altura = req.body.altura;
    const edad = req.body.edad;
    const meta_agua = req.session.meta
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;

    const Actividad_fisica = req.body.actFisica;

    const query0 = `select password from usuario where idUsuario = ?   `;
    console.log('el usuario es: ' + idUsuario)
    connection.query(query0, [idUsuario], async (err, respuesta) => {
        if (err) {
            console.log(err)
            return res.redirect('/perfil')
        } else {
            console.log(respuesta[0].password)
            const checkPasswor = await comparar(password, respuesta[0].password)
            console.log(checkPasswor);

            if (checkPasswor) {
                console.log('las credenciales coinciden actualizando usuario')
                //aqui ya se comparo que la contraseña es correcta, actualizar los demas campos

                //Actualizar tabla usuario
                const query = `update  usuario set Usuario  = ? , email = ?  where idUsuario = ?   `;
                connection.query(query, [nombre, correo, idUsuario], async (err, respuesta) => {
                    if (err) {
                        return res.status(500).send('error las credenciales no coinciden')
                        throw err;

                    }
                })

                //actualizar persona
                const query2 = `update persona set peso = ?, altura = ? , edad = ? , meta_agua = ? , hora_desp = ? , hora_dormir= ? , Actividad_fisica = ? where Usuario_idUsuario = ?   `;
                connection.query(query2, [peso, altura, edad, meta_agua, hora_desp, hora_dormir, Actividad_fisica, idUsuario], async (err, respuesta) => {
                    if (err) {
                        throw err;

                    } else {

                        if (req.session.admin) { res.redirect('/admin/perfilAdmin') } else {
                            res.redirect('/perfil')
                        }

                        console.log('tabla usuario actualizada con exito')


                    }

                })



            } else {
                res.redirect('/perfil')
            }
        }
    })







});

router.post('/actualizarPassword', manageSession('actualizar password'), async (req, res, next) => {
    //en esta ruta haremos que el usaurio actualize su contrasena en la base de datos 

    const idUsuario = req.session.idUsuario
    const nombre = req.body.name;
    const correo = req.body.correo;
    const password = req.body.pass;
    const peso = parseInt(req.body.peso);
    const altura = req.body.altura;
    const edad = req.body.edad;
    const meta_agua = req.session.meta
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;

    const Actividad_fisica = req.body.actFisica;

    const query0 = `select password from usuario where idUsuario = ?   `;
    console.log('el usuario es: ' + idUsuario)
    connection.query(query0, [idUsuario], async (err, respuesta) => {
        if (err) {
            console.log(err)
            return res.redirect('/perfil')
        } else {
            console.log(respuesta[0].password)
            const checkPasswor = await comparar(password, respuesta[0].password)
            console.log(checkPasswor);

            if (checkPasswor) {
                console.log('las credenciales coinciden actualizando usuario')
                //aqui ya se comparo que la contraseña es correcta, actualizar los demas campos

                //Actualizar tabla usuario
                const query = `update  usuario set Usuario  = ? , email = ?  where idUsuario = ?   `;
                connection.query(query, [nombre, correo, idUsuario], async (err, respuesta) => {
                    if (err) {
                        return res.status(500).send('error las credenciales no coinciden')
                        throw err;

                    }
                })

                //actualizar persona
                const query2 = `update persona set peso = ?, altura = ? , edad = ? , meta_agua = ? , hora_desp = ? , hora_dormir= ? , Actividad_fisica = ? where Usuario_idUsuario = ?   `;
                connection.query(query2, [peso, altura, edad, meta_agua, hora_desp, hora_dormir, Actividad_fisica, idUsuario], async (err, respuesta) => {
                    if (err) {
                        throw err;

                    } else {

                        console.log('tabla usuario actualizada con exito')
                        res.redirect('/perfil')

                    }

                })



            } else {
                res.redirect('/perfil')
            }
        }
    })







});


export default router;