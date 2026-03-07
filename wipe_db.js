require("dotenv").config({ path: require("path").join(__dirname, "pos-backend", ".env") });
const { sequelize } = require("./pos-backend/config/database");

const dropAll = async () => {
  await sequelize.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;');
  console.log("DB wiped");
  process.exit();
}
dropAll();
