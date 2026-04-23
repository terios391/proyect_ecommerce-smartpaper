// 1. LA FUNCIÓN PARA INYECTAR HTML (Debe ir suelta, afuera de todo)
function cargarComponente(id, archivo) {
    // Retornamos el fetch para saber cuándo terminó de cargar
    return fetch(archivo)
        .then(res => {
            // CORRECCIÓN: Comillas invertidas (backticks) para la variable
            if (!res.ok) throw new Error(`Error al cargar ${archivo}`);
            return res.text();
        })
        .then(html => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.innerHTML = html;
            }
        })
        .catch(err => console.error("Ocurrió un problema:", err));
}

// 2. EL CEREBRO PRINCIPAL (Se ejecuta cuando carga la página)
document.addEventListener("DOMContentLoaded", () => {
    
    // Primero cargamos los componentes
    cargarComponente('beneficios-placeholder', 'Beneficios.html');
    cargarComponente('pie-placeholder', 'pie_de_pagina.html');

    // CORRECCIÓN DEL TIEMPO: Cargamos el encabezado y HASTA QUE termine, actualizamos el carrito
    cargarComponente('encabezado-placeholder', 'encabezado.html').then(() => {
        actualizarBadge(); 
    });

    // === LÓGICA DEL CARRITO DE COMPRAS ===
    let carrito = JSON.parse(localStorage.getItem('carrito_smartpaper')) || [];

    // Función para actualizar el número rojo
    const actualizarBadge = () => {
        const badge = document.getElementById('contador-carrito');
        if (badge) {
            const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    };

    // Detectar clics en los botones de compra
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn_comprar_grande') || e.target.classList.contains('btn_comprar')) {
            e.preventDefault(); // Evitamos que la página brinque
            
            // Extraer info del HTML
            const contenedor = e.target.closest('.articulo_container') || e.target.closest('.galery');
            const nombre = contenedor.querySelector('h1')?.innerText || contenedor.querySelector('.titulo_prod')?.innerText;
            const precioStr = contenedor.querySelector('.articulo_precio')?.innerText || contenedor.querySelector('.precio')?.innerText;
            
            // Limpiamos el texto del precio para que sea un número puro
            const precio = precioStr ? parseFloat(precioStr.replace('$', '').replace(',', '')) : 0;
            
            const inputCant = contenedor.querySelector('.input_cantidad');
            const cantidad = inputCant ? parseInt(inputCant.value) : 1;

            // Crear y guardar el producto
            const producto = { nombre, precio, cantidad };
            carrito.push(producto);
            localStorage.setItem('carrito_smartpaper', JSON.stringify(carrito));

            // Actualizar la interfaz
            actualizarBadge();
            const originalText = e.target.innerText;
            e.target.innerText = "¡Agregado! ✓";
            e.target.style.backgroundColor = "#27ae60"; 

            // Regresar el botón a la normalidad
            setTimeout(() => {
                e.target.innerText = originalText;
                e.target.style.backgroundColor = ""; 
            }, 1500);

            console.log("Carrito actualizado:", carrito);
        }
    });
});