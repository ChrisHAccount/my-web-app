// Import the modules required for the cloud-based web applications (Express, Cosmosdb, Node.js)
const express = require('express');
const { CosmosClient } = require('@azure/cosmos');
const path = require('path');

// Create the Express app & define port
const app = express();
const port = process.env.PORT || 3000;

// Cosmos DB connection details
const endpoint = "https://my-web-app.documents.azure.com:443/";
const key = "GUttUNLySJiBZMbTBqEn8WKedp7dZqgf9OuLUn7KXAE5NSpTDalowcTyhx2WIGFZyQv8PutpW5TfACDbvUB61w==";
const client = new CosmosClient({ endpoint, key });

// Your chosen database and container names
const databaseId = "guestbook-db";
const containerId = "messages";

// Middleware - Parse incoming JSON for POST requests
app.use(express.json());

// Middleware - Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Initialize CosmosDB (database and container) - Ensure they both exist
async function initCosmos() {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    await database.containers.createIfNotExists({
        id: containerId,
        partitionKey: { kind: "Hash", paths: ["/id"] }
    });
    console.log("Cosmos DB is ready");
}

// Add an item to CosmosDB
async function addItem(item) {
    // Ensure database and container exist (optional here, already in initCosmos)
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container } = await database.containers.createIfNotExists({ id: containerId });
    // Create the item in the container
    const { resource: createdItem } = await container.items.create(item);
    console.log(`Created item with id: ${createdItem.id}`);
}

// POST route to add a guestbook message
app.post('/add-item', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
        return res.status(400).send("Message cannot be empty");
    }

    // Create item object with unique ID
    const newItem = {
        id: new Date().toISOString(),
        message: userMessage.trim()
    };

    try {
        await addItem(newItem);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error adding item to Cosmos DB:", error);
        res.sendStatus(500);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});