<!--
title: 'How to setup Local dynamodb'
description: 'This template demonstrates how to create a table in local dynamodb with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorName: 'Srushti Shetty'
-->

# Demo on first project with local DynamoDB

This template demonstrates how to create a table in local dynamodb with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

## Usage
Install all the dependencies in package.json 

```
$ npm install
```

After installing the dependencies, run the following command to start a local server:

```
$ serverless offline
```
You can see the list of available endpoints on http://localhost:3000/ and also use http://localhost:3000/ a base endpoint

![image](https://user-images.githubusercontent.com/90671944/180708961-adeddb38-d825-489a-a63d-ca2610a2380b.png)

### Invocation

After this, you can call the created application via HTTP:

```bash
http://localhost:3000/dev/createTable
```
This endpoint creates table in local dynamodb for the first time. Hit this endpoint using postman only once.

```bash
http://localhost:3000/dev/newdevices
```
This endpoint creates item in table.
Send devicetype as dt and partnumber as pt in the body.
![image](https://user-images.githubusercontent.com/90671944/180710012-5603aa9c-2c13-4729-aeed-7ebc8c2929df.png)

```bash
http://localhost:3000/dev/newdevice
```
This endpoint gets particular item list and count of the itmes according to the condition provided by the user from table.
Send devicetype as dt and partnumber as pt in the body of the items which you want the total count in the table.
![image](https://user-images.githubusercontent.com/90671944/180711293-cdd4e157-d52e-4c7e-8e48-e2a05157c69c.png)





