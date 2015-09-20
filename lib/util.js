var _ = require('lodash');

module.exports.getSection = function(url) {
  var section = url
    .split(' ')[1] // grab path
    .split('?')[0] // discard querystring
    .split('/')    // explode on dirs
    .slice(0, 2)   // grab base dir
    .join('/');    // replace slashes
  return section === '/' ? section : section + '/'; 
};

module.exports.popularityContest = function(sections, defaultSection) {
  if (!defaultSection) { defaultSection = '/'; }
  // it has to walk the whole object... but at least only once
  return _.reduce(sections, function(result, count, section){
    if (result[1] < count) { result = [section, count]; }
    return result;
  }, [defaultSection, 0]);
};

module.exports.incrementCounter = function(counter, key) {
  if (!counter[key]) {
    counter[key] = 1;
  } else {
    counter[key]++;
  }
};

module.exports.resetRecentStats = function(stats) {
  stats.rawLogLines = [];
  stats.sectionCounts = {};
  stats.statusCounts = {};
};

module.exports.alertManager = function(alerts, totals, period, error){
  var recentEventCount = _.reduce(totals.slice(-period), function(current, total) {
    return current + total;
  }, 0);
  if ((recentEventCount / period) > error) {
    var alertLine = "High traffic generated an alert - hits = " + recentEventCount + ", triggered at " + new Date();
    alerts.history.push(alertLine);
    alerts.currentStatus = true;
    return alertLine;
  } else if (alerts.currentStatus) {
    var logLine = "No longer alerting; " + new Date();
    alerts.history.push(logLine);
    alerts.currentStatus = false;
    return logLine;
  } else {
    return false;
  }
};

module.exports.chartData = function(statusList, data){
  var dataSet = [];
  for (var i = statusList.length - 1; i >= 0; i--) {
    dataSet.unshift(data[statusList[i]] || 0);
  }
  return dataSet;
};
