const { MongoClient } = require('mongodb');

async function countAllClasses() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db("Stdudentmanagmentsystem");
        const collection = database.collection("SchoolClasses"); 
        const count = await collection.countDocuments();
        return count;
    } catch (error) {
        console.error('Error while counting documents', error);
        return 0; 
    } finally {
        await client.close();
    }
}

module.exports = countAllClasses;
