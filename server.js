/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Shivam Nagar Student ID: 142227230 Date: July 20, 2024
*
********************************************************************************/ 



const HTTP_PORT = process.env.PORT || 8080; // Defining 8080 as our port to listen
const express = require("express"); // Import the express module
const path = require('path'); // Import the path module
const collegeData = require('./modules/collegeData'); // Import the collegeData module

const app = express(); 

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Adding body-parser
app.use(express.urlencoded({ extended: true }));

// Defining our route to get all students and/or students by course
app.get('/students', (req, res) => {
  const course = req.query.course; // Get the course query parameter
  if (course) {  // If given course query parameter then get students by course id
    collegeData.getStudentsByCourse(course)
      .then(students => res.json(students)) // Send the students data as JSON
      .catch(err => res.status(404).send(err)); // Send an error message if there's an issue
  } else {
    // If no course query parameter is provided, get all students
    collegeData.getAllStudents()
      .then(students => res.json(students)) // Return the JSON string of student
      .catch(err => res.status(404).send(err)); // catch the error if an issue
  }
});

//  Defining our route to get all TAs
app.get('/tas', (req, res) => {
  collegeData.getTAs()
    .then(tas => res.json(tas)) // Return the JSON string of Managers from TA call
    .catch(err => res.status(404).send(err)); // catch the error if an issue
});

// Defining our route to get all courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then(courses => res.json(courses)) // Return all courses
    .catch(err => res.status(404).send(err)); // catch the error if an issue
});

// Defining our route to get a specific student by their student number
app.get('/student/:num', (req, res) => {
  const num = req.params.num; // Get the student number from the route parameters
  collegeData.getStudentByNum(num)
    .then(student => res.json(student)) // Return the student data as JSON
    .catch(err => res.status(404).send(err)); // catch the error if issues found
});

// This route simply returns the html code from the home.html 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html')); // Send the home.html file
});

// Route to return the HTML code from about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html')); // Send the about.html file
});

// Route to return the HTML code from htmlDemo.html
app.get('/htmlDemo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/htmlDemo.html')); // Send the htmlDemo.html file
});

// Route to adding students 
app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

// Post route for adding students
app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body)
      .then(() => {
          res.redirect("/students");
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send("Error adding student");
      });
});


// Handling invalid and/or no matching routes "Page Not Found" with HTTP status 404
app.use((req, res) => {
  res.status(404).send("Page Not Found"); // Send a 404 error message for undefined routes
});

// Initialize data and start server
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => { // Start the server only after data initialization is successful
      console.log(`Server is listening on port ${HTTP_PORT}`); // Log in console the server start message
    });
  })
  .catch(err => {
    console.error(`Failed to initialize data: ${err}`); // Log error message if initialization does not work
  });
