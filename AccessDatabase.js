const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');

var uri, client, db, collection;
const secretKey = 'ahsfbla';


//connects to database
async function connect() {
    uri = "mongodb+srv://ahsfbla:ahsfbla123@ahs-fbla.onf48qi.mongodb.net/?retryWrites=true&w=majority";
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db("FBLA_DATA");
    collection = db.collection('data')
    // await client.connect();
}

//lists all data without any formatting
async function listAllData(){
  // const collectionNames = await db.listCollections().toArray();
  var count = await getDocumentCount();
  for(var i = 1; i <= count; i++){
    console.log(await getAndDecrypt(i));
  }

  console.log('\n');
}

//encryption used to make data safe
async function encrypt(data){
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

//decrypt method so the databse values are useful
async function decrypt (data){
  return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
}

//insert a document into the database, must be properly formatted
async function insertDocument(document) {
  const result = await collection.insertOne(document);
  // console.log(`Inserted document with _id: ${result.insertedId}`);
}

//remove a document from the databse
async function removeDocumentByIndex(documentIndex) {
    const documentToRemove = await collection.find().skip(documentIndex - 1).limit(1).toArray();

    if (documentToRemove.length > 0) {
        const result = await collection.deleteOne({ _id: documentToRemove[0]._id });
        if (result.deletedCount === 1) {
          return true; // Document removed successfully
      } else {
          return false; // Document removal failed
      }
    } else {
        return false; // Document not found
    }
}

//returns a single document indexed from 1 to length
async function getSpecificDocument(documentIndex){
    const documents = await collection.find({}).toArray();

    if (documentIndex >= 1 && documentIndex <= documents.length) {
        const desiredDocument = documents[documentIndex - 1];
        return desiredDocument;
    } else {
        return -1;
    }
}

//formats the data given all the necessary data about a company
async function formatData(company_name, org_type, resources, contact_email, company_website, company_summary, products, funding_amount){
    return {
      name : await encrypt(company_name),
      organization_type : await encrypt(org_type),
      resources_available : await encrypt(resources),
      email : await encrypt(contact_email),
      website : await encrypt(company_website),
      summary : await encrypt(company_summary),
      products_sold : await encrypt(products),
      funding : await encrypt(funding_amount)
    }
}

//goes through each value in the document and decrypts it
async function parseOutput(output) {
  const parsedValues = Object.values(output).filter(value => typeof value === 'string');
  for(var i = 0; i < parsedValues.length; i++){
    parsedValues[i] = await decrypt(parsedValues[i]);
  }
  return parsedValues;
}

//decrypts a single document given an index value starting from 1
async function getAndDecrypt(documentNumber){
  return await parseOutput(await getSpecificDocument(documentNumber));
}

//returns total count of documents in the database
async function getDocumentCount(){
  return await collection.countDocuments();
}

//searches for and returns an array of every document with any inclusion of search
async function search(search){
  var matches = [];
  for(var i = 1; i <= await getDocumentCount(); i++){
    // console.log(await getAndDecrypt(i));
      if((((await getAndDecrypt(i))[0]).toLowerCase()).includes(search.toLowerCase())){
        matches.push(i);
      }
  }
  return matches;
}

//used to edit a specific document and the specified field (ex: donation amount changed)
async function edit(documentNumber, fieldName, newValue){
  const documentToUpdate = await collection.findOne({}, { skip: documentNumber - 1 });
  if (documentToUpdate) {
    const update = { $set: { [fieldName]: (await encrypt(newValue)) } };
    const result = await collection.updateOne({ _id: documentToUpdate._id }, update);
    return result.modifiedCount;
  } else {
    return false;
  }
}

async function main() {
    await connect();
    // await listAllData();
    await client.close();
}

main();
