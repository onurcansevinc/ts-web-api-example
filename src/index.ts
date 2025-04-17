import fs from 'fs';
import path from 'path';
import { Employee } from './types/types';
import http, { IncomingMessage, ServerResponse } from 'http';

const PORT: number = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    let filePath: string | undefined;
    const method: string | undefined = req.method;

    if (method !== 'GET') {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '404 Not Found' }));
    }
    // API Endpoints
    switch (req.url) {
        case '/employeeList':
            try {
                const filePath = path.join(__dirname, '..', 'public', 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const employeesWithoutSalary = employees.map(({ maas, ...employee }: Employee) => employee); // get employees without the 'maas'

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
                const filePath = path.join(__dirname, '..', 'public', 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // get the oldest employee
                const oldestEmployee = employees.reduce((oldest: Employee, current: Employee) => {
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
                const filePath = path.join(__dirname, '..', 'public', 'data', 'employeeList.json');
                const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                // get the average salary
                // total salary / number of employees
                const averageSalary = employees.reduce((sum: number, current: Employee) => sum + current.maas, 0) / employees.length;

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
                filePath = path.join(__dirname, '..', 'public', 'pages', 'index.html');
                break;
            case '/index':
                filePath = path.join(__dirname, '..', 'public', 'pages', 'index.html');
                break;
            case '/products':
                filePath = path.join(__dirname, '..', 'public', 'pages', 'products.html');
                break;
            case '/connect':
                filePath = path.join(__dirname, '..', 'public', 'pages', 'connect.html');
                break;

            default:
                res.writeHead(404);
                res.end(JSON.stringify({ error: '404 Not Found' }));
        }

        try {
            const content = fs.readFileSync(filePath as string, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (error: unknown) {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
