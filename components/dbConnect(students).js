const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'Stdudentmanagmentsystem';
const client = new MongoClient(url);

// method to connect db to node

async function dbConnect(){
    let result = await client.connect();
    let collection = db.collection('Students');
    return collection;
    

}
module.exports = dbConnect;