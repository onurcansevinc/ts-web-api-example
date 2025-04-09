const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath;

    // HTML routes
    if (req.url === '/' || req.url === '/products' || req.url === '/connect') {
        switch (req.url) {
            case '/':
                filePath = path.join(__dirname, 'pages', 'index.html');
                break;
            case '/index':
                filePath = path.join(__dirname, 'pages', 'index.html');
                break;
            case '/products':
                filePath = path.join(__dirname, 'pages', 'products.html');
                break;
            case '/connect':
                filePath = path.join(__dirname, 'pages', 'connect.html');
                break;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (error) {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

    // API Endpoints
    switch (req.url) {
        case '/employeeList':
            try {
                const filePath = path.join(__dirname, 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const employeesWithoutSalary = employees.map(({ maas, ...employee }) => employee); // get employees without the 'maas'

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(employeesWithoutSalary));
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({ error: '404 Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
