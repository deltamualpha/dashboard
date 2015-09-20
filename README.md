Dashboard
---------

This is a simple CLI dashboard for monitoring the requests being logged to a
w3c-compatible log file (the kind that Apache and nginx servers generate), and
display graphs, actionable data, and alerts based on those logs.

An example configuration file is provided (`example.config.yaml`). All intervals
are in seconds. The alerting interval should be larger than the UI update 
interval, or else weird things happen.

To use, run `npm install`, then `npm start`. Tests are provided in `/tests/`;
use `npm test` to run them.

In order to make playing with the dashboard easier (assuming you don't want to 
test this out on a machine under load), running `demo.js` will start writing 
into an `access.log` file in the same directory plausible-looking random 
w3c-formatted log lines. There are CLI opts: `maxRate`, `minRate`, and 
`movement`, which should be pretty obvious.

Under the Hood
--------------

The system is written in Node, both because I've been writing a lot of that 
lately and there were libraries to handle big chunks of the heavy lifting; the 
assumption is that when streaming data off a constantly-written-to file (or via 
another process) we're blocked by I/O most of the time, which the event loop 
handles asynchronously... assuming we don't care so much about the order of 
requests as the rate of them, and aggregate information about them.

This is my first time working with [Blessed](https://github.com/chjj/blessed);
it makes handing interactive CLI programming surprisingly like working with the
DOM... which may or may not be a selling point, depending on how much you like
the DOM. I tried to encapulate as much of the state of the program into one or
two objects, so that I dodn't have to pass around and keep track of dozens of 
mutating pieces of state.

Most of the little functions in `util.js` are side-effect-less -- 
`incrementCounter`, `alertManager`, and `resetRecentStats` being the exceptions.
I generally like a more functional style of programming, probably because the 
first 'real' language I learned outside of hobbiest goofing around in PHP was 
Clojure... I find it easier to reason about and a *lot* easier to test all the 
permutations of.
