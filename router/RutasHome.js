import { connection } from '../database/DatabaseConexion.js'
//rutas de home 
import express from 'express';
import manageSession   from '../middlewares/sesiones.js';
const router = express.Router();


//desplegar el vies de home 

router.get('/', manageSession('home'), (req, res, next) => {

    //BACK CONSUMO DE AGUA IDEAL
    connection.query(' SELECT Sexo_idsexo, peso,altura,edad,Actividad_fisica FROM persona WHERE idPersona= ? ', [req.session.idPersona], (error, results) => {
        if (error) throw error;
        req.session.peso = results[0].peso
        req.session.sexo = results[0].Sexo_idsexo
        req.session.altura = results[0].altura
        req.session.Actividad_fisica = results[0].Actividad_fisica
    })



    //BACK DE CONSUMO DE AGUA TOTAL
    connection.query('SELECT SUM(Consumo_Total) as Consumo_Total FROM consumo_agua WHERE Persona_idPersona =?', [req.session.idPersona], (error, results) => {
        if (error) throw error;
        req.session.consumoTotal = results[0].Consumo_Total
        console.log('consumo total de hoy: ' + results[0].Consumo_Total);
    })


    console.log('Sesion creada y existente-HOME')
    connection.query('SELECT * FROM consumo_agua WHERE Persona_idPersona=? ', [req.session.idPersona],   (error, results) => {
        if (error) throw error;

        function calcularMeta(peso, altura, actividad) {


            if (req.session.sexo == '1') {
                let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
                let consumoPeso = peso * 35;
                let consumoTiempo = (actividad * 5 * 0.0175 * peso * 1.3)
                let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);
    
    
                console.log(`Debes tomar ${consumoIdeal}`)
                return Math.trunc(consumoIdeal);
    
            } else if (req.session.sexo  == '2') {
                let consumITO = Math.sqrt(parseInt(peso) * parseInt(altura) / 3600) * 10
                let consumoPeso = peso * 33;
                let consumoTiempo = (actividad * 4 * 0.0175 * peso * 1)
                let consumoIdeal = parseFloat(consumITO) + + parseFloat(consumoPeso) + parseFloat(consumoTiempo);
    
                console.log(`Debes tomar ${consumoIdeal}`)
                return Math.trunc(consumoIdeal);
            }
    
        }

        req.session.meta = calcularMeta(req.session.peso, req.session.altura, req.session.Actividad_fisica)
        console.log(req.session.meta)

        res.render('home', { consumoUser: results, nombre: req.session.nombre, tuAgua: req.session.meta, totalAgua: req.session.consumoTotal })
    })


})

router.post('/addWater', manageSession('consumo de agua'), (req, res, next) => {

    const cantidad = req.body.taza;
    const fechaHora = new Date();
    const anio = fechaHora.getFullYear()
    const mes = (parseInt(fechaHora.getMonth()) + 1)
    const dia = (parseInt(fechaHora.getDate()));
    const azucar = 0;
    connection.query(`INSERT INTO consumo_agua VALUES (null ,${parseInt(cantidad)}, ${azucar} ,'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`, (err, respuesta, fields) => {
        if (err) return console.log("Error", err)

    })
    return res.redirect('/home');


});

router.post('/delWater/', manageSession('consumo de agua'), (req, res, next) => {

    const idRegistro = req.body.id
    connection.query('DELETE FROM consumo_agua WHERE idConsumo_Agua="' + idRegistro + '"', (err, respuesta, fields) => {
        if (err) return console.log("Error", err)
        return res.redirect('/home');
    })


});




export default router;