const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("problème clé Mongo");
  }

  // Evite de reconnecter si déjà connecté
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);

  console.log("MongoDB connected ! Youhouuuuuu !");
  return mongoose.connection;
}

module.exports = { connectDB };
