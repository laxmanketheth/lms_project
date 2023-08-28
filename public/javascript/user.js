

//========================all courses==============================//






let startDateElements = document.getElementsByClassName("startDate")//getElementsByClassName returns array of elements//

for(let i=0; i<startDateElements.length; i++){
    // console.log(startDateElements[i].innerHTML);
    let currentdate = new Date(startDateElements[i].innerHTML) //to access the date inside each element//
    
    let newdates = currentdate.toLocaleDateString()    //toLocaleDateString method returns only date string and removes time from it //
    document.getElementsByClassName("startDate")[i].innerHTML = newdates  //pushing the new date back inside each element //
    
}



let endDateElements = document.getElementsByClassName("endDate")
// console.log(endDateElements);
for(let i = 0; i< endDateElements.length; i++){
    let currentdate = new Date(endDateElements[i].innerHTML)
    let newDate = currentdate.toLocaleDateString()

    document.getElementsByClassName("endDate")[i].innerHTML = newDate
    
}

