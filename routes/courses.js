//****all the courses related api *//

let express = require("express")
let router = express.Router();

router.use(express.json());

let knexfile = require('../knexfile').development;
let knex = require('knex')(knexfile);
knex.select();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use(express.static("public"));


//*****requiring Course class *********//
let Course = require('../models/Course');


//****Routing******//



//==========================================api for  course available for enrollment========================================//

router.get('/coursesavailable', async (req, res) => {

    try {
        let allcourses = await knex.select('*').from("courses");

        // console.log(allcourses);


        // console.log(coursesobj);
        res.render('coursesavailable', { courses: allcourses, layout: 'users' })// we need to assign data received from database to a key and place it inside an object//
        //in this case assigning allcourses data to courses and place it inside an object using curly braces//


    } catch (error) {
        res.send(error)
    }
});





//==========================================api for All course ========================================//
router.get('/allcourses', async (req, res) => {

    try {
        let allcourses = await knex.select('*').from("courses");

        // console.log(allcourses);


        // console.log(coursesobj);
        res.render('allcourses', { courses: allcourses, title: 'All courses' })// we need to assign data received from database to a key and place it inside an object//
        //in this case assigning allcourses data to courses and place it inside an object using curly braces//


    } catch (error) {
        res.send(error)
    }
})





///======================================api for searching a course in search bar======================================///


// router.get('/search/:query', async (req, res) => {


//     try {
//         searchquery = req.params.query

//         let results = await knex('courses')
//             .select('course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description')
//             .whereRaw(`course_name @@ to_tsquery(?)`, [searchquery]);  //In Knex, the whereRaw() method is used to include raw SQL expressions within the WHERE clause of a query.
//                                                                       // It allows you to write custom SQL conditions that are not handled by the built-in query builder methods.
//                                                                         //here the course_name is the column that will be compared with the value that will br provided from front end//
//             console.log(results);   
//             res.render('search',{searchresults : results})




//     } catch (error) {
//         res.send(error)
//         // Handle any errors
//         // res.status(500).json({ error: 'An error occurred while performing the search.' });
//     }

// });



router.post('/search', async (req, res) => {


    try {
        searchquery = req.body.query;
        // console.log(searchquery);

        let results = await knex('courses')
            .select('course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description')
            .whereRaw(`course_name @@ to_tsquery(?)`, [searchquery])

        // console.log(results);  

        res.render('search', { searchresults: results })

    } catch (error) {
        res.send(error)
    }

});



//==========================================api for getting single course============================//


router.post('/singlecourse', async (req, res) => {
    try {
        let courseid = req.body.id  //this req.body.id is comig from allcourse handlebar form//
        // console.log(courseid);
        let singlecourse = await knex.select('*').from('courses').where('id', courseid)

        singlecourse = singlecourse[0]
        //    console.log(singlecourse);

        res.render('singlecourse', { course: singlecourse })

        // console.log(singlecourse);
    } catch (error) {
        res.send(error)
    }
})




//=========================================api for mycourse or users course============================================//

//******* */ this api is called using functin in auth file when the student is loggin in*******//



// router.get('/mycourse/:userid', async (req, res) => {
//     try {
//         let userid = req.params.userid

//         let myCourse = await knex('courses')
//             .join('users_course', 'courses.id', '=', 'users_course.course_id')
//             .where('users_id', userid)
//             .select('users_id', 'courses.id', 'course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description')
//         // console.log(myCourse);

//         let username = await knex.select('id', 'first_name', 'last_name')
//             .from('users')
//             .where('id', userid)
//         username[0]
//         // console.log(username);

//         res.render('student', { layout: 'users', course: myCourse, personName: username[0] })


//     } catch (error) {
//         res.send(error)
//     }
// })


//===========================================api for enrolling into a course===================================================///

router.get('/enrollcourses', (req, res) => {
    res.render('enrollcourses')
})


router.post('/enroll', async (req, res) => {
    try {
        let newEnroll = req.body;
        // console.log(newEnroll);
        let existingEnroll = await knex('users_course')
            .where({
                users_id: newEnroll.users_id,
                course_id: newEnroll.course_id
            })
            .first()  //***this returns the first row of table that matches the conditon given***//

        if (existingEnroll) {
            res.send('! You Are Already Enrolled In This Course')
        }
        else {
            let enroll = await knex.insert(
                {
                    users_id: newEnroll.users_id,
                    course_id: newEnroll.course_id
                }, ['id', 'users_id', 'course_id']
            ).into('users_course')

            let enrollArr = enroll[0]

            res.send(enrollArr)
            // console.log(enrollArr)
        }

    } catch (error) {
        res.send("! You must be logged in before enrolling for any course")
    }
})

//======================================api for getting user profile======================================///

router.get('/myprofile/:userid', async (req, res) => {

    try {
        let userid = req.params.userid

        let myprofile = await knex.select('first_name', 'last_name', 'password', 'email', 'contact_no').from('users').where('id', userid)
        myprofile = myprofile[0]
        res.send(myprofile)
        // console.log(myprofile);
    } catch (error) {
        res.send(error)
    }

})

//======================================api for adding a new  course======================================///


router.get('/addcourse', (req, res) => {
    res.render('addcourse', { layout: false })
})


router.post('/addcourse', async (req, res) => {

    try {
        let course = new Course();
        course = req.body
        //  console.log(course);
        let courseExists = await knex.count().from("courses").where('course_name', course.course_name)

        let count = parseInt(courseExists[0].count);
        // console.log(courseExists);

        if (count) {
            res.render('addcourse', { alert: '! Course You Entered Already Exists', layout: false })

        } else {
            let addCourse = await knex.insert(course, ['*']).into("courses")
            //    console.log(addCourse);
            let courseData = addCourse[0]

            res.render('courseaddedsuccessful', { alert: 'You added new course successfully !', layout: 'users' })
            // res.send(courseData)
            // console.log(courseData);

        }

    } catch (error) {
        res.render('addcourse', { layout: false })
    }

});


///======================================api for updating a course======================================///

//===get api for update course===//
router.post('/updateCourseForm', async (req, res) => {

  try{  
    let courseid = req.body.id
    let coursedata = await knex.select('*').from('courses')
        .where('courses.id', '=', courseid)
      // the data received from this query will be put 
     //in value feild of editcourse.handlebar form//
    //  console.log(coursedata);

    //==knex sends an array ob object so we have to access that object==//
    res.render('editCourse', {editcoursedata: coursedata[0], layout: 'users' })
    
}catch(error){
        res.send(error)
    }
}) 




//=====put api for update course=====//

router.post('/updateSingleCourse', async (req, res) => {
    // console.log('update');
    try {
        let courseUpdate = new Course();
        courseUpdate = req.body
        // console.log(courseUpdate);
        let courseid = courseUpdate.id
        //  console.log(courseid);

        let updates = await knex('courses')

            .where('courses.id', '=', courseid)
            .update({
                course_name: courseUpdate.course_name,
                price: courseUpdate.price,
                duration: courseUpdate.duration,
                start_date: courseUpdate.start_date,
                end_date: courseUpdate.end_date,
                course_description: courseUpdate.course_description
            }, ['*'])

         res.send('updated successfully')
    
    } catch (error) {
        res.send(error)
    }
})


///======================================api for deleting a course======================================///

router.post('/deleteCourse', async (req, res) => {
console.log('yes');
    try {
        let courseid = req.body.id
        console.log(courseid);
     //**** deleting foreign keys first from users_course table***//
       
     let deleted = await knex('users_course')
            .where('course_id', courseid)
            .del()
        //    console.log(deleted);  
      
        let deletedCourse = await knex('courses')
            .where('id', courseid)
            .del(['courses.id', 'course_name'])

        // let deletedObj = deletedCourse[0]
        res.send('Course Deleted !')
        // console.log(deletedObj);
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;