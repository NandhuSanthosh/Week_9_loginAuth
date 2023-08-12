const arr = ["nandhu", "anandhu", "rahul", "vipin"]

console.log(arr.filter( (e)=>{
    if(e.toLowerCase().includes('nan')){
        return true;
    }
    else{
        return false;
    }
    
}))