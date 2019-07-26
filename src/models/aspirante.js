const mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const aspiranteSchema = new Schema({
  cedula: {
    type: String,
    required: true
  },
  id: {
    type: String, 
    required: true,
    unique: true
  },
  id_curso: {
    type: String,
    required: true,
  },
  nombre: {
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
  }
});
aspiranteSchema.plugin(uniqueValidator);
const Aspirante = mongoose.model("Aspirante", aspiranteSchema);
module.exports = Aspirante;
