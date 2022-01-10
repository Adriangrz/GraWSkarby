const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    socketId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number
    }
});

playerSchema.statics.findNextPlayer = async (socketId) => {
    let player = await Player.findOne({ socketId: socketId });
    let nextPlayer = await Player.findOne({ _id: { $gt: player._id } }).sort({ _id: 1 });
    if (!nextPlayer) nextPlayer = await Player.findOne({}).sort({ _id: 1 });
    return nextPlayer;
}

playerSchema.statics.addPointsToPlayer = async (socketId,valueOfCell) =>{
    let player = await Player.findOne({ socketId: socketId });
    let currentPoints = player.points;
    player.points = currentPoints + parseInt(valueOfCell);
    await player.save();
}

playerSchema.statics.addPlayer = async (socketId,name,points) =>{
    const player = new Player({
        socketId: socketId,
        name: name,
        points: points,
    });
    await player.save();
}

playerSchema.statics.getPlayerOrPlayersWithMaxPoints = async () =>{
    let max = 0;
    let winners = [];
    let players = await Player.find().sort({ points: -1 }).limit(2);
    players.forEach((element) => {
        if (element.points === max) {
            winners.push(element.name);
        }
        if (element.points > max) {
            winners = [];
            winners.push(element.name);
            max = element.points;
        }
    });
    return winners;
}

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;