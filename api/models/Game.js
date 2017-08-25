module.exports = {
  tableName: "game",
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    steamId: { type: 'integer', unique: true},
    name: { type: 'string', required: true, unique: true },
    owners: {
      collection: 'user',
      via: 'game',
      through: 'usergame'
    }
  }
};
