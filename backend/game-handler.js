class GameUtil {
    players = []
    id = ""
    start = false;
    turn = 0;
    squares = []
    scores = [0, 0, 0]

    initialize(game, player1, gameId) {
        game.id = gameId;
        game.players.push(player1);
        game.scores = [0, 0, 0];
        game.squares = [];
        game.save();
    }

    addPlayer(game, player) {
        game.players.push(player);
        if (game.players.length == 3) {
            game.start = true;
        }
        game.save();
    }
    makeMove(game, squares, filledSquare, scores) {

        game.squares = squares;
        if (!filledSquare)
            game.turn = (game.turn + 1) % 3
        game.scores = scores;
        game.save();
    }
}

module.exports = new GameUtil();
