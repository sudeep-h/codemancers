
axios.defaults.withCredentials = true;

const baseURL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://ecommerce-backend-test-tuf5.onrender.com';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

const adminContent = document.getElementById('adminContent');

const checkAdmin = async () => {
    try {
    const res = await api.get('/api/auth/profile');
    const user = res.data.user;

    if (user.role !== 'admin') {
        alert("Access denied: Admins only.");
        window.location.href = 'index.html';
        return;
    }

    loadAdminUI();

    } catch (err) {
    alert("Please log in as admin to continue.");
    window.location.href = 'index.html';
    }
};

const loadAdminUI = () => {
    adminContent.innerHTML = `
    <p>Welcome, Admin!</p>
    <button onclick="window.location.href='create.html'">Add New Product</button>
    <div id="productList"></div>
    `;
    fetchProducts();
};

const fetchProducts = async () => {
    const res = await api.get('/api/products');
    const products = res.data.products;

    const listContainer = document.getElementById('productList');
    listContainer.innerHTML = products.map(p => `
    <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p>Price: $${p.price}</p>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
        <button onclick="window.location.href='editProduct.html?id=${p._id}'">Edit</button>
    </div>
    `).join('');
};

const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/products/${id}`);
    fetchProducts();
};

checkAdmin();