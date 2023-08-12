function isEmailValid(email){
    if(email){
        console.log(email)
        let userEmail = email.toLowerCase();
        let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        if(regex.test(userEmail)){
            return {status: true}
        }
    }
    return {status: false, msg: "Not a valid email"}
      
}

function isNameValid(name){
    if(name){
        var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
        if(regName.test(name)){
            return {status: true}
        }
    }
    return {status: false, msg: "Not a valid name"}
}
function isPasswordValid(password){
    if(!password) return { status: false, msg: 'Password not valid'};
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let status = regex.test(password);
    if(status){
        return {status}
    }
    else{
        return {status, msg: "Password should contain lowercase, uppercase, numbers and special characters"}
    }
}

function setStatus(field, result){
    let spanParent = field.nextElementSibling;

    spanParent.innerHTML = ''
    if(!result.status){
        let span = document.createElement("span")
        span.innerHTML = result.msg
        spanParent.append(span)
        field.classList.add('error')
        field.classList.remove('success')
    }
    else{
        field.classList.remove('error')
        field.classList.add('success')
    }
}