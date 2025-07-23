import "dotenv/config.js";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Helpers for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

// Load config.json based on current environment
const configPath = path.resolve(__dirname, "../config/config.json");
const configFile = JSON.parse(fs.readFileSync(configPath))[env];

// Compose config with priority: environment variables > config file
const config = {
  username: process.env.DB_USER || configFile.username,
  password: process.env.DB_PASSWORD || configFile.password,
  database: process.env.DB_NAME || configFile.database,
  host: process.env.DB_HOST || configFile.host,
  dialect: configFile.dialect,
  logging: configFile.logging || false,
  // add other config options as needed
};

const db = {};

let sequelize;
if (configFile.use_env_variable) {
  sequelize = new Sequelize(process.env[configFile.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import all models from this directory
const modelFiles = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.endsWith(".js")
);

for (const file of modelFiles) {
  const { default: modelDefiner } = await import(path.join(__dirname, file));
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Apply model associations
for (const modelName of Object.keys(db)) {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const syncOptions = { force: process.env.NODE_ENV === "test" };

await sequelize.sync(syncOptions);

export default db;
