module.exports = {
  /**
   * It will create a new game .
   */
  create: function (req, res) {

    let name = req.param('name');

    if(!name){
      return res.badRequest({err:'Invalid name'});
    }

    Game.create({
      name: name
    })
      .then(_game => {
        if(!_game) return res.serverError({err:'Unable to create game'});

        return res.ok(_game); //to learn more about responses check api/responses folder
      })
      .catch(err => res.serverError(err.message));
  },

  findAll: function (req, res) {
    game.find()
      .then(_games => {

        if (!_games || _games.length === 0) {
          throw new Error('No games found');
        }
        return res.ok(_games);

      })
      .catch(err => res.serverError(err));
  },
};
