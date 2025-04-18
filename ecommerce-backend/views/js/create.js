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

const form = document.getElementById('createProductForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log("form data",formData);
    try {
    const res = await api.post('/api/products', formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log("RES",res);
    alert('Product created successfully!');
    window.location.href = 'admin.html';
    } catch (error) {
    console.error(error);
    alert('Failed to create product');
    }
});