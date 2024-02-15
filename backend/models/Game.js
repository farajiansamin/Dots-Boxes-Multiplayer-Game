const mongoose = require("mongoose")


const Schema = mongoose.Schema(
    {
        players: [{ type: String }],
        id: { type: String, required: true, unique: true },
        start: { type: Boolean, default: false },
        turn: { type: Number, default: 0 },
        scores: [{ type: Number }],
        squares: { type: Object },
    },
    { collection: "games" }
);

module.exports = mongoose.model("Game", Schema);
