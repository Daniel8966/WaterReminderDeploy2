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

                imgPerfilSexo: respuesta[0].Sexo_idsexo,
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


    let mensaje = req.query.mensaje;
    console.log(mensaje)

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
                mensaje : mensaje,
                imgPerfilSexo: respuesta[0].Sexo_idsexo,
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
    const email = req.body.correo;
    const password = req.body.pass;
    const peso = parseInt(req.body.peso);
    const altura = req.body.altura;
    const edad = req.body.edad;
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;
    let sexo = req.body.sexo;
    const Actividad_fisica = req.body.actFisica;


    

    //Calcular la nueva meta de agua con base a los nuevos parametros
    function calcularMeta(peso, altura, actividad) {


        if (sexo == 'hombre') {
            let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
            let consumoPeso = peso * 35;
            let consumoTiempo = (actividad * 5 * 0.0175 * peso * 1.3)
            let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);


            console.log(`Debes tomar ${consumoIdeal}`)
            return Math.trunc(consumoIdeal);

        } else if (sexo == 'mujer') {
            let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
            let consumoPeso = peso * 33;
            let consumoTiempo = (actividad * 4 * 0.0175 * peso * 1)
            let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);

            console.log(`Debes tomar ${consumoIdeal}`)
            return Math.trunc(consumoIdeal);
        }

    }

     // Validar campos vacíos
     if (!nombre || !email || !password || !peso || !altura || !edad || !hora_desp || !hora_dormir || !Actividad_fisica || !sexo) {
        return  res.redirect('/perfil/editarPerfil?mensaje= Todos los campos deben ser completados ')
    }

    // Validar caracteres especiales
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(nombre) || !regex.test(Actividad_fisica) || !regex.test(sexo) || !regex.test(peso.toString()) || !regex.test(altura)) {
        return  res.redirect('/perfil/editarPerfil?mensaje= Los campos contienen caracteres especiales no permitidos')
    }

    // Validar longitud de la contraseña
    if (password.length <= 3) {
        return  res.redirect('/perfil/editarPerfil?mensaje= La contraseña debe tener al menos 3 caracteres ' )
    }

    // Validar rangos de edad, peso y altura
    if (edad < 18 || edad > 80 || peso < 30 || peso > 250 || altura < 100 || altura > 250) {
        return  res.redirect('/perfil/editarPerfil?mensaje= Los valores ingresados para edad, peso o altura no son válidos')
    }

    // Validar sexo
    if (sexo !== 'Hombre' && sexo !== 'Mujer') {
        return  res.redirect('/perfil/editarPerfil?mensaje=El valor ingresado para el sexo no es válido')
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return  res.redirect('/perfil/editarPerfil?mensaje=El formato del correo electrónico no es válido')
    }

    if (sexo == 'Hombre') {
        sexo = 1;
    } else if (sexo == 'Mujer') {
        sexo = 2;
    } else {
        console.log('valores cambiados en el sexo;')
        return  res.redirect('/perfil/editarPerfil?mensaje=valores cambiados en el sexo;')
    }


    const meta_agua = calcularMeta(peso, altura, edad, Actividad_fisica);
    console.log('la nueva meta de agua es : ' + meta_agua)
    Math.trunc(meta_agua);

    const query0 = `select password from usuario where idUsuario = ?   `;
    console.log('el usuario es: ' + idUsuario)
    connection.query(query0, [idUsuario], async (err, respuesta) => {
        if (err) {
            console.log(err)
            return res.redirect('/perfil')
        } else {
            const checkPasswor = await comparar(password, respuesta[0].password)
            console.log(checkPasswor);

            if (checkPasswor) {
                console.log('las credenciales coinciden actualizando usuario')
                //aqui ya se comparo que la contraseña es correcta, actualizar los demas campos

                //Actualizar tabla usuario
                const query = `update  usuario set Usuario  = ? , email = ?  where idUsuario = ?   `;
                connection.query(query, [nombre, email, idUsuario], async (err, respuesta) => {
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
                        req.session.meta = meta_agua;

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