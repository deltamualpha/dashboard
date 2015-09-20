var blessed      = require('blessed');
var contrib      = require('blessed-contrib');

var screen = blessed.screen({ smartCSR: true, title: 'Dashboard'});

// contrib.grid auto-appends, which is a nice touch
var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

//grid.set(row, col, rowSpan, colSpan, obj, opts)
module.exports.alertsBox = grid.set(0, 0, 6, 12, // top half of screen
  contrib.log,
  {
    label: 'Alerts',
    content: 'Once things get going, you\'ll see alerts here.'
  }
);

module.exports.statusesBarChart = grid.set(6, 0, 4, 4, // left-middle
  contrib.bar,
  {
    label: 'HTTP Statuses',
    barWidth: 4,
    barSpacing: 6,
    xOffset: 0,
    maxHeight: 6
  }
);

module.exports.sparkline = grid.set(6, 4, 4, 4, // dead center
  contrib.sparkline,
  {
    label: 'Throughput',
    tags: true
  }
);

module.exports.sectionsBarChart = grid.set(6, 8, 4, 4, // right-middle
  contrib.bar,
  {
    label: 'Common Sections',
    barWidth: 4,
    barSpacing: 6,
    xOffset: 0,
    maxHeight: 6
  }
);

module.exports.sectionsBox = grid.set(10, 0, 2, 6, // bottom left corner
  blessed.box,
  {
    label: 'Most Frequent Section'
  }
);

module.exports.statusBox = grid.set(10, 6, 2, 6, // bottom right corner
  blessed.box,
  {
    label: 'Most Common Status'
  }
);

// catch and support ctrl-c and q to quit
screen.key(['C-c', 'q'], function() {
  return process.exit(0);
});

module.exports.render = function(){ screen.render(); };
