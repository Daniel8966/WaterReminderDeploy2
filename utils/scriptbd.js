//aqui pondre un archivo que ejecute la base de datos con registro y todo


//en este programa haremos una funcion que haga una query para sql de la base de datos en el 
//proyecto para tener registros que mostrar 
//runable : node utils/scriptbd.js



function generarRegistros(idPersona) {

    var fecha = new Date();
    var anio = fecha.getFullYear();
    var mes = (fecha.getMonth() + 1);
    var dia = parseInt(fecha.getDate());


    if (dia <= 0) {
        mes -= 1;
        fecha.setDate(0); // Establecer fecha al último día del mes anterior
        dia = fecha.getDate() + dia;
    }

    var querygrandota = 'insert into consumo_agua values';



    for (let i = 0; i < 7; i++) {
        var fechaFormal = `${anio}-${mes}-${dia - i}`;
        var randomConsumo = Math.trunc(Math.random() * (200, 1500));


        if (i == 6) {
            querygrandota += ` (null, ${randomConsumo}, '${fechaFormal}' , ${idPersona} , 1 ,1) \n`
        }
        else {
            querygrandota += ` (null, ${randomConsumo}, '${fechaFormal}' , ${idPersona} , 1 ,1), \n`
        }
    }
    return (querygrandota += `;`);

}

console.log(generarRegistros('4'))