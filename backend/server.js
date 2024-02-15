const express = require("express");
const path = require('path')
const http = require("http")
const cors = require('cors');
const mongoose = require('mongoose');

// const port= 3000
// const socketio = require("socket.io")


mongoose.connect("mongodb://localhost:27017/dots").then(() => console.log("DB Connected"));
require("./models/Game");
require("./models/User");


const Game = mongoose.model("Game");
const User = mongoose.model("User");

const GameUtil = require("./game-handler");


const app = express()
const server = http.createServer(app)
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());
app.use(express.json())

let GameID;


// const users = require("./routes/users")
// app.use("/users", users)


server.listen(3000, function () {
  console.log("server runing on port 3000")
});


app.post("/start_game", function (req, res, next) {
  GameID = makeid(6);
  res.send({
    GameID: GameID
  })
})



app.post("/create-game", function (req, res) {

  let newUserId = makeid(5);
  const gameId = req.body.gameId;
  const user = new User();
  user.id = newUserId;
  user.name = req.body.name;
  user.save();

  const game = new Game();
  GameUtil.initialize(game, newUserId, gameId);

  res.jsonp({ userId: newUserId, game })


})



app.post("/join-game", async function (req, res, next) {

  let GameID = req.body.GameID
  let newUserId = makeid(5);
  console.log("reqbodyname", req.body.name)
  const user = new User();
  user.id = newUserId;
  user.name = req.body.name;
  user.save();

  const game = await Game.findOne({ "id": GameID })

  GameUtil.addPlayer(game, newUserId);

  res.jsonp({ game, userid: newUserId })
})


app.get("/games/:id", async function (req, res, next) {

  let gameId = req.params.id
  const game = await Game.findOne({ "id": gameId })

  if (game) {
    res.jsonp({
      game
    })
  }
  else {
    res.sendStatus(404);
  }
})


app.post("/games/:id/move", async function (req, res, next) {

  let gameId = req.params.id
  const game = await Game.findOne({ "id": gameId })
  GameUtil.makeMove(game, req.body.squares, req.body.filledSquare, req.body.scores);

  if (game) {
    res.jsonp({
      game
    })
  }
  else {
    res.sendStatus(404);
  }



})













/// This fuction creates unique userIDs, and gameIDs
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




