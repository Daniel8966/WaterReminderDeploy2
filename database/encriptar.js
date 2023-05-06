import bycryptjs from 'bcryptjs';

export const encriptar = async(textoPlano) => {
    //hacer un hash de 10 al texto plano y devolver el hash
    const hash = await bycryptjs.hash(textoPlano, 10);
    return hash
}



export const comparar = async(passwordPlano , hashPassword)=>{
    return await bycryptjs.compare(passwordPlano, hashPassword)
}
