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


router.post('/search', async (req, res) => {

    //this  /search api is hit by form tag in main.hadlebars file//
    try {
        searchquery = req.body.query;
        // console.log(searchquery);

        let results = await knex('courses')
            .select('course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description')
            .whereRaw(`course_name @@ to_tsquery(?)`, [searchquery])

        // console.log(results);  

        res.render('search', { searchresults: results })

    } catch (error) {
        res.render('home')
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


//===========================================api for enrolling into a course===================================================///

router.get('/enrollcourses', (req, res) => {
    res.render('enrollcourses')
})


router.post('/enroll', async (req, res) => {
    try {
        let newEnroll = req.body

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

            // let enrollArr = enroll[0]

            res.render('enrollmentSuccess', { alert: 'Course enrollment successful !' })
            // console.log(enrollArr)
        }

    } catch (error) {
        res.send("! You must be logged in before enrolling for any course")
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


// we are using post method to this api here to render the page bcoz using fetch to get this api in frontend had some issues
//so we created it as a form and when clicking the submit button that is edit in this case it hits this api and also sends 
//course id to backend  

//===get api for update course===//
router.post('/updateCourseForm', async (req, res) => {

    try {
        let courseid = req.body.id
        let coursedata = await knex.select('*').from('courses')
            .where('courses.id', '=', courseid)
        // the data received from this query will be put 
        //in value feild of editcourse.handlebar form//
        //  console.log(coursedata);

        //==knex sends an array ob object so we have to access that object==//
        res.render('editCourse', { editcoursedata: coursedata[0], layout: 'users' })

    } catch (error) {
        res.send(error)
    }
})




//===== api for update course=====//

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

        // res.send('updated successfully')
        res.render('enrollmentSuccess',{message:' course updated successfully'})

    } catch (error) {
        res.send(error)
    }
})




///======================================api for deleting a course======================================///

//this is done same as update course becoz the course id is sent from front end as a form input 
// and then the /delete api is hit and knex query is carried out//

router.post('/deleteCourse', async (req, res) => {

    try {
        let courseid = req.body.id
        // console.log(courseid);
        //**** deleting foreign keys first from users_course table***//

        let deleted = await knex('users_course')
            .where('course_id', courseid)
            .del()
        //    console.log(deleted);  

        let deletedCourse = await knex('courses')
            .where('id', courseid)
            .del(['courses.id', 'course_name'])

        // let deletedObj = deletedCourse[0]
        res.render('enrollmentSuccess', {text: 'Course Deleted'})
        // console.log(deletedObj);
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;