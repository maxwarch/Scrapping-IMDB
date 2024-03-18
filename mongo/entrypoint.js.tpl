use("DB")
db.createCollection("films")

db.createUser({
  user: "USER",
  pwd: "PWD",
  roles: [{
    role: "readWrite",
    db: "DB"
  }]
})