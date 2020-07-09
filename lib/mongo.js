const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser); // User to connect to DB
const PASSWORD = encodeURIComponent(config.dbPassword); // Password to connect to DB
const DB_NAME = config.dbName; // name of DB

// Build URI Mongo
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

// Build Mongo library
class MongoLib {
  // Create the constructor
  constructor() {
    // Initializing our DB Client
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true , useUnifiedTopology: true,});
    // Initializin our DB Name
    this.dbName = DB_NAME;
  }

  connect() {
    // Create a singleton
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise( (resolve, reject) => { // Create connectiont to db
        this.client.connect(err => { // Make connection to the client
          if (err) { // error first
            reject(err);
          } else { // Create the connection (instance)
            console.log('Connected succesfully to mongo');
            resolve(this.client.db(this.dbName)); // Making the connection to db (dbName)
          };
        });
      });
    };
    // If exist a instance of the connection to DB, and then return that connection
    return MongoLib.connection;
  };

  // Get all data
  getAll(collection, query) {
    return this.connect().then(db => {
      return db.collection(collection).find(query).toArray();
    })
  };

  // Get just one
  get(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne( { _id: ObjectId(id) } );
    })
  };

  // Create one
  create(collection, data) {
    return this.connect().then(db => {
      return db.collection(collection).insertOne(data);
    }).then(result => result.insertedId);
  };

  // Update one
  update(collection, id, data) {
    return this.connect().then(db => {
      return db.collection(collection).updateOne( { _id: ObjectId(id) }, { $set: data }, { upsert: true } );
    }).then(result => result.upsertedId || id)
  };

  // Delete one
  delete(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).deleteOne( { _id: ObjectId(id) } );
    }).then(() => id)
  };

};

module.exports = MongoLib;