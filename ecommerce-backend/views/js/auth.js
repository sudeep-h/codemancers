const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("form submitted");

        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role=document.getElementById('regRole').value;

        try{
            const res = await axios.post('https://ecommerce-backend-test-tuf5.onrender.com/api/auth/register', {
                email,
                password,
                role
            },{
                withCredentials: true 
            });
            // console.log(res);
            const data = res.data;

            const token=data.token;
            console.log("TOKEN",token);
            document.cookie=`authToken=${token}; path=/; Secure; SameSite:Strict`;
            console.log("cookie",document.cookie);

            alert('Registration successful');
            window.location.href = 'login.html';
    
        }catch(err){
            let message = 'Registration failed';
            console.log(err.message);
            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }
            alert(message);
        }
        
    });
}


const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try{
            const res = await axios.post('https://ecommerce-backend-test-tuf5.onrender.com/api/auth/register', {
                email,
                password
            },{
                withCredentials: true 
            });
            console.log(res);
            const data = res.data;

            const token=data.token;
            console.log("TOKEN",token);
            document.cookie=`authToken=${token}; path=/; Secure; SameSite:Strict`;
            console.log("cookie",document.cookie);
            alert(`Welcome ${data.user.email}`);
            window.location.href = 'index.html';
    
        }catch(err){
            let message = 'Login failed';
            console.log(err.message);
            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;
            }
            alert(message);
        }
    });
}


const logout = async () => {
    try {
        await axios.get('https://ecommerce-backend-test-tuf5.onrender.com/api/auth/register');
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        alert('Logged out successfully.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout failed', error);
        alert('Error logging out, please try again.');
    }
};

  