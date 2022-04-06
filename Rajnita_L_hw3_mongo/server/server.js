// To connect with your mongoDB database
const mongoose = require('mongoose');

// CHANGE the username,password,link to be yours!
mongoose.connect('mongodb+srv://rajnita:webtechpwd@cluster0.gzlp0.mongodb.net/',{
  dbName: 'mybusiness',
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// schema for our table called 'Movies'
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Movie = mongoose.model('movies', MovieSchema); // creates a 'Movies' table
//\\Movie.createIndexes();

// express middleware
const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listen at port 9000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {
  resp.send("App is Working");
  // go to http://localhost:9000 to see this
});

app.post("/register", async (req, resp) => {
  try {
    const movie = new Movie(req.body);
    // .save() sends data to our cloud DB, more here: https://masteringjs.io/tutorials/mongoose/save
    let result = await movie.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("Movie already registered");
    }

  } catch (e) {
    resp.send("Something went wrong");
  }
});
app.listen(9000);