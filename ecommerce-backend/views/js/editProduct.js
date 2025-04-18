axios.defaults.withCredentials = true;

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://ecommerce-backend-test-tuf5.onrender.com';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const form = document.getElementById('editProductForm');
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// Fetch existing product data
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data } = await api.get(`/api/products/${productId}`);
    document.getElementById('title').value = data.product.title;
    document.getElementById('description').value = data.product.description;
    document.getElementById('price').value = data.product.price;
  } catch (error) {
    console.error('Failed to load product data:', error);
    alert('Error loading product data');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;

  try {
    const res = await api.put(`/api/products/${productId}`,{
      title,
      description,
      price,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Product updated successfully!');
    window.location.href = 'admin.html';
  } catch (error) {
    console.error('Failed to update product:', error);
    alert('Error updating product');
  }
});
