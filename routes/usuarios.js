// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');

// api/usuarios

// Crear un usuario
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser de 6 caracteres mínimo').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

module.exports = router;