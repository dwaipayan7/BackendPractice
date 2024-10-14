const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const filesDirectory = path.join(__dirname, 'files');
    
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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
