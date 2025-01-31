# NestJS File Analyzer

A NestJS application for analyzing transaction files using AI. This application provides endpoints for uploading CSV files and analyzing merchant and spending patterns. It is deployed to Railway fully operational.

This code is written in hexagonal architecture for testability and single responsibility. Ports define the limits of the business services and the adapters implement these limits to operate. For more info see [hexagonal architecture on wikipedia](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>).

Also a postman collection added for testing the application.

## Features

- Upload CSV files
- Analyze merchant categories
- Detect spending patterns
- AI-powered analysis using OpenAI

## Prerequisites

- Docker
- OpenAI API key

## Installation Using Docker Locally

`docker build -t nestjs-file-analyzer .`

`docker run -p 3000:3000 --env-file .env nestjs-file-analyzer`
