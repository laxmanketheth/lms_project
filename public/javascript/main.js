

// // ==============javascript for search bar and search button ================================//


let searchBtn = document.getElementById('searchbtn')

searchBtn.addEventListener('click',(e)=>{

    let searchbar = document.getElementById('searchbar')
    if(searchbar.value === ''){
        e.preventDefault();   //preventing the default funtcionality of submit button//
    
    }
})

