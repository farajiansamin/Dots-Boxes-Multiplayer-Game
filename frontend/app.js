

var closePopup = document.getElementById("popupclosestart");
var overlay = document.getElementById("overlay");
var popupCreateGame = document.getElementById("popupCreateGame");
var popupJoinGame = document.getElementById("popupJoinGame");
var button = document.getElementById("button");

function showPopupCreategame(text, color) {
  // console.log(document.getElementById('popuptext'));
  document.getElementById('popuptextCreateGame').innerHTML = text;
  document.getElementById('popuptextCreateGame').style.color = color;

  overlay.style.visibility = 'visible';
  popupCreateGame.style.visibility = 'visible';
  document.getElementById('gameID-input').style.visibility = "hidden"

}
function showPopupJoingame(text, color) {
  // console.log(document.getElementById('popuptext'));
  document.getElementById('popuptextJoinGame').innerHTML = text;
  document.getElementById('popuptextJoinGame').style.color = color;

  overlay.style.visibility = 'visible';
  popupJoinGame.style.visibility = 'visible';

}




// Close Popup Event
closePopup.onclick = function () {
  overlay.style.visibility = 'hidden';
  popupCreateGame.style.visibility = 'hidden';
  popupJoinGame.style.visibility = 'hidden';


};






const start_btn = document.getElementById('start_btn');
// // console.log(start_btn.attributes)
// document.querySelector("start_btn").style.color= "green";
//
start_btn.addEventListener('click', async _ => {
  try {
    const res = await fetch("http://localhost:3000/start_game", {
      method: 'post',
      body: {
      }
    });

    // console.log('Completed!', await res.text())
    let game = await res.json()
    window.localStorage.setItem("gameId", game.GameID);
    console.log("GAME_ID" + game.GameID)
    let text = "Game ID: " + game.GameID
    let color = "black";
    // document.getElementById('gameID-input').remove();
    showPopupCreategame(text, color);
    //popup to show the

  } catch (err) {
    console.error(`Error: ${err}`);
  }
});



const join_btn = document.getElementById('join_btn');
join_btn.addEventListener('click', () => {

  let text = "join a game by entering game id"
  let color = "black";

  showPopupJoingame(text, color);

  document.getElementById('gameID-input').style.visibility = "visible"


});




document.getElementById("continue_btn_start")
  .addEventListener("click", async () => {
    await create_user(document.getElementById("username-input").value)
    window.location.href = "/game.html";

  })

async function create_user(name) {
  const res = await fetch(`http://localhost:3000/create-game`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameId: window.localStorage.getItem("gameId"),
      name
    })
  });
  const resBody = await res.json();
  console.log("userId", resBody['userId'])
  window.localStorage.setItem("userId", resBody['userId'])

}




const continue_btn_join = document.getElementById("continue_btn_join");
// console.log (continue_btn)

continue_btn_join.addEventListener('click', async _ => {
  try {
    // create_user(document.getElementById("username-input").value)
    const res = await fetch("http://localhost:3000/join-game", {

      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        GameID: document.getElementById("gameID-input").value,
        name: document.getElementById("username-input-join").value
        // document.getElementById("gameID-input").value,
        // Username:document.getElementById("username-input-join").value

      })
    });

    let resjason = await res.json()
    localStorage.setItem('userId', resjason.userid);
    localStorage.setItem('gameId', resjason.game.id);
    console.log(resjason)

    window.location.href = "/game.html";



  } catch (err) {
    console.error(`Error: ${err}`);
  }
});



// button.onclick = ()=>showPopup("salam")
// Show Overlay and Popup
