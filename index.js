const UMBRAL_STOCK = 3; // Cantidad mínima de cualquier camisa para no mostrar alerta de stock bajo
const IMG_DEFAULT = "default.png";

let inventario = [
  {
    id: 1,
    equipo: "Real Madrid",
    talla: "M",
    color: "Blanco",
    cantidad: 2,
    precio: 180000,
    imagen: "realMadrid.webp",
  },
  {
    id: 2,
    equipo: "Barcelona",
    talla: "L",
    color: "Azulgrana",
    cantidad: 8,
    precio: 180000,
    imagen: "barcelona.webp",
  },
  {
    id: 3,
    equipo: "Colombia",
    talla: "S",
    color: "Amarillo",
    cantidad: 2,
    precio: 150000,
    imagen: "colombia.webp",
  },
  {
    id: 4,
    equipo: "Manchester City",
    talla: "XL",
    color: "Celeste",
    cantidad: 5,
    precio: 190000,
    imagen: "ManCity.webp",
  },
  {
    id: 5,
    equipo: "Bayern Munich",
    talla: "M",
    color: "Rojo",
    cantidad: 5,
    precio: 170000,
    imagen: "Bayern.webp",
  },
  {
    id: 6,
    equipo: "Juventus",
    talla: "L",
    color: "Negro/Blanco",
    cantidad: 3,
    precio: 160000,
    imagen: "juventus.webp",
  },
  {
    id: 7,
    equipo: "Argentina",
    talla: "XL",
    color: "Celeste/Blanco",
    cantidad: 8,
    precio: 180000,
    imagen: "argentina.webp",
  },
  {
    id: 8,
    equipo: "Brasil",
    talla: "S",
    color: "Amarillo",
    cantidad: 2,
    precio: 150000,
    imagen: "brasil.webp",
  },
];

// Dom
const grid = document.getElementById("camisasGrid");
const searchInput = document.getElementById("searchInput");
const modalForm = document.getElementById("modalForm");
const modalAlertas = document.getElementById("modalAlertas");
const alertasBody = document.getElementById("alertasBody");

//Renderizado

function render() {
  const q = searchInput.value.toLowerCase(); //Esto permite buscar camisas por nombre
  const lista = inventario.filter((c) => c.equipo.toLowerCase().includes(q)); //Esto filtra las camisas por nombre

  if (!lista.length) {
    grid.innerHTML = '<p class="empty">No se encontraron resultados</p>';
    return;
  }

  grid.innerHTML = lista
    .map((c) => {
      const img = c.imagen.startsWith("data:")
        ? c.imagen
        : `../img/${c.imagen}`;
      const badge =
        c.cantidad < UMBRAL_STOCK
          ? `<span class="badge badge-low">⚠️ Stock bajo</span>`
          : `<span class="badge badge-ok">✅ Disponible</span>`;

      return `
      <div class="card">
        <img class="card-img" src="${img}" alt="${c.equipo}" onerror="this.src='${IMG_DEFAULT}'" />
        <div class="card-body">
          <p class="card-team">${c.equipo}</p>
          <p class="card-info"> Talla: <strong>${c.talla}</strong></p>
          <p class="card-info"> Color: <strong>${c.color}</strong></p>
          <p class="card-info"> $${c.precio.toLocaleString()}</p>
          <p class="card-info"> Cantidad: <strong>${c.cantidad}</strong></p>
          ${badge}
        </div>
        <div class="card-footer">
          <button class="btn-edit" onclick="abrirModal('edit', ${c.id})"> Editar</button>
        </div>
      </div>
    `;
    })
    .join("");
}

// --- Validación de campos ---
const SQL_PATTERN =
  /\b(select|insert|update|delete|drop|alter|create|truncate|exec|union|from|where|--)\b/i;

function tieneSql(valor) {
  return SQL_PATTERN.test(valor);
}

function mostrarError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function limpiarErrores() {
  ["errEquipo", "errTalla", "errColor", "errCantidad", "errPrecio"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = "";
    },
  );
}
function validarFormulario() {
  limpiarErrores();
  let valido = true;
  const equipo = document.getElementById("fEquipo").value.trim();
  const talla = document.getElementById("fTalla").value.trim();
  const color = document.getElementById("fColor").value.trim();
  const cantidadRaw = document.getElementById("fCantidad").value.trim();
  const precioRaw = document.getElementById("fPrecio").value.trim();

  // Equipo
  if (!equipo) {
    mostrarError("errEquipo", "El nombre del equipo es obligatorio.");
    valido = false;
  } else if (equipo.length < 2) {
    mostrarError("errEquipo", "Mínimo 2 caracteres.");
    valido = false;
  } else if (tieneSql(equipo)) {
    mostrarError("errEquipo", "El texto contiene palabras no permitidas.");
    valido = false;
  }

  // Talla
  if (!talla) {
    mostrarError("errTalla", "Selecciona una talla.");
    valido = false;
  }

  // Color
  if (!color) {
    mostrarError("errColor", "El color es obligatorio.");
    valido = false;
  } else if (tieneSql(color)) {
    mostrarError("errColor", "El texto contiene palabras no permitidas.");
    valido = false;
  }

  // Cantidad
  const cantidad = parseInt(cantidadRaw, 10);
  if (cantidadRaw === "" || isNaN(cantidad)) {
    mostrarError("errCantidad", "Ingresa una cantidad válida.");
    valido = false;
  } else if (cantidad < 0) {
    mostrarError("errCantidad", "La cantidad no puede ser negativa.");
    valido = false;
  }

  // Precio
  const precio = parseFloat(precioRaw);
  if (precioRaw === "" || isNaN(precio)) {
    mostrarError("errPrecio", "Ingresa un precio válido.");
    valido = false;
  } else if (precio <= 0) {
    mostrarError("errPrecio", "El precio debe ser mayor a 0.");
    valido = false;
  }

  return valido;
}

// --- Stepper de cantidad (botones +/−) ---
document.getElementById("btnMenos").addEventListener("click", () => {
  const input = document.getElementById("fCantidad");
  const val = parseInt(input.value, 10) || 0;
  if (val > 0) input.value = val - 1;
  mostrarError("errCantidad", "");
});
document.getElementById("btnMas").addEventListener("click", () => {
  const input = document.getElementById("fCantidad");
  const val = parseInt(input.value, 10) || 0;
  input.value = val + 1;
  mostrarError("errCantidad", "");
});
// Solo dígitos en cantidad y precio
document.getElementById("fCantidad").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});
document.getElementById("fPrecio").addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});
// Bloquear SQL en tiempo real en campos de texto
["fEquipo", "fColor"].forEach(function (fieldId) {
  document.getElementById(fieldId).addEventListener("input", function () {
    if (tieneSql(this.value)) {
      mostrarError(
        "err" + fieldId.charAt(1).toUpperCase() + fieldId.slice(2),
        "El texto contiene palabras no permitidas.",
      );
    } else {
      mostrarError(
        "err" + fieldId.charAt(1).toUpperCase() + fieldId.slice(2),
        "",
      );
    }
  });
});

// Agregar o editar camisa
function abrirModal(modo, id = null) {
  limpiarErrores();
  document.getElementById("modalTitulo").textContent =
    modo === "add" ? " Agregar camisa" : " Editar camisa";

  if (modo === "edit") {
    const c = inventario.find((x) => x.id === id);
    document.getElementById("fEquipo").value = c.equipo;
    document.getElementById("fTalla").value = c.talla;
    document.getElementById("fColor").value = c.color;
    document.getElementById("fCantidad").value = c.cantidad;
    document.getElementById("fPrecio").value = c.precio;
    document.getElementById("fId").value = c.id;
  } else {
    ["fEquipo", "fColor", "fCantidad", "fPrecio", "fId"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("fTalla").value = "";
    document.getElementById("fImagen").value = "";
  }
  modalForm.classList.add("open");
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove("open");
}

// Leer imagen como Base64
function leerImagen(input) {
  return new Promise((resolve) => {
    const file = input.files[0];
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// Guardar (crear o editar)
document.getElementById("btnGuardar").addEventListener("click", async () => {
  if (!validarFormulario()) return;
  const imagen = await leerImagen(document.getElementById("fImagen"));
  const id = document.getElementById("fId").value;

  const datos = {
    equipo: document.getElementById("fEquipo").value.trim(),
    talla: document.getElementById("fTalla").value.trim(),
    color: document.getElementById("fColor").value.trim(),
    cantidad: parseInt(document.getElementById("fCantidad").value) || 0,
    precio: parseFloat(document.getElementById("fPrecio").value) || 0,
  };
  if (imagen) datos.imagen = imagen;

  if (id) {
    const i = inventario.findIndex((c) => c.id == id);
    if (i !== -1) inventario[i] = { ...inventario[i], ...datos };
  } else {
    inventario.push({ id: Date.now(), imagen: "default.png", ...datos });
  }

  cerrarModal("modalForm");
  render();
});

// Alerta de stock bajo
document.getElementById("btnAlertas").addEventListener("click", () => {
  //Esto muestra una alerta con las camisas que tienen stock bajo (menos de 3 unidades)
  const bajos = inventario.filter((c) => c.cantidad < UMBRAL_STOCK);
  alertasBody.innerHTML = bajos.length
    ? bajos
        .map(
          (c) =>
            `<div class="alert-item"><strong>${c.equipo}</strong> — ${c.cantidad} unidad${c.cantidad !== 1 ? "es" : ""}</div>`,
        )
        .join("")
    : "<p style='color:#888;font-size:.9rem'>No hay alertas de stock bajo.</p>";

  modalAlertas.classList.add("open");
});

// Eventos
document
  .getElementById("btnAgregar")
  .addEventListener("click", () => abrirModal("add"));
document
  .getElementById("btnCerrarForm")
  .addEventListener("click", () => cerrarModal("modalForm"));
document
  .getElementById("btnCerrarAlertas")
  .addEventListener("click", () => cerrarModal("modalAlertas"));
searchInput.addEventListener("input", render);

// Inicializar
render();
