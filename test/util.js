var assert = require('assert');
var utils = require('../lib/util.js');
var _ = require('lodash');

describe('dashboard utilities', function(){
  it('should get the relevant section of a request', function(done){
    // get the base section
    assert.equal(utils.getSection('GET /foo/bar/baz.jpg HTTP/1.1'), '/foo/');
    assert.equal(utils.getSection('POST /foo/bar HTTP/1.1'), '/foo/');
    // no matter what comes after
    assert.equal(utils.getSection('POST /?path=/bar/baz HTTP/1.1'), '/');
    assert.equal(utils.getSection('POST /foo/?path=/bar/baz HTTP/1.1'), '/foo/');
    // unify various URL styles
    assert.equal(utils.getSection('GET /foo/ HTTP/1.1'), '/foo/');
    assert.equal(utils.getSection('GET /foo HTTP/1.1'), '/foo/');
    // handle the root
    assert.equal(utils.getSection('GET / HTTP/1.1'), '/');
    done();
  });

  it('should return the largest key: value pair from an object', function(done){
    var pop = {
      '/foo': 100,
      '/bar': 200,
      '/baz': 0
    };
    assert.deepEqual(utils.popularityContest(pop), ['/bar', 200]);
    assert.deepEqual(utils.popularityContest({}), ['/', 0]);
    assert.deepEqual(utils.popularityContest({}, 'foo'), ['foo', 0]);
    done();
  });

  it('should increment the counters in an object', function(done){
    var counterObject = {};
    _.times(4, function(){
      utils.incrementCounter(counterObject, '/foo');
    });
    _.times(10, function(){
      utils.incrementCounter(counterObject, '/bar');
    });
    assert.deepEqual(counterObject, { '/foo': 4, '/bar': 10 });
    done();
  });

  it('should alert based on volume', function(done){
    var alerts = {history: [], currentStatus: false};
    var totals = [100, 300, 400, 0];
    var period = 4;
    utils.alertManager(alerts, totals, period, 1);
    assert(alerts.currentStatus);
    utils.alertManager(alerts, totals, period, 800);
    assert(!alerts.currentStatus);
    done();
  });

  it('should pull specified values out of an object by key', function(done){
    const dataObject = {
      'foo': 200,
      'bar': 100,
      'baz': 10
    };
    assert.deepEqual(utils.chartData(['foo'], dataObject), [200]);
    assert.deepEqual(utils.chartData(['foo', 'bar'], dataObject), [200, 100]);
    assert.deepEqual(utils.chartData(['foo', 'baz'], dataObject), [200, 10]);
    assert.deepEqual(utils.chartData(['baz', 'foo'], dataObject), [10, 200]);
    assert.deepEqual(utils.chartData(['quuz'], dataObject), [0]);
    done();
  });
});
