// 


import express from "express";
import bodyParser from "body-parser";
import pg from "pg" ; 





const app = express();
const port = 3000;
//creting a blue print from the installed package(pg) , and filling up credentials to send them later when we connect ! 
const db =pg.Client({ 
  user:"postgres",
  host:"localhost",
  database:"Flags",
  passworde:"the password for your database ",
  port:5432,
});


db.connect(); //connect and strating the connection to our database along with providing our info ! 

let quiz = [];

// reading the capital table in our world database , 
//  and assigning the values or the rows as the new set of questions that we will send to the useer
// instead of 3 questions ! 
db.query("SELECT * FROM flags" , (err,res) =>{

  if (err){
    console.error("Error executing query", err.stack);
  } else{
    quiz=res.rows ; //replacing the old quiz with the new record of values extracted fromn the postgres database ! 
  }
  db.end(); //closing the connection  after we finished reading ! 
});



// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// now mwe wil use what we have extracted from the postgres db and using them in our app ! 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let currentQuestion = {};







// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});









// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim(); //removing spaces from the answer we get from the user 
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) { //if capital provided by user is true
    totalCorrect++; //increase score
    console.log(totalCorrect);
    isCorrect = true; //we  will use it to change animations in index.ejs
  }

  nextQuestion(); //calling next function to generate a new random current question 
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect, //we  will use it to change animations in index.ejs
    totalScore: totalCorrect,
  });
});





// the function that will generayte a random question and assign it as a value to the 
// current question , every time we call it ! 
function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}




// listening on the local host 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
