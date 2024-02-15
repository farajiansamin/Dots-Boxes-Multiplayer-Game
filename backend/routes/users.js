const express = require('express');
let router = express.Router();
const usersMap = new Map()


router.get('/get-user', function (req, res, next) {
    const userId = req.header("user-id");
    if (userId && usersMap.has(userId)) {
        res.send("Your name is" + usersMap.get(userId))
        return;
    }
    else {
        res.send("Your id is not correct");
    }
});

// router.post('/create-user', function (req, res, next) {

//     const newUserId = makeid(5);
//     usersMap[newUserId] = req.body.name;
//     res.jsonp({ id: newUserId })
// });


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = router;
