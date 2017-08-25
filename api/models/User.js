module.exports = {
  tableName: "user",
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    login: { type: 'string', required: true},
    pass: { type: 'string', required: true},
    steamUrl: {type: 'string'},
    steamId: {type: 'string'},
    games: {
      collection: 'game',
      via: 'owner',
      through: 'usergame'
    },
    toJSON: function () {
      let obj = this.toObject();
      delete obj.pass;
      return obj;
    }
  }
};
