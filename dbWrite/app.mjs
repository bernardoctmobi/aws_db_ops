const AWS = require('aws-sdk');
const dynamoDB = new AWS.dynamoDB.DocumentClient();

export const lambdaHandler = async (event) => {
    console.log(event);
    
    try {
        const requestBody = JSON.parse(event.body);
        await insertItem(requestBody);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Elemento inserito con successo' }),
        }
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Qualcosa è andato storto :(' }),
        };
    }
};

async function insertItem(itemData) {
    const params = {
        Key: {
            userId: itemData.userId,
        },
        UpdateExpression: 'SET #name = :name, #surname = :surname',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#surname': 'surname',
        },
        ExpressionAttributeValuse: {
            ':name': itemData.name,
            ':surname': itemData.surname,
        },
        TableName: process.env.DYNAMODB_TABLE,
        Item: itemData,
    };

    try {
        await dynamoDB.update(params).promise();
    } catch (error) {
        console.error(`Errore durante l'aggiornamento dell'elemento:`, error);
        throw error;
    }
}