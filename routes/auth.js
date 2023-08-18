let express = require("express")
let router = express.Router();
let fs = require('fs')

router.use(express.json());

//setting up knex//
let knexfile = require('../knexfile').development;
let knex = require('knex')(knexfile);
knex.select();

//*****requiring  User class *********//
let User = require("../models/User");


//****Routing******//
//***************************SIGNUP***API***************************///

router.get('/signup', (req, res) => {
    res.render('signup')
})



router.post("/signup", async (req, res) => {

    try {

        let user = new User();

        user = req.body  //it is referencing to user class//
        user.user_type = "STUDENT"
        console.log(user);

        let userExists = await knex.count().from("users").where('email', user.email)
        //the knex query returns a count object with a string value so need to parse it//

        let count = parseInt(userExists[0].count);
        // console.log(count);
        if (count) {
            res.send("! User Already Exists")

        } else {
            await knex.insert(user).into("users")
            res.send('user addedto database') //after signup redirecting to login page
        }
    } catch (error) {
        console.log(error);
        // res.send("Error occured")
        res.render('signup')
    }
});


//**************************API for signIn********************/////

router.post("/login", async (req, res) => {

    try {
        let email = req.body.email
        let password = req.body.password


        let user = new User();

        let userArr = await knex.select('first_name', 'last_name', 'email', 'password', 'contact_no', 'user_type').from("users").where('email', email)
        //knex query returns an array of object here//

        user = userArr[0]

        if (user == null) {
            res.send("incorrect email")
        }
        else if (user.password != password) {
            res.send("incorrect password")
        }

        else {
            if (user.user_type == "ADMIN") {
                res.render('teachers')
                // console.log(user.user_type);
            }
            else if (user.user_type == "STUDENT"){
                res.render('students')
                // console.log(user.user_type);
            }
        }
    }
    catch (error) {
        console.log(error);
        // res.send(error)
        res.render('login')
    }
})




module.exports = router;