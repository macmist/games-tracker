

module.exports = {
  /**
   * It will create a new user .
   */
  create: function (req, res) {

    let login = req.param('login'),
      pass = req.param('pass');

    if(!login){
      return res.badRequest({err:'Invalid login'});
    }

    if(!pass){
      return res.badRequest({err:'Invalid pass'});
    }

    User.create({
      login : login,
      pass: pass
    })
      .then(_user => {
      if(!_user) return res.serverError({err:'Unable to create user'});

    return res.ok(_user); //to learn more about responses check api/responses folder
  })
    .catch(err => res.serverError(err.message));
  },

  findAll: function (req, res) {
    User.find().populate('games')
      .then(_users => {

        if (!_users || _users.length === 0) {
          throw new Error('No users found');
        }
        return res.ok(_users);

      })
      .catch(err => res.serverError(err));
  },

  update: function (req, res) {
    let login = req.param('login');
    let pass = req.param('pass');
    let steamId = req.param('steamId');
    let steamUrl = req.param('steamUrl');
    let userId = req.params.id;

    if (!userId)
      return res.badRequest({err : 'user id is missing'});
    let user = {};
    if (login)
      user.login = login;
    if (pass)
      user.pass = pass;
    if (steamId)
      user.steamId = steamId;
    if (steamUrl)
      user.steamUrl = steamUrl;

    User.update({ id: userId}, user).populate('games')
      .then(_user => {
        if (!_user[0] || _user[0].length === 0)
          return res.notFound({ err: 'No matching user found'});
        return res.ok(_user);
      }).catch(err => res.serverError(err));
  },

  login: function (req, res) {

    let login = req.param('login');
    let pass = req.param('pass');

    if (!login || !pass)
      return res.badRequest({err: 'Missing login or password'});

    User.findOne({ login: login}).populate('games')
      .then(user => {
      if (!user)
        return res.badRequest({err: 'No user found or wrong password'});
      if (user.pass !== pass)
        return res.badRequest({err: 'No user found or wrong password'});
      let token = jwt.issue({id: user.id});
      sails.session.userid = user.id;
      return res.json(200, {user: user, token: token});
    }).catch(err => res.serverError(err));
  },

  logout: function (req, res) {
    if (!sails.session.userid)
      return res.badRequest();

    delete sails.session.userid;
    return res.end();
  },

  getCurrentUser: function (req, res) {
    let tokens = req.headers.authorization.split(' ');
    if (tokens === undefined || tokens.length < 2)
      return res.json(401, {err: 'No token found'});
    let token = tokens[1];
    jwt.verify(token, function (err, token) {
      if (err) return res.notFound('Invalid Token!');
      userId = token.id;
      User.findOne({id : userId}).populate('games')
        .then( user => {
        if (!user)
          return res.notFound('No user found');
        return res.ok(user);
      }).catch(err => res.serverError(err));
    });
  }
};
