
import express from 'express';
const router = express.Router();


//------RUTAS DE LAS PAGINAS------
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-HOME')
        res.render('index', {
            login: true,
            name: req.session.Usuario

        })
    } else {
        console.log('NO hay sesion activa')
        res.render('index', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//REGISTRO DE USUARIO--
router.get('/registrarse', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        res.redirect('/home')
    } else {
        console.log('NO hay sesion activa-Registro')
        res.render('registrar', {
            login: false,
            name: 'Inicie Sesion',
            //mensaje en caso de que el usuario ya este registrado
            mensaje: false
        })
    }
})
//INICIO DE SESION--
router.get('/login', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        res.redirect('/home')
    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})

export default router;

