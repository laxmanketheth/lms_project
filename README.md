
# LMS Project 

# Project Title : Coding Guru

The title of our project is Coding Guru. It is a Learning Management System (LMS) project built with Node.js and Express. It allows students to login and enroll in courses, and administrators to login and manage courses.


# Prerequisites

- Node.js installed on your machine
- NPM (Node Package Manager) installed on your machine


# Installation

    1. Clone the repository: git clone <repository-url>

    2. Navigate to the project directory: cd Node-project

    3. Install the requiered dependencies: npm install


4. Create a .env file in the project root directory and configure the following :

     PORT = 8080

    DATABASE_USERNAME=<Db-userName>
    DATABASE_NAME=<db-name>
    DATABASE_PASSWORD=<db-password>


5. Create the necessary database tables using Knex migrations:

    npx knex migrate:latest


6. Start the server:

    - Open the Terminal / Ubuntu
    - Use the cd command to navigate to the directory that contains your          JavaScript file that you would like to run.
    - Execute the file using the node command, followed by the file name:  
    node index.js.

    - The server should now be running at `http://localhost:8080`.


# Using of the project

 # For Student

 1. To access the LMS/Coding Guru as a student, navigate to
     http://localhost:8080 in your browser.

 2. Click on the "Login" button and enter your credentials.
   - Once logged in, you'll see the list of courses you have already 
        enrolled into.
   - You can also see list of courses available for enrollment.
   - Click on a course to view its details and enroll in it.


#  For Admin

  1. To access the LMS/Coding Guru as a student, navigate to
     http://localhost:8080 in your browser.

  2. Click on the "Login" button and enter your admin credentials.
     - Once logged in, you'll see a dashboard with options to add, edit, or delete courses.

# Dependencies

  * Express: A web application framework for Node.js.
  * Handlebars: A templating engine for building dynamic HTML pages.
  * Knex: A SQL query builder for Node.js that supports multiple database systems.
  * dotenv: A module for loading environment variables from a .env file.
  * bcrypt: A library for hashing and salting passwords.
   