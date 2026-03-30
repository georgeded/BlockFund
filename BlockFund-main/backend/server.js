const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;

const chatFilePath = path.join(__dirname, '../backend/data/chat', 'chat.json');
const chatBackupFilePath = path.join(__dirname, '../backend/data/chat', 'chat_backup.json');
const usersFilePath = path.join(__dirname, '../backend/data/login', 'users.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the root of the project
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/javascript', express.static(path.join(__dirname, '../javascript')));
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/html', express.static(path.join(__dirname, '../html')));
app.use('/documentation', express.static(path.join(__dirname, '../documentation')));

// Serve the html files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../html', 'index.html')));
app.get('/html/Learn.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'Learn.html')));
app.get('/html/Participate.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'Participate.html')));
app.get('/html/Use.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'Use.html')));
app.get('/html/News.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'News.html')));
app.get('/html/Chat.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'Chat.html')));
app.get('/html/Graphs.html', (req, res) => res.sendFile(path.join(__dirname, '../html', 'Graphs.html')));

// Handle chat GET request
app.get('/api/chat', (req, res) => {
    try {
        const chat = JSON.parse(fs.readFileSync(chatFilePath, 'utf8'));
        if (chat.length > 100) {
            chat.shift(); // Limit the number of messages to 100
        }
        fs.writeFileSync(chatFilePath, JSON.stringify(chat, null, 2), 'utf8');
        return res.status(200).json(chat);
    } catch (error) {
        console.error('Error reading or parsing chat file:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Handle chat POST request
app.post('/api/chat', (req, res) => {
    try {
        const chat = JSON.parse(fs.readFileSync(chatFilePath, 'utf8'));
        const { publicKey, message } = req.body;
        const newMessage = { publicKey, message, timestamp: new Date() };

        if (publicKey === null || message === undefined) {
            return res.status(400).json({ success: false, error: 'Missing public key or message' });
        }
        console.log('Received chat data:', newMessage);
        chat.push(newMessage);
        fs.writeFileSync(chatFilePath, JSON.stringify(chat, null, 2), 'utf8');
        return res.status(201).json({ success: true, message: 'Message sent' });
    } catch (error) {
        console.error('Error writing to chat file:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Handle chat DELETE request
app.delete('/api/chat/delete', (req, res) => {
    try {
        const chat = JSON.parse(fs.readFileSync(chatFilePath, 'utf8'));
        fs.writeFileSync(chatBackupFilePath, JSON.stringify(chat, null, 2), 'utf8');
        fs.writeFileSync(chatFilePath, JSON.stringify([], null, 2), 'utf8');
        return res.status(200).json({ success: true, message: 'All messages deleted' });
    } catch (error) {
        console.error('Error deleting chat messages:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Handle chat RESET request
app.post('/api/chat/reset', (req, res) => {
    try {
        if (fs.existsSync(chatBackupFilePath)) {
            const backupChat = JSON.parse(fs.readFileSync(chatBackupFilePath, 'utf8'));
            fs.writeFileSync(chatFilePath, JSON.stringify(backupChat, null, 2), 'utf8');
            return res.status(200).json({ success: true, message: 'Messages reset' });
        } else {
            return res.status(404).json({ success: false, message: 'No backup found to reset messages' });
        }
    } catch (error) {
        console.error('Error resetting chat messages:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Handle login POST request
app.post('/api/login', (req, res) => {
    try {
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const { publicKey, password } = req.body;
        const loginData = { publicKey, password };
        console.log('Received login data:', loginData);

        const user = users.find(user => user.publicKey === loginData.publicKey);
        if (user) {
            if (user.password === loginData.password) {
                return res.status(200).json({ success: true, message: 'Login successful' });
            } else {
                return res.status(401).json({ success: false, error: 'Incorrect password' });
            }
        } else {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        console.error('Error processing login request:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Handle register POST request
app.post('/api/register', (req, res) => {
    try {
        const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        const { publicKey, password } = req.body;
        const registerData = { publicKey, password };
        console.log('Received register data:', registerData);

        if (users.find(user => user.publicKey === registerData.publicKey)) {
            return res.status(409).json({ success: false, error: 'Public key is taken' });
        } else {
            users.push(registerData);
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
            return res.status(201).json({ success: true, message: 'Register successful' });
        }
    } catch (error) {
        console.error('Error processing registration request:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
