const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let filePath;

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
                console.error('Error reading employee list:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            break;

        case '/oldestEmployee':
            try {
                const filePath = path.join(__dirname, 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // get the oldest employee
                const oldestEmployee = employees.reduce((oldest, current) => {
                    return new Date(current.ise_giris_tarihi) < new Date(oldest.ise_giris_tarihi) ? current : oldest;
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(oldestEmployee));
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            break;

        case '/averageSalary':
            try {
                const filePath = path.join(__dirname, 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // get the average salary
                // total salary / number of employees
                const averageSalary = employees.reduce((sum, current) => sum + current.maas, 0) / employees.length;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ averageSalary: Number(averageSalary.toFixed(2)) }));
            } catch (error) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
            break;
    }

    // HTML routes
    if (req.url === '/' || req.url === '/index' || req.url === '/products' || req.url === '/connect') {
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

            default:
                res.writeHead(404);
                res.end(JSON.stringify({ error: '404 Not Found' }));
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
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
