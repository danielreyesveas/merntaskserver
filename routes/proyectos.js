const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');

// api/proyectos

// Crear proyecto
router.post('/',
    auth, 
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// Obtener todos los proyectos
router.get('/',
    auth, 
    proyectoController.obtenerProyectos
);

// Actualizar proyecto vía ID
router.put('/:id',
    auth, 
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Eliminar proyecto vía ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;