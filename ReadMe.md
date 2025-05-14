# NodeJS Web Server Project

## Project Overview

This project is a simple web server built using NodeJS HTTP module. It includes HTML pages and API endpoints for employee data management.

## Features

-   Web server with multiple HTML pages
-   Employee data API endpoints
-   Nodemon integration for development

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

The server will start at http://localhost:3000

## Project Structure

### HTML Pages

-   Home Page: http://localhost:3000/
-   Products Page: http://localhost:3000/products
-   Contact Page: http://localhost:3000/contact

### API Endpoints

1. Get All Employees

-   Endpoint: http://localhost:3000/employeeList
-   Returns: JSON list of employees (without salary information)

2. Get Oldest Employee

-   Endpoint: http://localhost:3000/oldestEmployee
-   Returns: JSON data of the most senior employee

3. Get Average Salary

-   Endpoint: http://localhost:3000/averageSalary
-   Returns: Average salary of all employees

## Development

-   Uses nodemon for automatic server restart during development
-   Run `npm run dev` to start the development server
