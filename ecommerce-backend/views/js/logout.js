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

window.addEventListener('DOMContentLoaded', () => {
    console.log("Logout script loaded");
    const logoutBtn = document.getElementById('logoutButton');
    console.log("logoutBtn is", logoutBtn);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log("Logout button clicked");

            try {
                const res = await api.get('/api/auth/logout');
                console.log("Logout API response:", res);

                document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                alert('Logged out successfully.');
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout failed:', error);
                alert('Error logging out, please try again.');
            }
        });
    }
});
