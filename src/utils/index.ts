import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { ServerResponse } from 'http';
import { ApiResponse, Employee, Product } from '../types/types';

export function readEmployeeList(): Employee[] {
    const filePath = path.join(__dirname, '..', '..', 'public', 'data', 'employeeList.json');
    const employees = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return employees;
}

export function sendJsonResponse<T>(res: ServerResponse, statusCode: number, data: ApiResponse<T>): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

export async function readProductList(offset: number): Promise<Product[]> {
    try {
        const config = {
            method: 'GET',
            url: 'https://e-commerce-m3d4.onrender.com/products',
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                sort: 'rating:desc',
                limit: 10,
                offset: offset, // start from xth product
            },
        };

        const response = await axios.request(config);
        const dataWithoutTotal = response.data.products.map(({ total, ...rest }: { total: number; rest: Product }) => rest);
        return dataWithoutTotal;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
}

export async function fetchTop100Products(): Promise<Product[]> {
    // Create an array of offsets from 0 to 90 with a step of 10
    const offsets = Array.from({ length: 10 }, (_, i) => i * 10);

    try {
        // Create a promise for each offset
        const productPromises = offsets.map((offset) => readProductList(offset));

        // Run all promises in parallel
        const productChunks = await Promise.all(productPromises);
        console.log(productChunks.flat().length);

        // Combine all results into a single array
        return productChunks.flat();
    } catch (error) {
        console.error('Error fetching top 100 products:', error);
        throw error;
    }
}
