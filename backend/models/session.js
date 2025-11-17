const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Session', {
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    tabToken: { type: DataTypes.STRING, allowNull: false },
    jwtId: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'sessions', timestamps: false });
};
