const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath;

    switch (req.url) {
        case '/':
            filePath = path.join(__dirname, 'pages', 'index.html');
            break;
        default:
            // 404 not found
            res.writeHead(404);
            res.end('404 Not Found');
            return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
    } catch (error) {
        res.writeHead(500);
        res.end('Internal Server Error');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
