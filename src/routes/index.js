const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const dirViews = path.join(__dirname, "../../templates/views");
const dirPartials = path.join(__dirname, "../../templates/partials");
const Usuario = require("../../src/models/usuario");
const Curso = require("../../src/models/curso");
const Aspirante = require("../models/aspirante");
const bcrypt = require("bcrypt");

require("./../helpers/helpers");

app.set("view engine", "hbs");
app.set("views", dirViews);
hbs.registerPartials(dirPartials);

app.get("/", (req, res) => {
  res.render("index", {
    titulo: "Inicio"
  });
});

app.get("/registrarse", (req, res) => {
  res.render("registrarse", {
    titulo: "Registrarse"
  });
});

app.post("/", (req, res) => {
  let usuario = new Usuario({
    cedula: req.body.cedula,
    nombre: req.body.nombre,
    contraseña: bcrypt.hashSync(req.body.contraseña, 10),
    correo: req.body.correo,
    telefono: req.body.telefono,
    rol: req.body.rol
  });
  usuario.save((err, resultado) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }
    res.render("resultado", {
      mostrar: "Bienvenido " + resultado.nombre,
      mensaje: " Ya estas registrado en nuestra plataforma"
    });
  });
});

app.post("/ingresar", (req, res) => {
  Usuario.findOne({ nombre: req.body.nombre }, (err, resultado) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }
    if (!resultado) {
      return res.render("error", {
        mostrar: "Usuario no encontrado",
        mensaje: "Ingrese los datos correctos para poder ingresar"
      });
    }
    if (!bcrypt.compareSync(req.body.contraseña, resultado.contraseña)) {
      return res.render("resultado", {
        mostrar: "Contraseña incorrecta",
        mensaje: "Ingrese los datos correctos para poder ingresar"
      });
    }
    req.session.usuario = resultado._id;
    req.session.nomre = resultado.nombre;
    req.session.aspirante = false;
    req.session.coordinador = false;

    if (resultado.rol === "aspirante") {
      req.session.aspirante = true;
    } else {
      req.session.coordinador = true;
    }

    res.render("resultado", {
      mostrar: "Bienvenido " + resultado.nombre,
      mensaje: "Puedes realizar las operaciones segun tu rol",
      aspirante: req.session.aspirante,
      coordinador: req.session.coordinador
    });
  });
});

app.get("/agregar", (req, res) => {
  res.render("agregar", {
    titulo: "Añadir nuevo curso"
  });
});

app.post("/agregar", (req, res) => {
  let curso = new Curso({
    id: req.body.id,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    modalidad: req.body.modalidad,
    valor: req.body.valor,
    intHoraria: req.body.intHoraria
  });
  curso.save((err, resultado) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }
    res.render("resultado", {
      mostrar: "El curso " + resultado.nombre,
      mensaje: "Fue registrado con exito en nuestro sistema"
    });
  });
});

app.get("/vercursos", (req, res) => {
  Curso.find({ estado: "disponible" }, (err, respuesta) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }

    res.render("vercursos", {
      titulo: "Ver Cursos",
      listado: respuesta
    });
  });
});

app.get("/inscribirse", (req, res) => {
  let cursos;
  Curso.find({ estado: "disponible" }, (err, resultado) => {
    if (err) {
      return console.log(err);
    }
    cursos = resultado;
  });

  Usuario.findById(req.session.usuario, (err, usuario) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }

    if (!usuario) {
      return res.render("error", {
        mostrar: "Problema de autentificación"
      });
    }
    res.render("inscribirse", {
      listado: cursos,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono
    });
  });
});

app.post("/inscribirse", (req, res) => {
  let regaspirante = new Aspirante({
    id: req.body.id + req.body.cedula,
    id_curso: req.body.id,
    cedula: req.body.cedula,
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    correo: req.body.correo
  });
  regaspirante.save((err, resultado) => {
    if (err) {
      return res.render("resultado", {
        mostrar: "NO PUEDE INSCRIBIRSE EN ESTE CURSO",
        mensaje: "Parece que ya estas resgistrado en este curso"
      });
    }
    res.render("resultado", {
      mostrar: resultado.nombre + " REGISTRADO CON EXITO",
      mensaje: "Fuiste registrado con exito en nuestro curso"
    });
  });
});

app.get("/ver", (req, res) => {
  let aspirantes;
  Aspirante.find({}, (err, resultado) => {
    if (err) {
      res.render("error", {
        mostrar: err
      });
    }
    aspirantes = resultado;
  });
  Curso.find({ estado: "disponible" }, (err, respuesta) => {
    if (err) {
      return res.render("error", {
        mostrar: err
      });
    }

    res.render("ver", {
      titulo: "Ver Cursos Disponibles",
      listado: respuesta,
      aspirantes: aspirantes
    });
  });
});

app.post("/eliminaraspirante", (req, res) => {
  Aspirante.findOneAndDelete(
    { id: req.body.eliminar },
    req.body,
    (err, resultado) => {
      if (err) {
        return res.render("error", {
          mostrar: err
        });
      }
      if (!resultado) {
        return res.render("resultado", {
          mostrar: "No se puede borrar",
          mensaje: "Parece que el usuario que intenta eliminar no existe"
        });
      }
      res.redirect("/ver");
    }
  );
});

app.post("/cerrarcurso", (req,res)=> {
  Curso.findOneAndUpdate(
    { id: req.body.cerrar },
    {estado :"Cerrado"},
    { new: true, runValidators: true, context: "query" },
    (err, resultados) => {
      if (err) {
        return res.render("error", {
          mostrar:err
        });
      }
      res.redirect("/ver");
    }
  );	
});

app.get("/salir", (req, res) => {
  req.session.destroy(err => {
    if (err) return console.log(err);
  });
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.render("error", {
    mostrar: "Pagina no encontrada"
  });
});

module.exports = app;
