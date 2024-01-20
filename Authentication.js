const { MongoClient } = require('mongodb');
const CryptoJS = require('crypto-js');

var uri, client, db, collection;
const secretKey = 'ahsfbla';

//connects to database
async function connect() {
    // uri = "mongodb+srv://ahsfbla:ahsfbla123@ahs-fbla.onf48qi.mongodb.net/?retryWrites=true&w=majority";
    uri = "mongodb+srv://ahsfbla:ahsfbla123@ahs-fbla.onf48qi.mongodb.net/";
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db("FBLA_DATA");
    collection = db.collection('users')
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

async function returnAllData(){
  // const collectionNames = await db.listCollections().toArray();
  var count = await getDocumentCount();
  var arr_documents = [];
  for(var i = 1; i <= count; i++){
    arr_documents.push(await getAndDecrypt(i));
  }
  return arr_documents;
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

//formats the data given all the necessary data about a user
async function formatData(valid, user, pass, first, own){
    return {
      validity : await encrypt(valid), //string of boolean value
      username : await encrypt(user),
      password : await encrypt(pass),
      first_name : await encrypt(first),
      owner : await encrypt(own) //string of boolean value
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

async function changeUsername(documentNumber, new_username){
  await edit(documentNumber, "username", new_username);
}
async function changePassword(documentNumber, new_password){
  await edit(documentNumber, "password", new_password);
}
async function changeName(documentNumber, new_name){
  await edit(documentNumber, "name", new_name);
}
async function makeOwner(documentNumber){
  await edit(documentNumber, "owner", "true");
}
async function removeOwner(documentNumber){
  await edit(documentNumber, "owner", "false");
}
async function checkOwner(documentNumber){
  return  ((await getAndDecrypt(documentNumber))[4] == "true");
}

async function switchOwner(old_owner, new_owner){
  await removeOwner(old_owner);
  await makeOwner(new_owner)
}

async function addAccount(validity, username, password, first_name){
  await insertDocument(await formatData(validity, username, password, first_name, "false"));
}

//test
async function getValidity(){
  return  ((await getAndDecrypt(documentNumber))[0] == "true");
}

//test
async function addValidity(){
  await edit(documentNumber, "validity", "true")
}

//test
async function removeValidity(){
  await edit(documentNumber, "validity", "false")
}

async function checkCredentials(username, password) {
  await connect();
  var count = await getDocumentCount();
  for(var i = 1; i <= count; i++){
    var acct = await getAndDecrypt(i);
    if(acct[1] == username && acct[2] == password){
      await client.close();
      return true;
    }
  }
  await client.close();
  return false;

}

export const check = (username, password) => {
  return checkCredentials(username, password);
};



// async function main() {
//    await connect();
//     await listAllData();
//     // await addAccount("true", "rohith", "12345", "Rohith")
//     // await removeDocumentByIndex(1);
//     // await removeDocumentByIndex(1);
//     // await removeDocumentByIndex(1);
//     // await listAllData();
//     console.log(await checkCredentials("rohith", "12345"));
//     await client.close();
// }

// main();
