const productList = document.getElementById('productList');
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

const getAuthTokenFromCookies = () => {
    const cookieArray = document.cookie.split("; ");
    console.log("cookieArray",cookieArray);
    for (let i = 0; i < cookieArray.length; i++) {
        const cookiePair = cookieArray[i].split("=");
        console.log("cookiePair",cookiePair);
        if (cookiePair[0] === "authToken") {
            return cookiePair[1];
        }
    }
    return null;
};


const fetchProducts = async () => {
    const token = getAuthTokenFromCookies();
    console.log("token in prod",token)
    if(!token){
        productList.innerHTML = '<p>Please log in to view products.</p>';
        return;
    }

    try {
        const res = await api.get('/api/products',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = res.data;

        if (res.status===200) {
        productList.innerHTML = data.products.map(p => `
            <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p>Price: $${p.price}</p>
            <img src="${p.image}" alt="${p.title}" width="150"/><br>
            <button onclick="addToCart('${p._id}')">Add to Cart</button>
            </div>
        `).join('');
        } else {
        productList.innerHTML = '<p>Failed to load products.</p>';
        }
    } catch (err) {
        console.error(err);
        productList.innerHTML = '<p>Error fetching products.</p>';
    }
};

const addToCart = async (productId) => {
    const token=getAuthTokenFromCookies();
    if(!token){
        alert('You must be logged in to add items to the cart.');
        return;
    }

    try {
        const res = await api.post("/api/cart", {
            productId,
            quantity: 1
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const data = res.data;
        alert('Product added to cart!');
    } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || 'Failed to add to cart';
        alert(message);
    }
};

fetchProducts();
