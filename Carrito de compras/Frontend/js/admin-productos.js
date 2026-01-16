// admin-productos.js - JavaScript para Gestión de Productos

// Verificar autenticación admin
const admin = JSON.parse(localStorage.getItem('admin') || '{}');
if (!admin.id) {
    window.location.href = '/admin/login';
}

let productos = [];

// Cargar productos
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        
        if (data.success) {
            productos = data.productos;
            renderProductos();
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Renderizar tabla
function renderProductos() {
    const tbody = document.getElementById('productosBody');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const stockClass = producto.stock > 30 ? 'stock-high' : producto.stock > 10 ? 'stock-medium' : 'stock-low';
        
        tbody.innerHTML += `
            <tr>
                <td>${producto.id}</td>
                <td><img src="/img/${producto.imagen || 'default.png'}" class="product-img" alt="${producto.nombre}"></td>
                <td><strong>${producto.nombre}</strong></td>
                <td>$${parseFloat(producto.precio).toFixed(2)}</td>
                <td><span class="stock-badge ${stockClass}">${producto.stock}</span></td>
                <td>${producto.descripcion || 'Sin descripción'}</td>
                <td>
                    <button class="btn-edit" onclick="editarProducto(${producto.id})">✏️ Editar</button>
                    <button class="btn-delete" onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Abrir modal
function openModal(isEdit = false) {
    document.getElementById('productModal').classList.add('active');
    document.getElementById('modalTitle').textContent = isEdit ? 'Editar Producto' : 'Nuevo Producto';
}

// Cerrar modal
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

// Crear/Editar producto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productoData = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        descripcion: document.getElementById('descripcion').value,
        imagen: document.getElementById('imagen').value
    };
    
    try {
        let response;
        if (productId) {
            // Actualizar
            response = await fetch(`/api/productos/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoData)
            });
        } else {
            // Crear
            response = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            alert(productId ? 'Producto actualizado' : 'Producto creado');
            closeModal();
            cargarProductos();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
});

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('productId').value = producto.id;
    document.getElementById('nombre').value = producto.nombre;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('descripcion').value = producto.descripcion || '';
    document.getElementById('imagen').value = producto.imagen || '';
    
    openModal(true);
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Producto eliminado');
            cargarProductos();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar producto');
    }
}

// Cerrar modal al hacer clic fuera
document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        closeModal();
    }
});

// Cargar productos al iniciar
cargarProductos();
