let express = require("express")
let router = express.Router();
let fs = require('fs')
const bcrypt = require('bcrypt');
let axios = require('axios')

//**to parse the req.body data sent from front end into json format so that it is readable/accessible to the routes handlers at the server**//
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

let bodyParser = require('body-parser')
router.use(bodyParser.json());

//setting up knex//
let knexfile = require('../knexfile').development;
let knex = require('knex')(knexfile);
knex.select();

//*****requiring  User class *********//
let User = require("../models/User");


module.exports = router;

//****Routing******//
//===========================================SIGNUP***API===========================================///

router.get('/signup', (req, res) => {
  res.render('signup')
});

router.get('/login', (req, res) => {
  res.render('login')
});


//===========================================students and teachers signup-API===========================================///



router.post("/signup", async (req, res) => {
  // console.log('hellooo');
  // console.log(req.body);
  try {
    //   const { email, password } = req.body;

    let user = new User();  //it is referencing to user class//
    user = req.body     //rew body from front end//
    // console.log(req.body);
    user.user_type = "STUDENT"

    const userExists = await knex('users').where('email', user.email).first();
    if (userExists) {
      return res.render("signup", { alertText: "! User Already Exists" });
    }

    else {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword


    await knex('users').insert(user);
    // res.send('User added to the database');
    let response = res.render('login',{alert : 'Yayy! You have successfully created an account, try to login now'})
    // console.log(response);
    }

  } catch (error) {
    console.log(error);
    res.render('signup');
  }
});




//============creating function for getting all courses fro database to be used for sending response to the admin courses handlebar================//


async function allcourses() {
  try {
    let allcourses = await knex.select('*').from('courses')
    // console.log(allcourses);
    return allcourses;
  } catch (error) {
    throw error;
  }
}




//=======================================================================================//
// Defining the logic for the second API as a separate function//
//and then later use that function inside the login API//


async function getMyCourse(userid) {
  try {
    let myCourse = await knex('courses')
      .join('users_course', 'courses.id', '=', 'users_course.course_id')
      .where('users_id', userid)
      .select('users_id', 'courses.id', 'course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description');

    let username = await knex.select('id', 'first_name', 'last_name')
      .from('users')
      .where('id', userid);

    return { myCourse, personName: username[0] };
  } catch (error) {
    throw error;
  }
}



router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    const user = await knex('users').where('email', email).first();
    if (!user) {
      return res.render('login', { incorrectEmail: '! Incorrect email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render('login', { incorrectPassword: '! Incorrect password' });
    }

    if (user.user_type === "ADMIN") {
      // res.render('teachers', { layout: "users" });
      let functionData = await getMyCourse(user.id)
      let { myCourse, personName } = functionData
      // console.log(functionData);
      let allcoursesdata = await allcourses() ///calling the function here that was defined before to get courses data from database using knex==//

      // console.log(allcoursesdata);

      // res.render('teachers', { layout: 'users', course: myCourse, personName });
      res.render('admin', { layout: false, name: personName, courses: allcoursesdata });


    } else if (user.user_type === "STUDENT") {
      // Call the function for the second API
      let functionData = await getMyCourse(user.id)     //the above function getmycourse() is called here, it takes the user.id received from 
      //current knex query as argument and returns us knex queries made inside that function previously//

      let { myCourse, personName } = functionData         //desctructuring the get myMyCourse function and extracting the values of myCourse and personName// 
      res.render('student', { layout: false, course: myCourse, name: personName });
    }
  } catch (error) {
    console.log(error);
    res.render('login');
  }
});






//===========================================Might Need it Later=========================//

// router.get('/mycourse/:userid', async (req, res) => {
//   try {
//     let userid = req.params.userid;

//     // Call the function for the second API
//     const { myCourse, personName } = await (userid);

//     res.render('student', { layout: 'users', course: myCourse, personName });
//   } catch (error) {
//     res.send(error);
//   }
// });













//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//===========================================old API for logIn with bcrypt====================================/////


// router.post("/login", async (req, res) => {
//   try {
//     let email = req.body.email
//     let password = req.body.password


//     const user = await knex('users').where('email', email).first();
//     if (!user) {
//       return res.send("Incorrect email");
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.send("Incorrect password");
//     }

//     if (user.user_type === "ADMIN") {
//       res.render('teachers',{layout: "users"});

//     } else if (user.user_type === "STUDENT")
//       res.render('student',{layout: "users"});

//   } catch (error) {
//     console.log(error);
//     res.render('login');
//   }
// });




//==================old code============================================================//

// router.post("/signup", async (req, res) => {

//     try {

//         let user = new User();

//         user = req.body  //it is referencing to user class//
//         user.user_type = "STUDENT"
//         console.log(user);

//         let userExists = await knex.count().from("users").where('email', user.email)
//         //the knex query returns a count object with a string value so need to parse it//

//         let count = parseInt(userExists[0].count);
//         // console.log(count);
//         if (count) {
//             res.send("! User Already Exists")

//         } else {
//             await knex.insert(user).into("users")
//             res.send('user addedto database') //after signup redirecting to login page
//         }
//     } catch (error) {
//         console.log(error);
//         // res.send("Error occured")
//         res.render('signup')
//     }
// });
