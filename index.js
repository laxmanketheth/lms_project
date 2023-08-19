let express = require("express");
let app = express();
let hb = require("express-handlebars");



let port = 8080;

//***** requiring routes from routes folder file***//

let authRoute = require("./routes/auth");
let coursesRoute = require("./routes/courses")

app.use("/courses", coursesRoute);
app.use("/auth",authRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.engine("handlebars", hb.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let knexfile = require('./knexfile').development;
let knex = require('knex')(knexfile);
knex.select();



app.listen(port,()=>{
    console.log("listening to port 8080");
})







