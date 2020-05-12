const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTarea = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }  

    try {
        // Extraer el proyecto y comprobar que existe
        const { proyecto } = request.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return response.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Creamos la tarea
        const tarea = new Tarea(request.body);
        await tarea.save();

        response.json({ tarea });

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }

}

// Obtiene todas las tareas por usuario y proyecto actual
exports.obtenerTareas = async (request, response) => {
    try {
        // Extraer el proyecto y comprobar que existe
        const { proyecto } = request.query;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return response.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

        response.json({ tareas });
    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}

// Actualizar una tarea
exports.actualizarTarea = async (request, response) => {
    // Revisar si hay errores
    const errores = validationResult(request);
    if(!errores.isEmpty()){
        return response.status(400).json({ errores: errores.array() });
    }  

    try {
        // Extraer el proyecto y comprobar que existe la tarea
        const { proyecto, nombre, estado } = request.body;
        
        let tarea = await Tarea.findById(request.params.id);
        if(!tarea){
            return response.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Crear objeto con la nueva información
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        
        // Guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: request.params.id }, nuevaTarea, { new: true });

        response.json({ tarea });

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }

}

// Elimina una tarea por su ID
exports.eliminarTarea = async (request, response) => {
    try {
        // Extraer el proyecto y comprobar que existe la tarea
        const { proyecto } = request.query;
        
        let tarea = await Tarea.findById(request.params.id);
        if(!tarea){
            return response.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({ msg: 'No Autorizado'});
        }

        // Eliminar
        await Tarea.findOneAndRemove({ _id: request.params.id });

        response.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
        response.status(500).send('Hubo un error');
    }
}