const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/eFootballTournaments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define schema and model
const tournamentSchema = new mongoose.Schema({
  name: String,
  type: String,
  teams: [String],
  matches: [{ team1: String, team2: String, score: String }],
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = { Tournament };
