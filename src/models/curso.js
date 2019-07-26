const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const cursoSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  modalidad: {
    type: String,
    required: false,
    default: "_"
  },
  intHoraria: {
    type: String,
    required: false,
    default: "_"
  },
  estado: {
    type: String,
    required: true,
    default: "disponible"
  }
});
cursoSchema.plugin(uniqueValidator);
const Curso = mongoose.model("Curso", cursoSchema);
module.exports = Curso;