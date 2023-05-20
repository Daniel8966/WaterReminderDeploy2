
import express from 'express';
const router = express.Router();

import {exec} from 'child_process';

router.get('/', (req, res, next) => {
    exec('mocha test.js', function (error, stdout, stderr) {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error en el servidor');
        } else if (stderr) {
            console.error('Error:', stderr);
            res.status(500).send('Error en la prueba');
        } else {
            console.log('Resultado de la prueba:', stdout);
            res.send('Prueba exitosa');
        }
    });


});


export default router;
