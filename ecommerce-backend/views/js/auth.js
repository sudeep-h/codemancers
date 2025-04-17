const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("form submitted");

        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                email,
                password
            });
            console.log(res);
            const data = res.data;
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
