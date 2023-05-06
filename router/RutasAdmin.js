
import express from 'express';
const router = express.Router();


//------RUTAS DE LAS PAGINAS------
router.get('/', (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        res.render('administrador')
    }

})

router.get('/Pruebas', (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        res.render('pruebas')
    }

})

router.get('/perfilAdmin', (req, res) => {
    if (req.session.loggedin && req.session.admin) {
        res.render('perfil_admin')
    }

})




export default router;

