const Database = require('@settlemint/lib-mongo');

module.exports = {
  getStreamCategories
};

async function getStreamCategories(req, res, next) {
  let db;
  try {
    db = await Database.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/mint'
    );
  } catch (e) {
    return res.status(500).json({ error: 'Database connection failed' });
  }

  console.log(db);

  // Query

  // Returns categories

  return res.status(200).json({ text: 'hello' });
}
