const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/travellog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const tripSchema = new mongoose.Schema({
  name: String,
  start: Date,
  end: Date,
  schedule: String
});

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: String
});

const photoSchema = new mongoose.Schema({
  src: String, // base64
  note: String
});

const Trip = mongoose.model('Trip', tripSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Photo = mongoose.model('Photo', photoSchema);

// Routes
app.get('/api/trips', async (req, res) => {
  const trips = await Trip.find();
  res.json(trips);
});

app.post('/api/trips', async (req, res) => {
  const trip = new Trip(req.body);
  await trip.save();
  res.json(trip);
});

app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/api/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

app.get('/api/photos', async (req, res) => {
  const photos = await Photo.find();
  res.json(photos);
});

app.post('/api/photos', async (req, res) => {
  const photo = new Photo(req.body);
  await photo.save();
  res.json(photo);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
