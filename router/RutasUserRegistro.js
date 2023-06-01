//Aqui pondremos los dos metodos del usuario registrarse

import express from 'express';
const router = express.Router();
import { connection } from '../database/DatabaseConexion.js'
import { encriptar } from '../database/encriptar.js'



router.post('/', async (req, res, next) => {
    const nombre = req.body.name;
    const email = req.body.correo;
    const password = req.body.pass;
    const peso = parseInt(req.body.peso);
    const altura = req.body.altura;
    const edad = req.body.edad;
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;
    const Actividad_fisica = req.body.actFisica;
    let sexo = req.body.sexo;
    const privilegio = 1;

    if (sexo == 'Hombre') {
        sexo = 1;
    } else if (sexo == 'Mujer') {
        sexo = 2;
    } else {
        console.log('valores cambiados en el sexo;')
        console.log('el email ya esta registrado')
        return res.redirect('/registrarse', '404', { mensaje: false })
    }
    
    //Calcular la nueva meta de agua con base a los nuevos parametros
    function calcularMeta(peso, altura, actividad) {


        if (sexo == '1') {
            let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
            let consumoPeso = peso * 35;
            let consumoTiempo = (actividad * 5 * 0.0175 * peso * 1.3)
            let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);


            console.log(`Debes tomar ${consumoIdeal}`)
            return Math.trunc(consumoIdeal);

        } else if (sexo  == '2') {
            let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
            let consumoPeso = peso * 33;
            let consumoTiempo = (actividad * 4 * 0.0175 * peso * 1)
            let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);

            console.log(`Debes tomar ${consumoIdeal}`)
            return Math.trunc(consumoIdeal);
        }

    }

    const meta_agua = calcularMeta(peso, altura, Actividad_fisica);
    Math.trunc(meta_agua);

    

    //Aqui se encripta la contraseña
    const passwordHash = await encriptar(password);

    //comprobar si un usuario ya existe en la base de datos 

    const query1 = `select email from usuario where email = ? `;
    connection.query(query1, [email], async (error, respuesta) => {
        if (error) {
            console.log(error)
            res.status('500')
            res.render('registrar', { mensaje: false })

        }
        if (respuesta.length > 0) {
            console.log('el email ya esta registrado')
            return res.render('registrar', { mensaje: true })

        } else {
            //si no esta registrado, registrar al nuevo usuario : 
            connection.query('INSERT INTO usuario SET ?', { Usuario: nombre, Password: passwordHash, email: email, telefono: 0, Sesion: 0 }, async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Usuario Registrado con exito')


                    connection.query('select idUsuario from usuario where email = ? and Password = ? ', [email, passwordHash], async (error, results) => {
                        if (error) return console.log("Error", error)

                        var idUsuario = 0;
                        idUsuario = results[0].idUsuario;
                        console.log('el id recuperado' + results[0].idUsuario)


                        connection.query('INSERT INTO persona SET ?', {
                            peso: peso,
                            altura: altura,
                            edad: edad,
                            meta_agua: meta_agua,
                            hora_desp: hora_desp,
                            hora_dormir: hora_dormir,
                            Actividad_fisica: parseInt(Actividad_fisica),
                            Sexo_idsexo: parseInt(sexo),
                            Privilegio_idPrivilegio: parseInt(privilegio),
                            Usuario_idUsuario: idUsuario
                        }, async (error, results) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Persona Registrada con exito')
                                res.redirect('/login')
                            }
                        })


                    })

                }

            })



        }

    })





});





export default router;

 //se hace el import en app.js
 //luego por ejemplo ruta/ejemplo para establecer diferentes respuestas de un mismo router

