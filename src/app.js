require("./config/config");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
var MemoryStore = require("memorystore")(session);

const dirPublic = path.join(__dirname, "../public");
const dirNode_modules = path.join(__dirname, "../node_modules");

app.use(express.static(dirPublic));
app.use("/js", express.static(dirNode_modules + "/jquery/dist"));
app.use("/js", express.static(dirNode_modules + "/popper.js/dist"));

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 
    }),
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use((req, res, next) => {
  if (req.session.usuario) {
    res.locals.nombre = req.session.nombre;
    res.locals.aspirante = req.session.aspirante;
    res.locals.coordinador = req.session.coordinador;
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("./routes/index"));


mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true },
  (err, resultado) => {
    if (err) {
      return console.log(err);
    }
    console.log("Conectado");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Servidor en el puerto " + process.env.PORT);
});
