import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import geoip from 'geoip-lite';
import { Employee, WeatherAPIResponse, Weather } from './types/types';
import http, { IncomingMessage, ServerResponse } from 'http';
import { sendJsonResponse, readEmployeeList, fetchTop100Products, getMyPublicIp, getWeather } from './utils';

dotenv.config();

const PORT: number = 3000;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    let filePath: string | undefined;
    const method: string | undefined = req.method;

    if (method !== 'GET') {
        sendJsonResponse(res, 404, { success: false, data: null, error: 'Method Not Allowed' });
        return;
    }

    // API Endpoints
    switch (req.url) {
        case '/api/employeeList':
            try {
                const employees = readEmployeeList();
                const employeesWithoutSalary = employees.map(({ maas, ...employee }: Employee) => employee); // get employees without the 'maas'

                sendJsonResponse(res, 200, { success: true, data: employeesWithoutSalary, error: undefined });
                return;
            } catch (error) {
                sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
                return;
            }
            break;

        case '/api/oldestEmployee':
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

        case '/api/averageSalary':
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

        case '/api/top100products':
            try {
                const products = await fetchTop100Products();
                sendJsonResponse(res, 200, { success: true, data: products, error: undefined });
                return;
            } catch (error) {
                sendJsonResponse(res, 500, { success: false, data: null, error: 'Internal Server Error' });
                return;
            }
            break;

        case '/api/weather':
            try {
                let ip: string | undefined | string[] = req.connection.remoteAddress || req.headers['x-forwarded-for'];
                if (ip == '::1') ip = await getMyPublicIp(); // if the ip is localhost, get the public ip

                const geo = geoip.lookup(ip as string); // get the geo location of the ip
                const weather: WeatherAPIResponse = await getWeather(ip as string, geo?.ll[0] as number, geo?.ll[1] as number);

                const weatherData: Weather = {
                    city: geo?.city || '',
                    temperature: weather.main.temp,
                    condition: weather.weather[0].main,
                };

                sendJsonResponse(res, 200, { success: true, data: weatherData, error: undefined });
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

    // CSS routes
    if (req.url === '/style/style.css') {
        filePath = path.join(__dirname, '..', 'public', 'style', 'style.css');
        const content = fs.readFileSync(filePath as string, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(content);
        return;
    }

    sendJsonResponse(res, 404, { success: false, data: null, error: '404 Not Found' });
    return;
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
