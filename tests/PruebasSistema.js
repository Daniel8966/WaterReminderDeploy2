import express from 'express';
const router = express.Router();
import manageSession from '../middlewares/sesiones.js';
import { connection } from '../database/DatabaseConexion.js'
import { PORT, DB_NAME } from '../configENV.js';
import ping from 'ping'
import axios from 'axios'

router.get('/', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {


    res.render('Pruebas', { mensaje: false })


})


function sesionAdmin(nombre) {
    return function (req, res, next) {
        if (req.session.admin) {
            console.log('Sesion de admin en ' + nombre)
            next();
        } else {
            res.redirect('/login')
            console.log('no hay sesion activa como admin')

        }

    }
}

router.get('/systemStatus', async (req, res) => {
    res.status(200).send('En línea');
})


async function verificarEstado(host) {
    let status;
    try {
        const response = await axios.get(host);
        if (response.status === 200 && response.data === 'En línea') {
            console.log('El proyecto está en linea');
            return status = `El proyecto esta en linea`;
        } else {
            console.log('El proyecto no esta en linea');
            return status = `El proyecto no esta en linea`;
        }
    } catch (error) {
        console.error('Error al verificar el estado del proyecto', error);
        status = 'Error al verificar el estado del proyecto' + error
        return status;

    }
    return status;

}



router.get('/checkStatus', sesionAdmin('admin pruebas Status '), manageSession('admin pruebas'), async (req, res) => {

    //checar la ruta del system status
    let host1 = `https://waterreminderdeploy2-production.up.railway.app/pruebas/systemStatus`
    let status = await verificarEstado(host1);

    //hacer un ping al localhost
    const host = 'waterreminderdeploy2-production.up.railway.app';
    ping.promise.probe(host, { port: PORT, timeout: 5 })

        .then((result) => {
            if (result.alive) {

                let minTime = 'Tiempo mínimo:' + result.min;
                let maxtime = 'Tiempo máximo:' + result.max;
                let Promedio = 'Promedio de tiempo:' + result.avg;
                let mensaje = `sistemas operando en ${host}:${PORT}`



                //Obtener informacion de los paquetes que se enviaron para hacer el ping con result.otuput y dividir el string
                let packetInfo = result.output;
                let packetInfoStr1 = packetInfo.split('para 127.0.0.1:')
                let packetInfoStr2 = packetInfoStr1[1].split('Tiempos aproximados')

                //mandar todo como un array 
                let resultadosPrueba = [status, packetInfoStr2[0], minTime, maxtime, Promedio, mensaje]

                res.render('pruebas', { mensaje: resultadosPrueba })
            } else {

                let mensaje;
                if (status.includes('failed')) {
                    mensaje = `Error al hacer ping al dominio ${host}`
                } else {
                    mensaje = 'El dominio: ' + host + ' no admite pings aunque este en linea ';
                }
                let resultadosPrueba = [status, mensaje]
                res.render('pruebas', { mensaje: resultadosPrueba })
            }
        })
        .catch((error) => {
            console.error(`Error al hacer ping a ${host}:3150`, error);
        });

})


router.get('/checkStatusChat', sesionAdmin('admin pruebas Status chat'), manageSession('admin pruebas'), async (req, res) => {
    let hostChat = 'https://chatwr2-production.up.railway.app/systemStatus'
    let status = await verificarEstado(hostChat);

    const host = 'chatwr2-production.up.railway.app';
    let portChat = 3000;
    ping.promise.probe(host, { port: portChat, timeout: 5 })

        .then((result) => {
            if (result.alive) {

                let minTime = 'Tiempo mínimo:' + result.min;
                let maxtime = 'Tiempo máximo:' + result.max;
                let Promedio = 'Promedio de tiempo:' + result.avg;
                let mensaje = `sistemas operando en ${host}:${portChat}`



                //Obtener informacion de los paquetes que se enviaron para hacer el ping con result.otuput y dividir el string
                let packetInfo = result.output;
                let packetInfoStr1 = packetInfo.split('para 127.0.0.1:')
                let packetInfoStr2 = packetInfoStr1[1].split('Tiempos aproximados')

                //mandar todo como un array 
                let resultadosPrueba = [status, packetInfoStr2[0], minTime, maxtime, Promedio, mensaje]

                res.render('pruebas', { mensaje: resultadosPrueba })
            } else {

                let mensaje;
                if (status.includes('failed')) {
                    mensaje = `Error al hacer ping al dominio ${host}`
                } else {
                    mensaje = 'El dominio: ' + host + ' no admite pings aunque este en linea ';
                }
                let resultadosPrueba = [status, mensaje]
                res.render('pruebas', { mensaje: resultadosPrueba })
            }
        })
        .catch((error) => {
            console.error(`Error al hacer ping a ${host}:${portChat}`, error);
        });

})

router.get('/dbCheck', sesionAdmin('check base de datos'), manageSession('pruebas base de datos'), async (req, res) => {

    connection.connect((err) => {
        if (err) {
            console.error('Error de conexión:', err);
            let conexión = `Error de conexion a la base de datos: ${DB_NAME}`
            let resultadosPrueba = [conexión]
            res.render('pruebas', { mensaje: resultadosPrueba })
        }
        let conexión = `Conexión exitosa la base de datos: ${DB_NAME}`
        let resultadosPrueba = [conexión]
        res.render('pruebas', { mensaje: resultadosPrueba })
        console.log('Conexión exitosa a la base de datos.');
    });
})

export default router;