const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Crea un usuario
exports.crearUsuario = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }

    // Extraer email y password
    const { email, password } = request.body;

    try {
        // Validar usuario único
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return response.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario
        usuario = new Usuario(request.body);

        // Hash password
        const salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar
        await usuario.save();

        // Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // Una hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmaicón
            response.json({ token });
        });        

    } catch (error) {
        console.log(error);
        response.status(400).send('Hubo un error');
    }
}