// alert("hey")
//  let h = document.querySelector("h1").attributes;
//  console.log(h)
//
// document.querySelector("h1").style.color= "green";

// colours

//socket connection
// const socket= io();

let start;

window.addEventListener("load", async _ => {
  try {
    // const Username= document.getElement
    const gameId = window.localStorage.getItem("gameId");
    const userId = window.localStorage.getItem("userId");

    if (!gameId || !userId) {
      window.location.href = "/";
    }
    const startInterval = setInterval(async () => {
      const res = await fetch(`http://localhost:3000/games/${gameId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'user-id': userId
        },
      });
      // console.log( await res.json())
      let resjson = await res.json()

      start = resjson.game.start
      if (!resjson.game.start) {
        showWaitPopup();
      }
      else {
        clearInterval(startInterval)
        run()
      }
    }, 1000);

  }
  catch (e) { }
})


function showWaitPopup() {

  var closePopup = document.getElementById("popupclose");
  var overlay = document.getElementById("overlay");

  var popup = document.getElementById("popup");
  var button = document.getElementById("button");

  let text = " Please wait until other players join"
  let color = "black"
  showPopup(text, color)

  function showPopup(text, color) {
    // console.log(document.getElementById('popuptext'));
    document.getElementById('popuptext').innerHTML = text;
    document.getElementById('popuptext').style.color = color;

    overlay.style.visibility = 'visible';
    popup.style.visibility = 'visible';
  }
  // Close Popup Event
  closePopup.onclick = function () {
    overlay.style.visibility = 'hidden';
    popup.style.visibility = 'hidden';
  };
}
