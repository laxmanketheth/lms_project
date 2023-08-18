//===user class to be used in courses.js======//////

class Course{
    constructor(course_name, price, duration, start_date, end_date, course_description){

    this.course_name = course_name,
    this.price = price,
    this.duration = duration,
    this.start_date = start_date,
    this.end_date = end_date,
    this.course_description = course_description
    }

}

module.exports = Course