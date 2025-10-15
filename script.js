// Sistema de usuarios con credenciales
const users = [
    { username: 'admin', password: 'admin123', role: 'Administrador', permissions: ['create', 'update'] },
    { username: 'gerente', password: 'gerente123', role: 'Gerente', permissions: ['read', 'delete'] },
    { username: 'supervisor', password: 'supervisor123', role: 'Supervisor', permissions: ['read', 'update'] }
];

// Inventario de coches con 20 ejemplos
let cars = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, color: 'Blanco', price: 450000, stock: 5 },
    { id: 2, brand: 'Honda', model: 'Civic', year: 2023, color: 'Negro', price: 480000, stock: 3 },
    { id: 3, brand: 'Nissan', model: 'Sentra', year: 2022, color: 'Rojo', price: 420000, stock: 7 },
    { id: 4, brand: 'Ford', model: 'Focus', year: 2023, color: 'Azul', price: 380000, stock: 4 },
    { id: 5, brand: 'Chevrolet', model: 'Cruze', year: 2022, color: 'Gris', price: 400000, stock: 6 },
    { id: 6, brand: 'Volkswagen', model: 'Jetta', year: 2023, color: 'Plateado', price: 520000, stock: 2 },
    { id: 7, brand: 'Hyundai', model: 'Elantra', year: 2022, color: 'Verde', price: 390000, stock: 8 },
    { id: 8, brand: 'Kia', model: 'Forte', year: 2023, color: 'Amarillo', price: 370000, stock: 5 },
    { id: 9, brand: 'Mazda', model: 'Mazda3', year: 2022, color: 'Naranja', price: 460000, stock: 3 },
    { id: 10, brand: 'Subaru', model: 'Impreza', year: 2023, color: 'Morado', price: 500000, stock: 4 },
    { id: 11, brand: 'BMW', model: 'Serie 3', year: 2023, color: 'Negro', price: 850000, stock: 2 },
    { id: 12, brand: 'Mercedes', model: 'Clase C', year: 2022, color: 'Blanco', price: 900000, stock: 1 },
    { id: 13, brand: 'Audi', model: 'A4', year: 2023, color: 'Rojo', price: 820000, stock: 3 },
    { id: 14, brand: 'Lexus', model: 'IS', year: 2022, color: 'Azul', price: 780000, stock: 2 },
    { id: 15, brand: 'Infiniti', model: 'Q50', year: 2023, color: 'Gris', price: 750000, stock: 1 },
    { id: 16, brand: 'Acura', model: 'ILX', year: 2022, color: 'Plateado', price: 680000, stock: 4 },
    { id: 17, brand: 'Genesis', model: 'G70', year: 2023, color: 'Verde', price: 720000, stock: 2 },
    { id: 18, brand: 'Volvo', model: 'S60', year: 2022, color: 'Amarillo', price: 650000, stock: 3 },
    { id: 19, brand: 'Cadillac', model: 'ATS', year: 2023, color: 'Naranja', price: 800000, stock: 1 },
    { id: 20, brand: 'Lincoln', model: 'MKZ', year: 2022, color: 'Morado', price: 700000, stock: 2 }
];

let currentUser = null;
let nextId = 21;

// Emojis para las alertas
const emojis = ['🚗', '🏎️', '🚙', '🚕', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '✈️'];

// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userRole = document.getElementById('userRole');
const adminPanel = document.getElementById('adminPanel');
const managerPanel = document.getElementById('managerPanel');
const supervisorPanel = document.getElementById('supervisorPanel');
const carsTableBody = document.getElementById('carsTableBody');
const addCarForm = document.getElementById('addCarForm');
const editModal = document.getElementById('editModal');
const editCarForm = document.getElementById('editCarForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const totalCars = document.getElementById('totalCars');
const totalValue = document.getElementById('totalValue');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    displayCars();
    updateStats();
});

function initializeApp() {
    // Mostrar pantalla de login inicialmente
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
}

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Formularios
    addCarForm.addEventListener('submit', handleAddCar);
    editCarForm.addEventListener('submit', handleEditCar);
    
    // Búsqueda
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Modal
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeModal();
        }
    });
}

// Sistema de Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Validaciones
    if (!validateLoginInput(username, password, errorDiv)) {
        return;
    }
    
    // Buscar usuario
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        showDashboard();
        showWelcomeAlerts();
    } else {
        showError(errorDiv, 'Credenciales incorrectas. Intenta nuevamente.');
    }
}

function validateLoginInput(username, password, errorDiv) {
    // Validar que no estén vacíos
    if (!username || !password) {
        showError(errorDiv, 'Todos los campos son obligatorios.');
        return false;
    }
    
    // Validar caracteres especiales en username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        showError(errorDiv, 'El nombre de usuario solo puede contener letras y números.');
        return false;
    }
    
    // Validar longitud mínima
    if (username.length < 3) {
        showError(errorDiv, 'El nombre de usuario debe tener al menos 3 caracteres.');
        return false;
    }
    
    if (password.length < 6) {
        showError(errorDiv, 'La contraseña debe tener al menos 6 caracteres.');
        return false;
    }
    
    return true;
}

function showDashboard() {
    loginScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    userRole.textContent = currentUser.role;
    
    // Mostrar panel según el rol
    adminPanel.classList.add('hidden');
    managerPanel.classList.add('hidden');
    supervisorPanel.classList.add('hidden');
    
    if (currentUser.permissions.includes('create')) {
        adminPanel.classList.remove('hidden');
    }
    if (currentUser.permissions.includes('delete')) {
        managerPanel.classList.remove('hidden');
    }
    if (currentUser.permissions.includes('read') && currentUser.permissions.includes('update')) {
        supervisorPanel.classList.remove('hidden');
    }
    
    displayCars();
    updateStats();
}

function handleLogout() {
    currentUser = null;
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    
    // Limpiar formularios
    loginForm.reset();
    addCarForm.reset();
    editCarForm.reset();
    
    // Limpiar errores
    document.getElementById('loginError').classList.remove('show');
}

// Sistema de Alertas/Cookies
function showWelcomeAlerts() {
    const alertCount = 5;
    const alertDelay = 1000; // 1 segundo entre alertas
    
    for (let i = 0; i < alertCount; i++) {
        setTimeout(() => {
            showAlert();
        }, i * alertDelay);
    }
}

function showAlert() {
    const alert = document.createElement('div');
    alert.className = 'alert';
    
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const messages = [
        '¡Bienvenido al sistema!',
        'Inventario actualizado',
        'Sistema funcionando correctamente',
        'Datos sincronizados',
        'Acceso autorizado'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    alert.innerHTML = `
        <span class="emoji">${randomEmoji}</span>
        ${randomMessage}
    `;
    
    document.body.appendChild(alert);
    
    // Cerrar después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// CRUD de Coches
function handleAddCar(e) {
    e.preventDefault();
    
    const formData = {
        brand: document.getElementById('carBrand').value.trim(),
        model: document.getElementById('carModel').value.trim(),
        year: parseInt(document.getElementById('carYear').value),
        color: document.getElementById('carColor').value,
        price: parseFloat(document.getElementById('carPrice').value),
        stock: parseInt(document.getElementById('carStock').value)
    };
    
    if (!validateCarData(formData)) {
        return;
    }
    
    const newCar = {
        id: nextId++,
        ...formData
    };
    
    cars.push(newCar);
    displayCars();
    updateStats();
    addCarForm.reset();
    
    showAlert();
}

function handleEditCar(e) {
    e.preventDefault();
    
    const carId = parseInt(document.getElementById('editCarId').value);
    const formData = {
        brand: document.getElementById('editCarBrand').value.trim(),
        model: document.getElementById('editCarModel').value.trim(),
        year: parseInt(document.getElementById('editCarYear').value),
        color: document.getElementById('editCarColor').value,
        price: parseFloat(document.getElementById('editCarPrice').value),
        stock: parseInt(document.getElementById('editCarStock').value)
    };
    
    if (!validateCarData(formData)) {
        return;
    }
    
    const carIndex = cars.findIndex(car => car.id === carId);
    if (carIndex !== -1) {
        cars[carIndex] = { id: carId, ...formData };
        displayCars();
        updateStats();
        closeModal();
        showAlert();
    }
}

function validateCarData(data) {
    // Validar campos vacíos
    if (!data.brand || !data.model || !data.color) {
        alert('Todos los campos son obligatorios.');
        return false;
    }
    
    // Validar caracteres especiales
    if (!/^[a-zA-Z0-9\s]+$/.test(data.brand) || !/^[a-zA-Z0-9\s]+$/.test(data.model)) {
        alert('Marca y modelo solo pueden contener letras, números y espacios.');
        return false;
    }
    
    // Validar año
    if (data.year < 1900 || data.year > 2024) {
        alert('El año debe estar entre 1900 y 2024.');
        return false;
    }
    
    // Validar precio
    if (data.price <= 0) {
        alert('El precio debe ser mayor a 0.');
        return false;
    }
    
    // Validar stock
    if (data.stock < 0) {
        alert('El stock no puede ser negativo.');
        return false;
    }
    
    return true;
}

function displayCars() {
    carsTableBody.innerHTML = '';
    
    cars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.color}</td>
            <td>$${car.price.toLocaleString()}</td>
            <td>${car.stock}</td>
            <td>
                ${currentUser.permissions.includes('update') ? 
                    `<button class="action-btn edit-btn" onclick="editCar(${car.id})">Editar</button>` : ''}
                ${currentUser.permissions.includes('delete') ? 
                    `<button class="action-btn delete-btn" onclick="deleteCar(${car.id})">Eliminar</button>` : ''}
            </td>
        `;
        carsTableBody.appendChild(row);
    });
}

function editCar(id) {
    const car = cars.find(c => c.id === id);
    if (car) {
        document.getElementById('editCarId').value = car.id;
        document.getElementById('editCarBrand').value = car.brand;
        document.getElementById('editCarModel').value = car.model;
        document.getElementById('editCarYear').value = car.year;
        document.getElementById('editCarColor').value = car.color;
        document.getElementById('editCarPrice').value = car.price;
        document.getElementById('editCarStock').value = car.stock;
        
        editModal.style.display = 'block';
    }
}

function deleteCar(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
        cars = cars.filter(car => car.id !== id);
        displayCars();
        updateStats();
        showAlert();
    }
}

function closeModal() {
    editModal.style.display = 'none';
    editCarForm.reset();
}

function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        displayCars();
        return;
    }
    
    const filteredCars = cars.filter(car => 
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.color.toLowerCase().includes(searchTerm) ||
        car.year.toString().includes(searchTerm)
    );
    
    displayFilteredCars(filteredCars);
}

function displayFilteredCars(filteredCars) {
    carsTableBody.innerHTML = '';
    
    filteredCars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.id}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.color}</td>
            <td>$${car.price.toLocaleString()}</td>
            <td>${car.stock}</td>
            <td>
                ${currentUser.permissions.includes('update') ? 
                    `<button class="action-btn edit-btn" onclick="editCar(${car.id})">Editar</button>` : ''}
                ${currentUser.permissions.includes('delete') ? 
                    `<button class="action-btn delete-btn" onclick="deleteCar(${car.id})">Eliminar</button>` : ''}
            </td>
        `;
        carsTableBody.appendChild(row);
    });
}

function updateStats() {
    totalCars.textContent = cars.length;
    
    const totalVal = cars.reduce((sum, car) => sum + (car.price * car.stock), 0);
    totalValue.textContent = `$${totalVal.toLocaleString()}`;
}

function showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// Validaciones adicionales en tiempo real
document.addEventListener('input', function(e) {
    if (e.target.type === 'text') {
        // Remover caracteres especiales excepto espacios
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    
    if (e.target.type === 'number') {
        // Asegurar que no sea negativo
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    }
});

// Prevenir espacios al inicio y final
document.addEventListener('blur', function(e) {
    if (e.target.type === 'text') {
        e.target.value = e.target.value.trim();
    }
});
