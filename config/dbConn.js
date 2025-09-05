const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ahmedmohamed10sayed:vuLdjXETaYeCb9Tt@dodobase.terueve.mongodb.net/?retryWrites=true&w=majority&appName=DODOBase");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
