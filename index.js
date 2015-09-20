var fs           = require('fs');
var yaml         = require('js-yaml');
var nginxParser  = require('nginxparser');
var utils        = require('./lib/util.js');
var ui           = require('./lib/ui.js');

const config = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'));

var stats = {
  rawLogLines: [],
  sectionCounts: {},
  statusCounts: {},
  runningTotals: []
};

var alerts = {
  currentStatus: false,
  history: []
};

// main UI update function
var mainLoop = function() {
  // initial data munging
  var section = utils.popularityContest(stats.sectionCounts);
  var status = utils.popularityContest(stats.statusCounts, '200');
  stats.runningTotals.push(stats.rawLogLines.length);

  // update alerts
  var newLogLine = utils.alertManager(
    alerts,
    stats.runningTotals,
    config.updateFrequency.alertWindow / config.updateFrequency.ui,
    config.alert);
  if (newLogLine) {
    ui.alertsBox.log(newLogLine);
  }

  // update sparkline
  ui.sparkline.setData(['Requests'], [stats.runningTotals.slice(-20)]);

  // update bar charts
  ui.statusesBarChart.setData({
    titles: config.graphs.statuses,
    data: utils.chartData(config.graphs.statuses, stats.statusCounts)
  });

  ui.sectionsBarChart.setData({
    titles: config.graphs.sections,
    data: utils.chartData(config.graphs.sections, stats.sectionCounts)
  });

  // update section and status report boxes
  ui.sectionsBox.setContent('SECTION ' + section[0] + ' - Count: ' + section[1]);
  ui.statusBox.setContent('HTTP ' + status[0] + ' - Count: ' + status[1]);

  // re-render
  ui.render();

  // clear recent history for next go-round
  utils.resetRecentStats(stats);
};

// do per-line logic and parsing here
var reader = function (row) {
  utils.incrementCounter(stats.sectionCounts, utils.getSection(row.request));
  utils.incrementCounter(stats.statusCounts, row.status);
  stats.rawLogLines.push(row);
};

// generic error-handling callback
var errBack = function (err) {
  if (err) {
    throw err;
  }
};

// read from the log file
var parser = new nginxParser(config.log.format);
parser.read(config.log.filename, { tail: true }, reader, errBack);

// intial screen render
ui.render();

// run every updateFrequency.ui seconds (more or less, because javascript)
setInterval(mainLoop, config.updateFrequency.ui * 1000);
