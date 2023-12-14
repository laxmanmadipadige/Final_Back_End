const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Import the Note model
// Import the Note model
const { Note } = require('./note');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import the Note model

// Connecting MongoDB here
const connectionDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://laxmanmadipadige10:Laxman123@noteapp.d0h5iag.mongodb.net/mydb`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`The database is connected to ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectionDB();

// Handle preflight requests
app.options('*', cors());

// GET request to fetch data (for testing)
// GET request to fetch all notes
app.get('/notes', async (req, res) => {
    try {
      // Fetch all notes from the database
      const allNotes = await Note.find();
      
      res.json(allNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// POST request to save a new note
app.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new Note instance
    const newNote = new Note({
      title,
      content,
    });

    // Save the new note to the database
    const savedNote = await newNote.save();

    res.json(savedNote);
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assuming you have a Note model defined

// Add a route to delete a note by title
app.delete('/notes', async (req, res) => {
    try {
      const titleToDelete = req.query.title;
  
      // Check if the note exists
      const existingNote = await Note.findOne({ title: titleToDelete });
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Delete the note
      await Note.findOneAndDelete({ title: titleToDelete });
  
      res.json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.listen(port, () => {
  console.log(`Running at ${port}`);
});
