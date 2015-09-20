var _    = require('lodash');
var fs   = require('fs');
var argv = require('yargs').argv;

var opts = {
  maxRate: argv.maxRate || 1000,
  minRate: argv.minRate || 100,
  currentRate: argv.maxRate / 2 || 500,
  movement: argv.movement || 200,
  domain: argv.domain || 'localhost'
};

const seeds = {
  methods: [
    'GET', // poor man's weighting
    'GET',
    'GET',
    'GET',
    'GET',
    'GET',
    'GET',
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],
  statuses: [
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '200',
    '201',
    '302',
    '304',
    '404',
    '500',
    '503'
  ],
  routes: [
    '/',
    '/',
    '/',
    '/',
    '/',
    '/',
    '/',
    '/',
    '/api:routes',
    '/assets/img/:nouns.jpg',
    '/assets/img/:nouns.jpg',
    '/assets/img/:nouns.jpg',
    '/assets/img/:nouns.jpg',
    '/assets/img/:nouns.jpg',
    '/assets/scripts/:nouns.js',
    '/assets/scripts/:nouns.js',
    '/assets/scripts/:nouns.js',
    '/assets/scripts/:nouns.js',
    '/assets/scripts/:nouns.js',
    '/categories/:num',
    '/feeds',
    '/login',
    '/tags/:nouns',
    '/users/:num',
    '/users/:num',
    '/users/:num'
  ],
  nouns: [
    'dog',
    'cat',
    'sheep',
    'horse'
  ],
  userAgents: [
    'Mozilla/4.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/4.0 (Compatible; MSIE 8.0; Windows NT 5.2; Trident/6.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Macintosh; Intel Mac OS X 10_7_3; Trident/6.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/4.0; InfoPath.2; SV1; .NET CLR 2.0.50727; WOW64)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/5.0)',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/31.0',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20130401 Firefox/31.0',
    'Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
  ]
};

var generateLine = function(seeds){
  var path = _.sample(seeds.routes)
    .replace(':routes', _.sample(seeds.routes))
    .replace(':num', _.random(1, 100))
    .replace(':nouns', _.sample(seeds.nouns));

  return [
    '[' + new Date() + ']',                                    // date
    _.times(4, _.partial(_.random, 0, 255, false)).join('.'),  // ip
    '-',                                                       // authen user
    '"' + _.sample(seeds.methods) + ' ' + path + ' HTTP/1.1"', // request
    _.sample(seeds.statuses),                                  // status
    _.random(0, 200000),                                       // bytes
    '"-"',                                                     // referrer
    '"' + _.sample(seeds.userAgents) + '"'                     // user agent
  ].join(' ');
};

var loop = function(seeds, opts) {
  opts.currentRate = opts.currentRate + _.random(-argv.movement, argv.movement);
  if (opts.currentRate > opts.maxRate) { opts.currentRate = opts.maxRate; }
  if (opts.currentRate < opts.minRate) { opts.currentRate = opts.minRate; }
  var lines = _.times(opts.currentRate, _.partial(generateLine, seeds)).join('\n');

  fs.appendFile('access.log', lines + '\n', function (err) {
    if (err) { console.log(err); }
  });
};

// append to the log every half-second
setInterval(loop, 500, seeds, opts);
