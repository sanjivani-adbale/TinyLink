const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Link = sequelize.define('Link', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  target_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  last_clicked_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'links',
  timestamps: false
});

module.exports = Link;
