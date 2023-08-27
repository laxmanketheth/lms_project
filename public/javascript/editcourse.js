


//========================single course==============================//

//changing the date smaller size by removing standard time//

let startdate = document.getElementById("startDate").value
// console.log(startdate);
const date = new Date(startdate);
// console.log(date);
let changeddate = date.toLocaleDateString();
// console.log(changeddate);
 document.getElementById("startDate").value = changeddate;


//  changing the end date//

let EndDate = document.getElementById("endDate").value
let currentdate = new Date(EndDate);
let newDate = currentdate.toLocaleDateString();
document.getElementById("endDate").value = newDate


 










// let editbtn = document.getElementById('editbtn')
// console.log(editbtn);
// editbtn.addEventListener('click',()=>{
    
//     let courseid = document.getElementById('courseId').innerHTML
//     let getrequest = `/courses/updateCourse/${courseid}`
//     console.log(getrequest);
//     let promise = fetch(getrequest)
//             promise.then(res=>{
//                 res.json
//             }).then(data=>{
//                 console.log(data);
//             })
//             .catch(error=>{
//                 console.log(error);
//             })
// })





// //============================incomplete=================//


// let submitbutton = document.getElementById('submitbutton')

// // event listener//

// submitbutton.addEventListener('click', () => {

//     let courseId = document.getElementById('courseId').innerHTML
//     console.log(courseId);
//     dataInput = document.getElementsByClassName('editcourse').value
//     console.log(dataInput);

//     let apicall = `/courses/updateCourse/${courseId}`
//     let promise = fetch(apicall)
// //specify request type in fetch,by default it makes get request//

// })