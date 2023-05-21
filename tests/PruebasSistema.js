import express from 'express';
const router = express.Router();
import manageSession from '../middlewares/sesiones.js';
import { connection } from '../database/DatabaseConexion.js'
import { PORT } from '../configENV.js';


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

router.get('/systemSatus', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {
    res.status(200).send('En línea');
})


async function verificarEstado() {
    try {
        const response = await axios.get('http://localhost:3150/status');
        if (response.status === 200 && response.data === 'En línea') {
            console.log('El proyecto está en línea');
        } else {
            console.log('El proyecto no está en línea');
        }
    } catch (error) {
        console.error('Error al verificar el estado del proyecto', error);
    }
}



router.get('/checkStatus', sesionAdmin('admin pruebas'), manageSession('admin pruebas'), async (req, res) => {
    verificarEstado();
    const host = 'localhost';
    ping.promise.probe(host, { port: PORT, timeout: 10 })

        .then((result) => {
            if (result.alive) {
                console.log(`${host}:3150 está en línea`);
                res.render('pruebas', { mensaje: `sistemas operando en puerto${PORT}` })
            } else {
                console.log(`${host}:3150 está fuera de línea`);
                res.render('pruebas', { mensaje: 'amogus' })
            }
        })
        .catch((error) => {
            console.error(`Error al hacer ping a ${host}:3150`, error);
        });




})


export default router;