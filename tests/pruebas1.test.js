import express from 'express';
const router = express.Router();
//import manageSession from '../middlewares/sesiones.js';
import assert from 'assert';
import request from 'supertest'
import app from '../app.js';




//utilizar manageSession como middleware usa un string para el nombre de la pagina

describe('Update User Route', () => {
    it('should update the user', (done) => {
        const body = {
            nombre: 'John Doe',
            correo: 'john@example.com',
            idUsuario: 1
        };

        // Utilizar supertest para simular una solicitud HTTP POST a la ruta /updateUser
        request(app)
            .post('/updateUser')
            .send(body)
            .expect(302) // Verificar el código de estado de la respuesta (redirección)
            .end((err, res) => {
                if (err) return done(err);
                // Verificar que se haya redirigido a la ruta '/admin'
                assert.strictEqual(res.headers.location, '/admin');
                done();
            });
    });
});



export default router;