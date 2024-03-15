use("films_database")
db.createCollection("films");

db.createUser({
  user: "",
  pwd: "",
  roles: [{
    role: "readWrite",
    db: "films_database"
  }]
})