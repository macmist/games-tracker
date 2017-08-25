module.exports = {
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    game:{
      model:'game',
    },
    user: {
      model: 'user',
    },
    installed: {type: 'boolean', defaultsTo: false}
  }
};
