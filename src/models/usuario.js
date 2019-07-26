const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const usuarioSchema = new Schema({
  cedula: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  contraseña: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  telefono: {
    type: Number,
    require: true
  },
  rol: {
    type: String,
    required: true,
    default: "aspirante"
  }
});
usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;