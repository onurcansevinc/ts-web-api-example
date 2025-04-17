import fs from 'fs';
import path from 'path';
import { ServerResponse } from 'http';
import { ApiResponse, Employee } from '../types/types';

export function readEmployeeList(): Employee[] {
    const filePath = path.join(__dirname, '..', '..', 'public', 'data', 'employeeList.json');
    const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return employees;
}

export function sendJsonResponse<T>(res: ServerResponse, statusCode: number, data: ApiResponse<T>): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
