const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea un proyecto
exports.crearProyecto = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(request.body);

        // Guardar el autor con JWT
        proyecto.creador = request.usuario.id;

        // Guardar el proyecto
        proyecto.save();

        response.json(proyecto);

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (request, response) => {
    try {
        const proyectos = await Proyecto.find({ creador: request.usuario.id }).sort({ creado: -1 });
        response.json({ proyectos });
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}

// Actualiza un proyect
exports.actualizarProyecto = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }

    // Extraer la información del proyecto
    const { nombre } = request.body;

    const nuevoProyecto = {};

    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);

        // Revisar que exista el proyecto
        if(!proyecto){
            return response.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar el creador
        if(proyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: request.params.id }, { $set: nuevoProyecto }, { new: true });

        response.json({ proyecto });

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }

}

// Elimina un proyecto por su ID
exports.eliminarProyecto = async (request, response) => {
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(request.params.id);

        // Revisar que exista el proyecto
        if(!proyecto){
            return response.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Verificar el creador
        if(proyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Eliminar
        await Proyecto.findOneAndRemove({ _id: request.params.id });

        response.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}