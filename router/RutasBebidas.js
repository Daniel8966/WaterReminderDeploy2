import { connection } from '../database/DatabaseConexion.js'
import express from 'express';
import manageSession   from '../middlewares/sesiones.js';

const router = express.Router();


router.get('/', manageSession('refrescos'), (req, res, next) => {

      res.render('refrescos')
});

router.get('/alcohol', manageSession('alcohol'), (req, res, next) => {

      res.render('alcohol')

});

router.get('/energeticas', manageSession('energeticas'), (req, res, next) => {

      res.render('Energeticas')

});

router.get('/jugos', manageSession('jugos'), (req, res, next) => {

      res.render('jugos')

});

router.post('/addSoda', manageSession('home - bebidas'), (req, res, next) => {

      const consumo = req.body.cantidad;
      const agua = req.body.agua;
      const cantidad = (parseInt(consumo) * parseInt(agua)) / 200;
      const fechaHora = new Date();
      const anio = fechaHora.getFullYear()
      const mes = (parseInt(fechaHora.getMonth()) + 1)
      const dia = (parseInt(fechaHora.getDate()));
      console.log(`El agua es: ${parseInt(agua)}`)
      console.log(`La cant es: ${parseInt(cantidad)}`)
      connection.query(`INSERT INTO consumo_agua (Consumo_Total,Fecha,Persona_idPersona,datos_bebida_idRegistro_bebida,datos_bebida_CTipo_bebida_idCTipo_bebida) VALUES (${parseInt(cantidad)},'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`, (err, respuesta, fields) => {
            if (err) return console.log("Error", err)

      })
      return res.redirect('/home');


});

router.post('/addAlcohol', manageSession('alcohol - bebidas'), (req, res, next) => {

      const consumo = req.body.cantidad;
      const agua = req.body.agua;
      const cantidad = (parseInt(consumo) * parseInt(agua)) / 200;
      const fechaHora = new Date();
      const anio = fechaHora.getFullYear()
      const mes = (parseInt(fechaHora.getMonth()) + 1)
      const dia = (parseInt(fechaHora.getDate()));
      console.log(`El agua es: ${parseInt(agua)}`)
      console.log(`La cant es: ${parseInt(cantidad)}`)
      connection.query(`INSERT INTO consumo_agua (Consumo_Total,Fecha,Persona_idPersona,datos_bebida_idRegistro_bebida,datos_bebida_CTipo_bebida_idCTipo_bebida) VALUES (${parseInt(cantidad)},'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`, (err, respuesta, fields) => {
            if (err) return console.log("Error", err)

      })
      return res.redirect('/home');


});

router.post('/addEnerjuice', manageSession('energeticas - bebidas'), (req, res, next) => {

      const consumo = req.body.cantidad;
      const agua = req.body.agua;
      const cantidad = (parseInt(consumo) * parseInt(agua)) / 200;
      const fechaHora = new Date();
      const anio = fechaHora.getFullYear()
      const mes = (parseInt(fechaHora.getMonth()) + 1)
      const dia = (parseInt(fechaHora.getDate()));
      console.log(`El agua es: ${parseInt(agua)}`)
      console.log(`La cant es: ${parseInt(cantidad)}`)
      connection.query(`INSERT INTO consumo_agua (Consumo_Total,Fecha,Persona_idPersona,datos_bebida_idRegistro_bebida,datos_bebida_CTipo_bebida_idCTipo_bebida) VALUES (${parseInt(cantidad)},'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`, (err, respuesta, fields) => {
            if (err) return console.log("Error", err)

      })
      return res.redirect('/home');


});


export default router;