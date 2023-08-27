

// // ==============javascript for search bar and search button ================================//


let searchBtn = document.getElementById('searchbtn')

searchBtn.addEventListener('click',(e)=>{

    let searchbar = document.getElementById('searchbar')
    if(searchbar.value === ''){
        e.preventDefault();   //preventing the default funtcionality of submit button//
    
    }
})


// searchBtn.addEventListener('click', () => {
//     // console.log("test");  

//     let searchInput = document.getElementById('searchbar').value
//     // console.log(searchInput);
//     let api = `/courses/search/${searchInput}`
    
//     fetch(api).
//         then((res) => {
//             return res.text();
//         })
//         .then((data) => {
//             
//             console.log("Data");
//             console.log(data);
//             document.getElementById('abc').innerHTML = data;


//         })
//         .catch((error) => {
//             console.log("error");
//             console.log(error);
//         });

// });
