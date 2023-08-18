//****all the courses related api *//

let express = require("express")
let router = express.Router();

router.use(express.json());

let knexfile = require('../knexfile').development;
let knex = require('knex')(knexfile);
knex.select();


//*****requiring Course class *********//
let Course = require('../models/Course');


//****Routing******//

//==========================================api for all course========================================//

router.get('/allcourses', async (req, res) => {
    let allcourses = await knex.select('*').from("courses");
    // console.log(allcourses);

    res.send(allcourses)// need to put the res data into handlebars//
})



//==========================================api for getting single course============================//


router.get('/singlecourse/:courseid', async (req, res) => {

    let courseid = req.params.courseid
    let singlecourse = await knex.select('*').from('courses').where('id', courseid)
    res.send(singlecourse)
    // console.log(singlecourse);
})



//=========================================api for mycourse or users course============================================//


router.get('/mycourse/:userid', async (req, res) => {
    try {
        let userid = req.params.userid

        let myCourse = await knex('courses')
            .join('users_course', 'courses.id', '=', 'users_course.course_id')
            .where('users_id', userid)
            .select('courses.id', 'course_name', 'price', 'duration', 'start_date', 'end_date', 'course_description')

        // console.log(myCourse);
        res.send(myCourse)

    } catch (error) {
        res.send(error)
    }
})


//===========================================api for enrolling into a course===================================================///


router.post('/enroll', async (req, res) => {
    try {
        let newEnroll = req.body;

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
            console.log(enrollArr)
        }

    } catch (error) {
        res.send(error)
    }
})

//======================================api for adding a new  course======================================///


router.post('/addcourse', async (req, res) => {

    try {
        let course = new Course();
        course = req.body
        //  console.log(course);
        let courseExists = await knex.count().from("courses").where('course_name', course.course_name)

        let count = parseInt(courseExists[0].count);
        // console.log(courseExists);

        if (count) {
            res.send('! Course Already Exists')
        } else {
            let addCourse = await knex.insert(course, ['*']).into("courses")
            //    console.log(addCourse);
            let courseData = addCourse[0]
            res.send(courseData)
            // console.log(courseData);
        }

    } catch (error) {
        res.render('addcourse')
    }

});


///======================================api for updating a course======================================///

router.put('/updateCourse/:courseid', async (req, res) => {

    try {
        let courseUpdate = new Course();
        courseUpdate = req.body
        // console.log(courseUpdate);
        let courseid = req.params.courseid
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

        res.send(updates)
        console.log(updates);

    } catch (error) {
        res.send(error)
    }
})


///======================================api for deleting a course======================================///

router.delete('/deleteCourse/:courseid', async (req, res) => {

    try {
        let courseid = req.params.courseid
        let deleted = await knex('users_course')
            .where('course_id', courseid)
            .del()
        //    console.log(deleted);           
        let deletedCourse = await knex('courses')
            // .join('users_course', ' courses.id','=', ' users_course.course_id')
            .where('id', courseid)
            .del(['courses.id', 'course_name'])
        //  let deleted =  await knex('courses')
        //  .join('users_course', ' courses.id','=', ' users_course.course_id')
        //  .where('id', courseid)
        //  .del()              
        let deletedObj = deletedCourse[0]
        res.send(deletedObj)
        console.log(deletedObj);
    } catch (error) {
        res.send(error)
    }
})



///======================================api for searching a course in search bar======================================///

// Define a route for the GET request
router.get('/search', async (req, res) => {


    try {
        const searchTerm = req.query.q; // Get the search term from the query parameter

        let results =   await knex('courses')
                         .select('course_name','price', 'duration','start_date', 'end_date','course_description')
                       .whereRaw(`course_name @@ to_tsquery(?)`, [searchTerm]);

                         res.send(results);
                         console.log(results);

    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: 'An error occurred while performing the search.' });
    }

});

//  router.get('/search', (req, res) => {
//     const searchTerm = req.query.q; // Get the search term from the query parameter

//     db('courses')
//        .whereRaw(`course_name @@ to_tsquery(?)`, [searchTerm])
//        .then((results) => {
//           // Send the query results as the response
//           res.json(results);
//        })
//        .catch((error) => {
//           // Handle any errors
//           res.status(500).json({ error: 'An error occurred while performing the search.' });
//        });
//  });

module.exports = router;