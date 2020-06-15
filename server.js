var express = require('express');
var passport = require('passport');
var util = require('util');

var cookieParser = require('cookie-parser');
var session = require('express-session');
let cors = require('cors');

var BnetStrategy = require('passport-bnet').Strategy;

var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;

const base_url = '/lich-king';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the BnetStrategy within Passport.
passport.use(
  new BnetStrategy(
    {
      clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      scope: 'wow.profile',
      callbackURL: `https://2194d9d9.ngrok.io${base_url}/auth/bnet/callback`,
      region: 'us'
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

var app = express();
app.use(cors());

// configure Express
app.use(cookieParser());
app.use(
  session({
    secret: 'blizzard',
    saveUninitialized: true,
    resave: true
  })
);

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get(`${base_url}/auth/bnet`, passport.authenticate('bnet'));

app.get(
  `${base_url}/auth/bnet/callback`,
  passport.authenticate('bnet', { failureRedirect: `${base_url}/` }),
  function(req, res) {
    res.redirect(`${base_url}/`);
  }
);

app.get(`${base_url}/`, function(req, res) {
  if (req.isAuthenticated()) {
    var output = '<h1>Express OAuth Test</h1>' + req.user.id + '<br>';
    if (req.user.battletag) {
      output += req.user.battletag + '<br>';
    }
    output += '<a href="/logout">Logout</a>';

    res.send(output);
  } else {
    res.send(
      '<h1>Express OAuth Test</h1>' +
        '<a href="/lich-king/auth/bnet">Login with Bnet</a>'
    );
  }
});

app.get(`${base_url}/logout`, function(req, res) {
  req.logout();
  res.redirect(`${base_url}/`);
});

const defaultPort = parseInt(process.env.PORT || 8000, 10);

exports.start = function(port) {
  if (port == null) {
    port = defaultPort;
  }
  const server = app.listen(port, () => {
    console.log('Listening on port %d', server.address().port);
  });
};
