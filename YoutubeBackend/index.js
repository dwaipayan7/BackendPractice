const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const filesDirectory = path.join(__dirname, 'files');

// Homepage route to render the list of files
app.get('/', (req, res) => {
    // Read files from the 'files' directory
    fs.readdir(filesDirectory, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        // Pass the list of files to the index.ejs view
        res.render('index', { files });
    });

    console.log('Request to the homepage done');
});

// Route to create a new file
app.post('/create', (req, res) => {
    const { title, details } = req.body;

    if (!title || !details) {
        return res.status(400).send('Title and details are required');
    }

    // Sanitize the title for the filename (remove special characters and spaces)
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_ ]/g, '').trim().split(' ').join('_');

    const filePath = path.join(filesDirectory, `${sanitizedTitle}.txt`);

    // Write the file content
    fs.writeFile(filePath, details, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log(`File created: ${sanitizedTitle}.txt`);
        
        // Send success response
        res.status(201).send('File created successfully');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
