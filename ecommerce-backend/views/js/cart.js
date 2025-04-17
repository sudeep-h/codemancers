const cartItemsContainer = document.getElementById('cartItems');

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

const fetchCart = async () => {
    const token = getAuthTokenFromCookies();
    console.log("token in prod",token)
    if(!token){
        productList.innerHTML = '<p>Please log in to view products.</p>';
        return;
    }

    try {
        const res = await axios.get('http://localhost:5000/api/cart',{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = res.data;

        if (res.status===200) {
        if (!data.cart || data.cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cartItemsContainer.innerHTML = data.cart.items.map(item => `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 8px 0;">
            <strong>${item.product.title}</strong> - Quantity: ${item.quantity}
            <br>
            <button onclick="removeFromCart('${item.product._id}')">Remove</button>
            </div>
        `).join('');
        } else {
        cartItemsContainer.innerHTML = '<p>Could not load cart.</p>';
        }
    } catch (err) {
        console.error(err);
        cartItemsContainer.innerHTML = '<p>Error fetching cart.</p>';
    }
};


const removeFromCart = async (productId) => {
    const token = getAuthTokenFromCookies();
    console.log("token in prod",token)
    if(!token){
        productList.innerHTML = '<p>Please log in to view products.</p>';
        return;
    }
    try{
        const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = res.data;
    
        if (res.status===200) {
            alert('Item removed');
            fetchCart();
        }
    }catch(err){
        alert('Failed to remove item');
        console.log(err.message);
    } 
};

const checkout = async () => {
    const token = getAuthTokenFromCookies();
    console.log("token in prod",token)
    if(!token){
        productList.innerHTML = '<p>Please log in to view products.</p>';
        return;
    }
    try {
        const shippingAddress = document.getElementById('shippingAddress').value;

    if (!shippingAddress.trim()) {
        return alert('Please enter your shipping address.');
    }


    const res = await axios.post('http://localhost:5000/api/checkout', {
        shippingAddress
    }, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });
    const data = res.data;
    console.log(data);
    if (res.status===200) {
        alert('Order placed successfully!');
        window.location.href = 'success.html';
    }
    } catch (err) {
        alert('Checkout failed');
        console.log(err.message);
    }
}
fetchCart();
