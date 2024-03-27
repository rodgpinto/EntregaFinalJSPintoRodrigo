function principal(burgers) {
    renderizarBurgers(burgers);
    renderizarCarrito()
    let titulo = document.getElementById("titulo");
    titulo.innerHTML = "Old Fashioned Burgers"
    let inputNombre = document.getElementById("inputNombre");
    let botonBuscar = document.getElementById("buscar");
    botonBuscar.addEventListener("click", () => filtrarTarjetas(inputNombre));
    let botonComprar = document.getElementById("comprar");
    botonComprar.addEventListener("click", finalizarCompra);
    let botonVerOcultar = document.getElementById("verOcultarInfo");
    botonVerOcultar.addEventListener("click", verOcultarBurgersCarrito);

    let botonVaciar = document.getElementById("vaciar");
    botonVaciar.addEventListener("click", vaciarCarrito);


    function verOcultarBurgersCarrito(e) {
        let seccionVenta = document.getElementById("seccionVenta");
        let seccionCarrito = document.getElementById("seccionCarrito");
        seccionVenta.classList.toggle("oculta");
        seccionCarrito.classList.toggle("oculta");
        if (e.target.innerText === "Ver compra") {
            e.target.innerText = "Ver burgers";
        } else {
            e.target.innerText = "Ver compra";
        }
    }
    let copyright = document.getElementById("copyright");
    let hoy = new Date();
    let anioActual = hoy.getFullYear();
    copyright.innerHTML = "Copyright " + anioActual;
}

function finalizarCompra() {
    renderizarCarrito();
    let mensajeCompra = document.getElementById("mensajeCompra");
    if (localStorage.getItem("carrito") !== null) {
        mensajeCompra.classList.remove("oculta");
        localStorage.removeItem("carrito");
        lanzarAlert("Compra finalizada con exito", "Muchas gracias por su compra", "success", "#fff", "", 2000, "top", "#000", "32rem", "#000 url(./media/logoOldInvertida.png) center no-repeat")

    } else {
        lanzarAlert("No has agregado nada al carrito", "", "warning", "#b9b9b9", "", 1500, "top", "#000", "32rem", "")
    }
}

function vaciarCarrito() {
    localStorage.clear();
    lanzarAlert("Carrito descartado", "", "info", "#b9b9b9", "", 1500, "top", "#000", "32rem", "")
}

function renderizarBurgers(burgers) {
    let contenedor = document.getElementById("burgers");
    contenedor.innerHTML = " ";
    burgers.forEach(burger => {
        let { rutaImagen, nombre, contiene, precio, id } = burger;
        let tarjetaProd = document.createElement("div");
        tarjetaProd.className = "burger";
        tarjetaProd.innerHTML = `
         <img src= ./media/${rutaImagen} />
         <h3>${nombre}</h3>
         <p> ${contiene}</p>
         <h4>Precio: $${precio}</h4>
         <br>
         <button id=${id}>Agregar al carrito</button>
         <br>
    `
        contenedor.append(tarjetaProd);
        let botonAgregarAlCarrito = document.getElementById(burger.id);
        botonAgregarAlCarrito.addEventListener("click", (e) => agregarAlCarrito(e, burgers))


    })
}
function agregarAlCarrito(e, burgers) {
    let carrito = obtenerCarrito();
    let idBotonBurger = Number(e.target.id);
    let burgerBuscado = burgers.find(({ id }) => id == idBotonBurger);
    let burgerEnCarrito = carrito.find(({ id }) => id == idBotonBurger);

    if (burgerEnCarrito) {
        let { } =
            burgerEnCarrito.unidades++;
        burgerEnCarrito.subtotal = burgerEnCarrito.precioUnitario * burgerEnCarrito.unidades;
    } else {
        carrito.push({
            id: burgerBuscado.id,
            nombre: burgerBuscado.nombre,
            precioUnitario: burgerBuscado.precio,
            unidades: 1,
            subtotal: burgerBuscado.precio

        })
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();

    let totalPagar = calcularTotal(carrito);

    mostrarTotal(totalPagar);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    lanzarTostada("Prodcuto agregado", 1300, "top", "right", true)

}

function calcularTotal(carrito) {
    return carrito.reduce((total, burger) => total + burger.subtotal, 0);
}

function mostrarTotal(total) {
    let elementoTotal = document.getElementById("totalPagar");
    elementoTotal.innerText = `Total a pagar: $${total.toFixed(2)}`;

}

function renderizarCarrito() {
    let carrito = obtenerCarrito();
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";
    carrito.forEach(burger => {
        let item = document.createElement("tr");
        item.innerText = burger.nombre + " " + burger.precioUnitario + " " + burger.unidades + " " + burger.subtotal;
        item.innerHTML = `
        <td>${burger.nombre}</td>
        <td>${burger.precioUnitario}</td>
        <td>${burger.unidades}</td>
        <td>${burger.subtotal}</td>
        `
        contenedor.append(item);
    })

}

function filtrarTarjetas(inputNombre) {
    let filtro = inputNombre.value.trim().toLowerCase();
    let burgersFiltrados = burgers.filter(burger =>
        burger.nombre.toLowerCase().includes(filtro) || burger.contiene.toLowerCase().includes(filtro)
    );
    renderizarBurgers(burgersFiltrados);
}
function obtenerCarrito() {
    let carrito = [];
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
    };
    return carrito
}

function lanzarAlert(title, text, icon, color, padding, timer, position, background, width, backdrop) {
    Swal.fire({
        title: title,
        text: text,
        color: color,
        icon: icon,
        padding: padding,
        timer: timer,
        showConfirmButton: false,
        position: position,
        background: background,
        width: width,
        heightAuto: true,
        backdrop: backdrop
    })
}

function lanzarTostada(text, duration, gravity, position, close) {
    Toastify({
        text: text,
        duration: duration,
        newWindow: true,
        close: true,
        gravity: gravity,
        position: position,
        stopOnFocus: true,
        close: close,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}
function pedirDatosAlBackend() {
    fetch("./burgers.json")
        .then(resp => resp.json())
        .then(info => principal(info))
        .catch(error => lanzarAlert("No se pudieron obtener datos", "", "error", "#b9b9b9", "", 0, "top", "#000", "32rem", ""))
}

pedirDatosAlBackend()


