import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event) => {
    console.log(event);

    try {
        const requestBody = JSON.parse(event.body);
        const response = await insertItem(requestBody);
        return response;
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Qualcosa è andato storto :(' }),
        };
    }
};

async function insertItem(itemData) {
    console.log(`siamo all'interno di insertItem`);
    // const params = {
    //     Key: {
    //         userId: itemData.userId,
    //     },
    //     UpdateExpression: 'SET #name = :name, #surname = :surname',
    //     ExpressionAttributeNames: {
    //         '#name': 'name',
    //         '#surname': 'surname',
    //     },
    //     ExpressionAttributeValues: {
    //         ':name': itemData.name,
    //         ':surname': itemData.surname,
    //     },
    //     TableName: process.env.DYNAMODB_TABLE,
    //     Item: itemData,
    // };

    const command = new UpdateCommand({
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
        TableName: process.env.DYNAMODB_TABLE,
        Item: itemData,
    });

    // try {
    //     await DynamoDB.update(params).promise();
    // } catch (error) {
    //     console.error(`Errore durante l'aggiornamento dell'elemento:`, error);
    //     throw error;
    // }

    const response = await docClient.send(command);
    console.log(response);
    return response;
}