const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Autentica usuario
exports.autenticarUsuario = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }

    // Extraer email y password
    const { email, password } = request.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return response.status(400).json({ msg: 'El usuario no existe' });
        }

        // Revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return response.status(400).json({ msg: 'Password incorrecto' });
        }

        // Crear JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            // expiresIn: 3600 // Una hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmaicón
            response.json({ token });
        });   

    } catch (error) {
        console.log(error);
    }

}

// Obtiene el usuario autenticado
exports.usuarioAutenticado = async (request, response) => {
    try {
        const usuario = await Usuario.findById(request.usuario.id).select('-password');
        response.json({ usuario });
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}