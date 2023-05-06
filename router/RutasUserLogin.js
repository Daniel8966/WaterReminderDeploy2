//Aqui pondremos los dos metodos del usuario logearse y crear sesion

import express from 'express';
const router = express.Router();
import manageSession from './sesiones.js';
import { connection } from '../database/DatabaseConexion.js'
import { comparar, encriptar } from '../database/encriptar.js'


router.post('/', async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;



    //comprobar si un usuario ya existe en la base de datos 
    const query1 = `select email from usuario where email = ? `;
    connection.query(query1, [email], async (error, respuesta) => {
        if (error) {
            console.log(error)
            res.status('500')
            res.redirect('/login')
        }
        if (respuesta.length > 0) {
            console.log('el usuario si existe , procediendo a comparar:')

            if (email && password) {


                const query = `SELECT idPersona, Privilegio_idPrivilegio, Usuario, idUsuario, password FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario WHERE email= ? `
                connection.query(query, [email], async (error, respuesta, field) => {

                    if (error) {
                        res.status('404').redirect('/login');
                        throw error;

                    }

                    req.session.idPersona = respuesta[0].idPersona; //Guardando Id de persona en la sesion
                    req.session.nombre = respuesta[0].Usuario;
                    req.session.idUsuario = respuesta[0].idUsuario;
                    const checkPasswor = await comparar(password, respuesta[0].password)
                    if (checkPasswor) {

                            //ingreso de usuaori
                        if (respuesta[0].Privilegio_idPrivilegio == 1) {
                            console.log('ingreso de usuario')
                            console.log('las contraseñas coinciden')
                            console.log('Ingreso exitoso al sistema')
                            req.session.loggedin = true; //Creando la sesion
                            res.redirect('/home')
                            
                            //ingreso de admin
                        } else if (respuesta[0].Privilegio_idPrivilegio == 2) {
                            console.log('ingreso de admin')
                            console.log('las contraseñas coinciden')
                            console.log('Ingreso exitoso al sistema')
                            req.session.loggedin = true; //Creando la sesion
                            req.session.admin = true; //establecer permisos
                            res.redirect('/admin')

                        }


                    } else {
                        res.status('500')
                        res.redirect('/login')
                    }

                })



            } else {
                res.redirect('/login')
            }

        } else {
            res.redirect('/login')
            console.log('ese usuario no existe')
        }

    })


});

export default router;