

//session data//

let userId = document.getElementById('userId').innerHTML;
let email = document.getElementById('email').innerHTML;
let contact_no = document.getElementById('contact_no').innerHTML;
let user_type = document.getElementById('user_type').innerHTML;
let first_name = document.getElementById('first_name').innerHTML;
let last_name = document.getElementById('last_name').innerHTML;


localStorage.setItem('userId', userId)
localStorage.setItem('email', email)
localStorage.setItem('contact_no', contact_no)
localStorage.setItem('user_type', user_type)
localStorage.setItem('first_name', first_name)
localStorage.setItem('last_name', last_name)