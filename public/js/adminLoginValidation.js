
loginForm?.addEventListener('submit', (e)=>{
    console.log("here")
    const email = loginForm.querySelector('[name = email]')
    const password = loginForm.querySelector('[name = password]')
    e.preventDefault()

    // validateLogin(email, password);
    fetch('http://localhost:3000/admin/login', {
        method: "POST", 
        body: JSON.stringify({
            email: email.value, 
            password: password.value
        }),
        headers: {
			"Content-Type": "application/json"
		},
    })
    .then( response => response.json())
    .then( (data)=>{
        if(data.status){
            location.assign('/admin/');
        }
        else{
            alert(data.error);
        }
    })
    .catch(err => {
        alert(err.message);
    })
    
})