
var request = require('request');
module.exports = {
  getSteamId: function (req, res) {
    let key = req.param('key');

    let vanityUrl = req.param('vanityurl');
    let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + key
              + '&vanityurl=' + vanityUrl;
    request.get({url: url}, function (error, response, body) {
      if (error)
        return res.json(401, error);
      return res.json(200, JSON.parse(body));
    });
  },

  getOwnedGames: function (req, res) {
    let key = req.param('key');
    let steamid = req.param('steamid');
    let url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+ key
                +'&steamid=' + steamid + '&include_appinfo=1&include_played_free_games=1';

    request.get({url: url}, function (error, response, body) {
      if (error)
        return res.json(401, error);
      let jsonObject = JSON.parse(body);
      let games = jsonObject.response.games;
      return res.json(200, games);
    });
  }
};
