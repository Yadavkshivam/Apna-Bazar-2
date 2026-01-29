const isAdmin = (s)=>{
    if(s === 'ADMIN'){
        return true
    }
    else if (s==='EXPERT'){
        return true
    }

    return false
}

export default isAdmin