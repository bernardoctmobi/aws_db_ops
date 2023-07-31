import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event) => {
    console.log(event);
    let response;

    switch (event.httpMethod) {
        case 'GET':
            response = await getItem(event.pathParameters.userId);
            break;
        case 'POST':
            response = await insertItem(JSON.parse(event.body));
            break;
        default:
            response = buildResponse(404, '404 Not Found');
    }
    return response;
    // switch (true) {
    //     case event.httpMethod === 'GET':
    //         try {
    //             const requestBody = JSON.parse(event.body);
    //             const response = await getItem(requestBody);
    //             return {
    //                 statusCode: 200,
    //                 headers: {
    //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(response),
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             return {
    //                 statusCode: 500,
    //                 headers: {
    //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     statusCode: 500,
    //                     error: 'Internal Server Error',
    //                     internalError: JSON.stringify(err),
    //                 }),
    //             }
    //         }
    //     case event.httpMethod === 'POST':
    //         try {
    //             const requestBody = JSON.parse(event.body);
    //             const response = await insertItem(requestBody);
    //             return {
    //                 statusCode: 200,
    //                 headers: {
    //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(response),
    //             }
    //         } catch (err) {
    //             console.log(err);
    //             return {
    //                 statusCode: 500,
    //                 headers: {
    //                     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     statusCode: 500,
    //                     error: 'Internal Server Error',
    //                     internalError: JSON.stringify(err),
    //                 }),
    //             }
    //         }
    // }
};

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json,'
        },
        body: JSON.stringify(body)
    }
}

async function getItem(userId) {
    console.log(`siamo all'interno di getItem`);
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: userId
        }
    }
    try {
        const response = await docClient.send(new GetCommand(params));
        console.log(response);
        if (response.Item === null) {
            response.message = `No such item in DB`;
        }
        return buildResponse(200, response);
    } catch (error) {
        console.log(error);
        return buildResponse(500, error);
    }    
}

async function insertItem(itemData) {
    console.log(`siamo all'interno di insertItem`);
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            userId: itemData.userId,
        },
        UpdateExpression: 'SET #name = :name, #surname = :surname',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#surname': 'surname',
        },
        ExpressionAttributeValues: {
            ':name': itemData.name,
            ':surname': itemData.surname,
        },
        ReturnValues: "ALL_NEW",
    }
    try {
        const response = await docClient.send(new UpdateCommand(params));
        console.log(response);
        return buildResponse(200, response);
    } catch (error) {
        console.log(error);
        return buildResponse(500, error);
    }
}