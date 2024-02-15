const mongoose = require("mongoose")


const Schema = mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
    },
    { collection: "users" }
);

module.exports = mongoose.model("User", Schema);
