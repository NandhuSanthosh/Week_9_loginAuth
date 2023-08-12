
const signupForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')
const AdminSideCreateUser = document.getElementById('adminSideCreateUser')

signupForm?.addEventListener('submit', async(e)=>{
    e.preventDefault();
        signupHandler(signupForm, "user")
        .then( (data) => {
            console.log(data);
            return data.json()
        })
        .then( (data)=>{
            console.log(data);
            if(!data.status){
                let errors = Object.values(data.error).join(" ")
                alert(errors)
            }
            else{
                window.location.href = '/'
            }
        })
        .catch( (err)=>{
            console.log(err)
        }) 
})

console.log(AdminSideCreateUser)

AdminSideCreateUser?.addEventListener('submit', async(e)=>{
    e.preventDefault();
    signupHandler(AdminSideCreateUser, "admin")
    .then( (data) => {
            console.log(data);
            return data.json()
        })
        .then( (data)=>{
            console.log(data);
            if(!data.status){
                // document.cookie = 'jwt=;xpires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                let errors = Object.values(data.error).join(" ")
                alert(errors)
            }
            else{
                alert("User created")
                fetchUsers();
            }
        })
        .catch( (err)=>{
            console.log(err)
        })

})


async function signupHandler(form, from){
    const name = form.querySelector('[name = name]')
    const email = form.querySelector('[name = email]')
    const password = form.querySelector('[name = password]')
    const confirmPassword = form.querySelector('[name = password2]')
    const image = form.querySelector('[name=url]').files[0]

    const status = validate(name, email, password, confirmPassword);
    if(status){
        
        console.log(status)
        const formData = new FormData();
        formData.append('url', image);
        formData.append('name', name.value);
        formData.append('email', email.value);
        formData.append('password', password.value); 
        formData.append('from', from)

        return fetch("http://localhost:3000/signin", {
            method: "POST",
            body: formData
        })
    }
    else{
        throw new Error("Please Validate the form before sending")
    }
}

loginForm?.addEventListener('submit', (e)=>{
    const email = loginForm.querySelector('[name = email]')
    const password = loginForm.querySelector('[name = password]')
    e.preventDefault()

    // validateLogin(email, password);

    fetch('http://localhost:3000/login', {
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
            location.assign('/');
        }
        else{
            alert(data.error);
        }
    })
    .catch(err => {
        alert(err.message);
    })
    
})

function validateLogin(email, password){
    const fields = [
        {
            field: email,
            validationFunc: isEmailValid
        },{
            field: password,
            validationFunc: isNameValid
        }
    ]

    // console.log(formValidate(fields))
    if(!formValidate(fields)){
        return false;
    }
    return true;
}

function validate(name, email, password, confirmPassword){

    const fields = [
        {
            field: name,
            validationFunc: isNameValid
        }
        ,{
            field: email,
            validationFunc: isEmailValid
        },
        {
            field: password,
            validationFunc: isPasswordValid
        }
    ]

    let isCorrectInput = formValidate(fields)

    let passwordMathcing = {status: true}
    if(password.value != confirmPassword.value ){
        passwordMathcing.status = false;
        passwordMathcing.msg = "Passwords doesn't match"
        isCorrectInput = false;
    }
    if(password.value == ''){
        passwordMathcing.status = false;
        passwordMathcing.msg = "Password not valid"
    }
    setStatus(confirmPassword, passwordMathcing)

    return isCorrectInput;
}

function formValidate(fields){
    let isCorrectInput = true;
    for(let x of fields){
        isCorrectInput = validateFields(x) && isCorrectInput;
    }

    if(!isCorrectInput){

        return false;
    }
    return true;
}

function validateFields(input){
    let validationResult = input.validationFunc(input.field.value)
    setStatus(input.field, validationResult)
    return validationResult.status;
}




