import fs from 'fs';
import path from 'path';
import { Employee } from './types/types';
import http, { IncomingMessage, ServerResponse } from 'http';
import { sendJsonResponse, readEmployeeList } from './utils';

const PORT: number = 3000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    let filePath: string | undefined;
    const method: string | undefined = req.method;

    if (method !== 'GET') {
        sendJsonResponse(res, 404, { success: false, data: null, error: 'Method Not Allowed' });
        return;
    }

    // API Endpoints
    switch (req.url) {
        case '/employeeList':
            try {
                const employees = readEmployeeList();
                const employeesWithoutSalary = employees.map(({ maas, ...employee }: Employee) => employee); // get employees without the 'maas'

                sendJsonResponse(res, 200, { success: true, data: employeesWithoutSalary, error: undefined });
                return;
            } catch (error) {
                console.error('Error reading employee list:', error);
                sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
                return;
            }
            break;

        case '/oldestEmployee':
            try {
                const employees = readEmployeeList();

                // get the oldest employee
                const oldestEmployee = employees.reduce((oldest: Employee, current: Employee) => {
                    return new Date(current.ise_giris_tarihi) < new Date(oldest.ise_giris_tarihi) ? current : oldest;
                });

                sendJsonResponse(res, 200, { success: true, data: oldestEmployee, error: undefined });
                return;
            } catch (error) {
                sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
                return;
            }
            break;

        case '/averageSalary':
            try {
                const employees = readEmployeeList();

                // get the average salary
                // total salary / number of employees
                const averageSalary = employees.reduce((sum: number, current: Employee) => sum + current.maas, 0) / employees.length;

                sendJsonResponse(res, 200, { success: true, data: { averageSalary: Number(averageSalary.toFixed(2)) }, error: undefined });
                return;
            } catch (error) {
                sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
                return;
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
        }

        try {
            const content = fs.readFileSync(filePath as string, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
            return;
        } catch (error: unknown) {
            sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
            return;
        }
    }

    sendJsonResponse(res, 404, { success: false, data: null, error: '404 Not Found' });
    return;
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
