process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || "local";

let urlDB;
if (process.env.NODE_ENV === "local") {
  urlDB = "mongodb://localhost:27017/Cluster0";
} else {
  urlDB =
    "mongodb+srv://JorgeMoreno:Jorge12--??@cluster0-svf9v.mongodb.net/Cluster0?retryWrites=true&w=majority";
}

process.env.URLDB = urlDB;
