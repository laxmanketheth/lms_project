

//========================single course==============================//

//changing the date smaller size by removing standard time//

let startdate = document.getElementById("startDate").innerHTML
// console.log(startdate);
const date = new Date(startdate);
// console.log(date);
let changeddate = date.toLocaleDateString();
// console.log(changeddate);
 document.getElementById("startDate").innerHTML = changeddate;


//  changing the end date//

let EndDate = document.getElementById("endDate").innerHTML
let currentdate = new Date(EndDate);
let newDate = currentdate.toLocaleDateString();
document.getElementById("endDate").innerHTML = newDate


 

