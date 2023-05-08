
import express from 'express';
const router = express.Router();
import manageSession from './sesiones.js';
import { connection } from '../database/DatabaseConexion.js'


//GRAFICA SEMANAL
router.get('/', manageSession('grafica- semanal'), (req, res, next) => {
    //en este apartado se hace la grafica de registros de agua semanal


    const idPersona = req.session.idPersona;

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



    let query0 = `SELECT todas_las_fechas.Fecha, COALESCE(SUM(consumo_agua.Consumo_Total), 0) as suma_consumo
        FROM (
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha UNION ALL
            SELECT ? as Fecha
        ) todas_las_fechas
        LEFT JOIN consumo_agua ON todas_las_fechas.Fecha = consumo_agua.Fecha AND consumo_agua.Persona_idPersona = ?
        GROUP BY todas_las_fechas.Fecha
        ORDER BY todas_las_fechas.Fecha Asc
        ;
        `
    const fechas = [formatoFecha(fechaActual),
    formatoFecha(ayer),
    formatoFecha(antier),
    formatoFecha(hace3Dias),
    formatoFecha(hace4Dias),
    formatoFecha(hace5Dias),
    formatoFecha(hace6Dias),
    formatoFecha(hace7Dias)]

    connection.query(query0, [fechas[0],
    fechas[1],
    fechas[2],
    fechas[3],
    fechas[4],
    fechas[5],
    fechas[6],
        idPersona
    ], (error, results0) => {
        if (error) throw error;
        let promedio = (parseInt(results0[0].suma_consumo)
            + parseInt(results0[1].suma_consumo)
            + parseInt(results0[2].suma_consumo)
            + parseInt(results0[3].suma_consumo)
            + parseInt(results0[4].suma_consumo)
            + parseInt(results0[5].suma_consumo)
            + parseInt(results0[6].suma_consumo)) / 7;

        const numeros = {};
        for (let i = 0; i < results0.length; i++) {
            numeros[`numero${i + 1}`] = results0[i].suma_consumo;
        }

        const [numero1, numero2, numero3, numero4, numero5, numero6, numero7] = results0.map(({ suma_consumo }) => suma_consumo);

        res.render('graficaSeamana', {
            numero1,
            numero2,
            numero3,
            numero4,
            numero5,
            numero6,
            numero7,
            promedio: Math.trunc(promedio),
            meta: req.session.meta
        });



    })
});

//GRAFICA MENSUAL
router.get('/regAguaMes', manageSession('grafica - mensual'), (req, res, next) => {

    const fechaHora = new Date();
    const anio = fechaHora.getFullYear()
    var mes = (parseInt(fechaHora.getMonth()) + 1)
    const dia = (parseInt(fechaHora.getDate()))
    const idPersona = req.session.idPersona;


    let sum0, sum1, sum2 = 0;

    var query0 = `SELECT SUM(Consumo_Total) as sumita FROM consumo_agua WHERE MONTH(Fecha) = (${mes}) and Persona_idPersona = ${idPersona}`
    connection.query(query0, (error, results) => {
        if (error) throw error;
        console.log(query0)
        console.log('---------------caso: ' + 0 + "-------------")
        console.log(`fecha: ${anio}-${mes}-${dia}`)

        sum0 = results[0].sumita;
        console.log('caso 0: ' + sum0);
        var mes1 = (parseInt(fechaHora.getMonth()))
        var query1 = `SELECT SUM(Consumo_Total) as sumita FROM consumo_agua WHERE MONTH(Fecha) = (${mes1}) and Persona_idPersona = ${idPersona}`

        connection.query(query1, (error, results) => {
            if (error) throw error;
            console.log(query1)
            console.log('---------------caso: ' + 1 + "-------------")
            console.log(`fecha: ${anio}-${mes}-${dia}`)

            sum1 = results[0].sumita;
            console.log('caso 0: ' + sum1);
            var mes2 = (parseInt(fechaHora.getMonth()) - 1)
            var query2 = `SELECT SUM(Consumo_Total) as sumita FROM consumo_agua WHERE MONTH(Fecha) = (${mes2}) and Persona_idPersona = ${idPersona}`

            connection.query(query2, (error, results) => {
                if (error) throw error;
                console.log(query2)
                console.log('---------------caso: ' + 2 + "-------------")
                console.log(`fecha: ${anio}-${mes}-${dia}`)
                sum2 = results[0].sumita;
                console.log('caso 0: ' + sum2);
                res.render('graficaMes', { sum0, sum1, sum2, meta: req.session.meta, promedio: 1 })
            })

        })

    })

});




export default router;

 //se hace el import en app.js
 //luego por ejemplo ruta/ejemplo para establecer diferentes respuestas de un mismo router

