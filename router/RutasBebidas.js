import { connection } from '../database/DatabaseConexion.js'
import express from 'express';
import manageSession from './sesiones.js';

const router = express.Router();




router.get('/', (req, res, next) => {
      if (manageSession(req, res, next, 'Refrescos')) {


            res.render('refrescos')
      }
});

router.get('/alcohol', (req, res, next) => {
      if (manageSession(req, res, next, 'Alcohol')) {
            res.render('alcohol')
      }
});

router.get('/energeticas', (req, res, next) => {
      if (manageSession(req, res, next, 'Bebidas Energeticas')) {
            res.render('Energeticas')
      }
});

router.get('/jugos', (req, res, next) => {
      if (manageSession(req, res, next, 'Jugos')) {
            res.render('jugos')
      }
});

router.post('/addSoda', (req, res, next) => {
      if (manageSession(req, res, next, 'home - bebidas')) {
            const consumo = req.body.cantidad;
            const agua = req.body.agua;
            const cantidad = (parseInt(consumo) * parseInt(agua))/200;
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

      }
});

router.post('/addAlcohol', (req, res, next) => {
      if (manageSession(req, res, next, 'alcohol - bebidas')) {
            const consumo = req.body.cantidad;
            const agua = req.body.agua;
            const cantidad = (parseInt(consumo) * parseInt(agua))/200;
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

      }
});

router.post('/addEnerjuice', (req, res, next) => {
      if (manageSession(req, res, next, 'alcohol - bebidas')) {
            const consumo = req.body.cantidad;
            const agua = req.body.agua;
            const cantidad = (parseInt(consumo) * parseInt(agua))/200;
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

      }
});


export default router;