const hbs = require("hbs");


hbs.registerHelper("listar", listado => {
  let texto = `<table class='table table-striped table-hover'> 
  <thead class='thead-dark'>
    <th>Nombre</th><th>descripcion</th><th>valor</th></thead><tbody>`;
  listado.forEach(curso => {
    texto =
      texto +
      `<tr>
      <td>${curso.nombre}</td>
        <td>${curso.descripcion}</td>
        <td>${curso.valor}</td>
        </tr>`;
  });
  texto = texto + `</tbody></table>`;
  return texto;
});

hbs.registerHelper("listarcomplemento", listado => {
  let i = 1;
  let texto = '<div class="accordion" id="accordionExample">';
  listado.forEach(curso => {
    texto =
      texto +
      `<div class="card">
            <div class="card-header" id="heading${i}">
              <h2 class="mb-0">
                <button
                  class="btn btn-link"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapse${i}"
                  aria-expanded="true"
                  aria-controls="collapse${i}"
                >
                  ${curso.nombre}
                  </button>
              </h2>
            </div>

            <div
              id="collapse${i}"
              class="collapse"
              aria-labelledby="heading${i}"
              data-parent="#accordionExample"
            >
              <div class="card-body">
              Descripcion del curso: ${curso.descripcion} <br>
              Modalidad: ${curso.modalidad} <br>
              Valor: ${curso.valor} <br>
              Intensidad Horaria: ${curso.intHoraria}<br>
                </div>
            </div>
          </div>`;
    i = i + 1;
  });
  texto = texto + "</div>";
  return texto;
});

hbs.registerHelper("opciones", listado => {
  let texto = ` <select name="id" class="custom-select d-block w-100" id="modalidad" required="">
                    <option value="">...</option>`;
  if (!listado) {
    return texto;
  }
  listado.forEach(curso => {
    texto = texto + `<option value="${curso.id}">${curso.nombre}</option>`;
  });
  texto = texto + "</select>";
  return texto;
});

hbs.registerHelper("listar2", listado => {
  let texto = `<div class="card-body"><form action="/cerrarcurso" method="post"><table class='table table-striped table-hover'> 
  <thead class='thead-dark'>
    <th>Nombre</th><th>descripcion</th><th>valor</th><th>cerrar</th></thead><tbody>`;
  listado.forEach(curso => {
    texto =
      texto +
      `<tr>
      <td>${curso.nombre}</td>
        <td>${curso.descripcion}</td>
        <td>${curso.valor}</td>
        <td><button type="submit" name="cerrar" value="${curso.id}" class="btn btn-danger">Cerrar</button></td>
        </tr>`;
  });
  texto = texto + `</tbody></table></form>`;
  return texto;
});

hbs.registerHelper("listarcomplemento2", (listado, aspirantes) => {
  let i = 1;
  let texto = '<div class="accordion" id="accordionExample">';
  listado.forEach(curso => {
    texto =
      texto +
      `<div class="card">
            <div class="card-header" id="heading${i}">
              <h2 class="mb-0">
                <button
                  class="btn btn-link"
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapse${i}"
                  aria-expanded="true"
                  aria-controls="collapse${i}"
                >
                  ${curso.nombre}
                  </button>
              </h2>
            </div>

            <div
              id="collapse${i}"
              class="collapse"
              aria-labelledby="heading${i}"
              data-parent="#accordionExample"
            >
              <div class="card-body"><form action="/eliminaraspirante" method="post">
          <table class='table table-striped table-hover'> 
          <thead class='thead-dark'>
          <th>Nombre</th><th>Cedulta</th><th>Eliminar</th></thead><tbody>`;
    aspirantes.forEach(aspirante => {
      if (curso.id==aspirante.id_curso) {
        texto =
          texto +
          `<tr>
      <td>${aspirante.nombre}</td>
        <td>${aspirante.cedula}</td>
        <td><button type="submit" name="eliminar"  value="${
          aspirante.id
        }" class="btn btn-danger">Eliminar</button></td>
        </tr>`;
      }
    });
    texto = texto + `</tbody></table></form> </div></div></div>`;
    i = i + 1;
  });
  texto = texto + "</div>";
  return texto;
});
