import express from 'express';
const router = express.Router();
import manageSession from '../middlewares/sesiones.js';
import { connection } from '../database/DatabaseConexion.js'
import { PORT } from '../configENV.js';
import ping from 'ping'
import axios from 'axios'

router.get('/', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {


    res.render('pruebas', { mensaje: false })


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


async function verificarEstado() {
    let status;
    try {
        const response = await axios.get('http://localhost:3150/pruebas/systemStatus');
        if (response.status === 200 && response.data === 'En línea') {
            console.log('El proyecto está en linea');
            return status = `El proyecto esta en linea`;
        } else {
            console.log('El proyecto no esta en linea');
            return status = `El proyecto no esta en linea`;
        }
    } catch (error) {
        console.error('Error al verificar el estado del proyecto', error);

        return error;

    }
    return status;

}



router.get('/checkStatus', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {
    let status = await verificarEstado();
    const host = 'localhost';
    ping.promise.probe(host, { port: PORT, timeout: 10 })

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
                let resultadosPrueba = [status,packetInfoStr2[0], minTime, maxtime, Promedio, mensaje]

                res.render('pruebas', { mensaje: resultadosPrueba})
            } else {
                console.log(`${host}:3150 está fuera de línea`);
                res.render('pruebas', { mensaje: 'sistema fuera de linea' })
            }
        })
        .catch((error) => {
            console.error(`Error al hacer ping a ${host}:3150`, error);
        });

})


export default router;