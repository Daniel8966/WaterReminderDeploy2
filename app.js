//import de todo
import express, { Router } from 'express';

import { PORT } from './configENV.js';
import bodyParser from 'body-parser';
//------INVOCANDO BCRYPTJS------ (Seguridad)
import bycryptjs from 'bcryptjs';
//--------CONEXION A BASE DE DATOS---------
import { connection } from './database/DatabaseConexion.js'
//procesar variables dotenv del hosteo
import dotenv from 'dotenv';
//Resolver dirname
import { fileURLToPath } from 'url';
import path from 'path';
//OTRAS BEBIDAS--REFRESCOS
import rutasBebidas from './router/RutasBebidas.js'
//REGISTROS DE CONSUMO DE AGUA (GRAFICAS)
import rutasGraficas from './router/RutasGraficas.js'
//en este import se ponen ver grupos, participantes, crear grupo, unirse, salir, borrar grupos
import rutasGrupos from './router/RutasGrupos.js'
//HOME--CONFIRMAR CONSUMO DE AGUA Y TABLA DE CONSUMO
import rutasHome from './router/RutasHome.js'
//------RUTAS DE LAS PAGINAS------
//RUTA RAIZ
import rutasIndex from './router/RutasIndex.js'
//RUTAS DE PERFIL
import rutasPerfil from './router/RutasPerfil.js'
//BACK DE lOGIN DE USUARIO
import rutasUsuarioLogin from './router/RutasUserLogin.js'
//------BACK DE FUNCIONES DE REGISTRO E INICIO DE SESION------
//BACK DE REGISTRO DE USUARIO
import rutasUsuarioRegistro from './router/RutasUserRegistro.js'
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//Delcara la app con framework de express
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


dotenv.config({ path: './env/.env' })

//recursos de css 
app.use(express.static(path.join(__dirname, 'public')));
//------ESTABLECIENDO EL MOTOR DE PLANTILLAS EJS------
app.set('view engine', 'ejs');




//------VARS DE SESION

import crypto from 'crypto'
function generateSecretKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

const secretKey = generateSecretKey(32);

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

//CERRAR SESION
app.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        console.log('Sesion cerrada')
        res.redirect('/')

    })
})




app.use('/', rutasIndex)

app.use('/register', rutasUsuarioRegistro);

app.use('/auth', rutasUsuarioLogin);


app.use('/home', rutasHome);

//------BACK DE FUNCIONES DEL SISTEMA------


//Ruta de grafica semana por defecto, mes en el archivo
app.use('/regAgua', rutasGraficas);

//Ruta de refrescos
app.use('/refrescos', rutasBebidas);

app.use('/grupos', rutasGrupos);


app.use('/perfil', rutasPerfil);

import rutasAdmin from './router/RutasAdmin.js'
app.use('/admin', rutasAdmin)

import pruebasAdmin from './tests/PruebasSistema.js'
app.use('/pruebas', pruebasAdmin)



export default app;
//DEPLOY EN EL PUERTO
app.listen(PORT || 3150, (req, res) => {
    console.log('http:/localhost:' + PORT);

})

