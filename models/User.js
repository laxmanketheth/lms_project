
//===user class to be used in auth.js======//////

class User {
    constructor(first_name,last_name,password,email,contact_no){
        this.first_name = first_name,
        this.last_name = last_name,
        this.password = password,
        this.email = email,
        this.contact_no = contact_no,
        this.user_type = "STUDENT"
    }
}

module.exports =  User