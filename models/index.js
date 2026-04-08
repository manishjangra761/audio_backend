'use strict';

// Eager load so Vercel/@vercel/nft includes pg in the serverless bundle (Sequelize requires it dynamically).
require('pg');

const fs = require('fs');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const { Sequelize, DataTypes, Op, col, fn } = require('sequelize');
const db = {};

let sequelize;
if (config.use_env_variable) {
  const connectionString = process.env[config.use_env_variable];
  const { use_env_variable: _u, ...sequelizeOptions } = config;
  sequelize = new Sequelize(connectionString, sequelizeOptions);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
db.col = col;
db.fn = fn;


// Register your models here
db.User = require('./users.model')(sequelize, DataTypes);
db.Category = require('./category.model')(sequelize, DataTypes);
db.Audio = require('./audio.model')(sequelize, DataTypes);
db.Attempt = require('./attempts.model')(sequelize, DataTypes);
db.ContactMessage = require('./contact.model')(sequelize, DataTypes);

db.Audio.belongsTo(db.Category, {
  foreignKey: "category_id",
});

db.Audio.hasMany(db.Attempt, {
  foreignKey: "audio_id"
});

db.Attempt.belongsTo(db.Audio, {
  foreignKey: "audio_id"
});



module.exports = db;
