let Promise = require('bluebird');
module.exports = {
  /**
   * It will create a new usergame .
   */
  create: function (req, res) {

    let gameName = req.param('gameName');
    let userId = req.param('userId');
    let installed = req.param('installed');

    if(!gameName){
      return res.badRequest({err:'Invalid game name'});
    }

    if(!userId) {
      return res.badRequest({err: 'Invalid userId'});
    }


    Game.findOrCreate({name: gameName})
      .then(_game => {
        if(!_game) throw new Error('Unable to find/create game record');
        return _game;
      })
      .then(_game => {
        return UserGame.findOrCreate({

          user: userId,
          game: _game.id,
          installed: installed !== null ? installed : false
        }).populate('game').populate('user')
      })
      .then(_usergame => {
        if(!_usergame) return res.serverError({err:'Unable to create user game'});

        return res.ok(_usergame);
      })
      .catch(err => res.serverError(err.message));
  },

  createMany: function (req, res) {
    let games = req.param('games');
    let results = [];
    async.each(games, function (game, callback) {
      Game.findOrCreate({name: game.gameName, steamId: game.steamid}, function (err, _game) {

          if(err)
            callback(err);
          else {
            UserGame.findOrCreate({

              user: game.userId,
              game: _game.id
            }).populate('game').populate('user')
              .then(_usergame => {
              if (!_usergame) throw new Error('Unable to link user to game');
              results.push(_usergame);
              callback();
            });
          }
      });
    }, function (err) {
      res.json(200, results);
    });
  },

  findAll: function (req, res) {
    UserGame.find()
      .then(_usergames => {

        if (!_usergames || _usergames.length === 0) {
          throw new Error('No usergames found');
        }
        return res.ok(_usergames);

      })
      .catch(err => res.serverError(err));
  },

  findForUsers: function(req, res) {
    let ids = req.param('ids');
    if (!ids)
      return res.badRequest({err: 'No user id provided'});
    let n =  ids.split(',').length;

    let q = 'select game.name, usergame.user, usergame.installed from usergame join game on game.id = usergame.game\n' +
            'where usergame.user = ' + ids[0] + '\n' +
            'order by usergame.installed desc;';


    let g = 'select game.name, user, installed, t.installations from usergame \n' +
      'join game on usergame.game = game.id\n' +
      'join (select game, sum(installed = 1) as installations\n' +
      'from usergame\n' +
      '            where user in (' + ids + ')\n' +
      '            group by game\n' +
      '            having count(distinct user) = ' + n + ') as t\n' +
      'on t.game = usergame.game\n' +
      'where usergame.game in  (SELECT game\n' +
      '                    FROM usergame\n' +
      '                    WHERE user IN (' +ids + ')\n' +
      '                    GROUP BY game\n' +
      '                    HAVING COUNT(distinct user)=' + n + ')\n' +
      'and user in (' + ids +')\n' +
      'order by installations desc;';
    let queryAsync = Promise.promisify(UserGame.query);
    queryAsync(n > 1 ? g : q).then(
      u => {

        if (!u|| u.length === 0)
          return res.notFound({err: 'No game found for these users'});
        return res.json(200, u);
      }
    ).catch(err => res.serverError(err));

  },

  findByUser: function (req, res) {
    let userId = req.params.id;

    if (!userId)
      return res.badRequest({err: 'No user id provided'});
    UserGame.find({user:  userId }).populate('game').populate('user')
      .then(_usergames => {

        if (!_usergames || _usergames.length === 0) {
          throw new Error('No game found for this user');
        }
        return res.ok(_usergames);

      })
      .catch(err => res.serverError(err));
  },

  findExistingGameNotOwnedByUser: function (req, res) {
    let id = req.params.id;
    if (!id)
      return res.badRequest({err: 'No id provided'});
    let r = 'select distinct(game.name) from usergame\n' +
      'join game on usergame.game = game.id where game not in (select game from usergame where user = ' + id +')\n' +
      'order by game;';
    let queryAsync = Promise.promisify(UserGame.query);
    queryAsync(r).then(
      u => {

        if (!u|| u.length === 0)
          return res.notFound({err: 'No unowned game found for these users'});
        return res.json(200, u);
      }
    ).catch(err => res.serverError(err));
  },

  update: function (req, res) {
    let userGameId = req.params.id;
    let installed = req.param('installed');

    if (!userGameId) return res.badRequest({err: 'no userGame id provided'});
    let userGame = {};
    if (installed !== null)
      userGame.installed = installed;
    UserGame.update({id: userGameId}, userGame)
      .then(_userGame => {
        if (!_userGame[0] || _userGame[0].length === 0) return res.notFound({err: 'No user game found'});
        return res.ok(_userGame);
      }).catch(err => res.serverError(err));
  }
};

