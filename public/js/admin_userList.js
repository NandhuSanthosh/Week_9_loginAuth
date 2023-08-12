const userListContainer = document.getElementById('userListContainer')
const selectedUserContainer = document.getElementById('selectedUserContainer')
const createUserContainer = document.getElementById('createUserContainer')

const userListTableBody = document.getElementById('userListTableBody')
const userListButton = document.getElementById('userListBtn')
const createUserButton = document.getElementById('createUserBtn')
const adminSideUpdateUser = document.getElementById('adminSideUpdateUser')

let selectedUserDetails = {pictureChanged: false};

let userList = [];


window.onload = fetchUsers

async function fetchUsers(){
    const response = await fetch('http://localhost:3000/admin/getUser')
    const data = await response.json()
    //console.log(data.userdata)

    userList = data.userdata
    renderUserDetails();

}

function renderUserDetails(users = userList){
    userListTableBody.innerHTML = ''
    if(users.length == 0){
        userListTableBody.innerHTML = "No such user."
    }
    users.map( (element, index)=>{
        const tile = createTile(element, index+1);
        userListTableBody.append(tile)
    })
}

function createTile(element, index){
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <th scope="row"> ${index} </th>
        <td> ${element.name} </td>
        <td> ${element.email} </td>
        <td> ${element.flag} </td>
        <td> <img src="${element.profileUrl}" class="TableImage" alt=""></td>
        <td> <button class="btn btn-primary">EDIT</button></td> `

    tr.getElementsByClassName('btn')[0].addEventListener('click', getUserDetails(element))
    return tr;
}

createUserButton?.addEventListener( 'click', (e)=>{
    userListButton.classList.remove('active')
    createUserButton.classList.add('active')

    userListContainer.style.display = 'none'
    selectedUserContainer.style.display = 'none'
    createUserContainer.style.display = 'block'
})

userListButton?.addEventListener('click', (e)=>{
    createUserButton.classList.remove('active')
    userListButton.classList.add('active')

    userListContainer.style.display = 'block'
    createUserContainer.style.display = 'none'
    selectedUserContainer.style.display = 'none'
})

adminSideUpdateUser?.addEventListener('submit', (e)=>{
    e.preventDefault();
    updateUser(adminSideUpdateUser)
    .then( (data)=> data.json())
    .then( data => {
        if(data.status){
            alert("user details updated")
            updateUserList();
            renderUserDetails();
        }
    })
    .catch(error => {
        alert(error.message)
    });
})

async function updateUser(form){
    const name = form.querySelector('[name = name]')
    const email = form.querySelector('[name = email]')
    const status = updateUserValidate(name, email);
    const isChanged = checkChange(name.value, email.value)
    if(status && isChanged){
        const formData = new FormData();
        // formData.append('url', image);
        selectedUserDetails.pot_email = selectedUserDetails.email;
        if(selectedUserDetails.name != name.value){
            selectedUserDetails.name = name.value
            formData.append('name', name.value);
        }
        if(selectedUserDetails.email != email.value){
            formData.append('email', email.value);
            selectedUserDetails.pot_email = email.value;
        }
        formData.append('ogEmail', selectedUserDetails.email)
        return fetch("http://localhost:3000/admin/updateUser", {
            method: "PATCH",
            body: formData
        })
    }
    else if(!isChanged){
        throw new Error("No values were updated")
    }
}

function updateUserList(){
    userList.forEach( (element)=>{
        if(element.email == selectedUserDetails.email){
            element.name = selectedUserDetails.name
            element.email = selectedUserDetails.pot_email;
            //console.log(element)
        }
    })
    //console.log(userList)
}





function checkChange(name, email){
    if(selectedUserDetails.name != name || selectedUserDetails.email != email)
        return true;
    return false;
}

function updateUserValidate(name, email){
    const fields = [{
        field: email, 
        validationFunc: isEmailValid
    }, {
        field: name, 
        validationFunc: isNameValid
    }]

    if(!formValidate(fields)){
        return false;
    }
    return true;
}

function getUserDetails(user){
    
    return async function (e){
        createUserButton.classList.remove('active')
        userListButton.classList.remove('active')

        userListContainer.style.display = 'none'
        createUserContainer.style.display = 'none'  
        selectedUserContainer.style.display = 'block'

        updateFormValues(user);
    }

    function updateFormValues(user){
        selectedUserDetails = user
        selectedUserEmail.value = user.email
        selectedUserName.value = user.name;
        selectedUserImage.src = user.profileUrl

        if(selectedUserDetails.flag){
            blockButton.disabled = true;
        }
        else{
            blockButton.disabled = false;s
        }
    }
}

function validateUpdate(name, email){

    const fields = [
        {
            field: name,
            validationFunc: isNameValid
        }
        ,{
            field: email,
            validationFunc: isEmailValid
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

blockButton?.addEventListener('click', async(e)=>{
    const isVerify = confirm("Do you really want to block this user.");
    if(isVerify){
        await fetch('http://localhost:3000/admin/deleteUser', {
            method : "DELETE", 
            body : JSON.stringify({
                email: selectedUserDetails.email
            }), 
             headers: {
                "Content-Type": "application/json",
            }
        })
        .then( data => data.json())
        .then( (data)=>{
            if(data.status){
                alert("User has been successfy block.")
                blockButton.disabled = true;

                updateUserList_blockedUser(selectedUserDetails.email)
            }
            else{
                alert(data.error)
            }
        })
    }
})


searchUserButton?.addEventListener('click', (e)=>{
    const userToSearch = searchNameField.value;
    if(userToSearch == '') return;

    const newUserList = userList.filter( (e)=>{
        if(e.name.toLowerCase().includes(userToSearch.toLowerCase())){
            return true;
        }
        else{
            return false;
        }
        
    })
    console.log(newUserList)
    renderUserDetails(newUserList   )
})

function updateUserList_blockedUser(email){
    userList.forEach( (user)=>{
        if(user.email == email){
            user.flag = true;
        }
    })
    renderUserDetails();
}

