/// <reference path="../qunit/qunit.js" />
/// <reference path="../../../model/Model.js" />

/**********************************************************************/
module('EventHandler');
/**********************************************************************/
test('ctor length is 0', 1, function () {
  //arrange

  //act
  var e = new EventHandler();

  //assert
  equals(e._events.length, 0);
});

test('on without context adds a listener', 4, function () {
  //arrange
  var e = new EventHandler();

  //act
	e.on('test', function(){});

	//assert
  equals(e._events.length, 1, 'number of events');
  equals(e._events['test'].length, 1, 'number of listeners for that event');
  equals(e._events['test'].name, 'test', 'the name of the event is correctly set');
  equals(e._events[0].name, 'test', 'the same event is accessible by name and index');
});

asyncTest('fire fires only and all given event\'s listener', 2, function () {
  //arrange
  var e = new EventHandler();
	var expectedCalled = 0;
	var unexpectedCalled = 0;
	e.on('expected', function(){expectedCalled++;});
	e.on('expected', function(){expectedCalled++;});
	e.on('unexpected', function(){unexpectedCalled++;});

	//assert
	setTimeout(function () {
		equals(expectedCalled, 2, 'all listener have been invoked');
		equals(unexpectedCalled, 0, 'other events have not been fired');
		start();
	}, 100);

	//act
	e.fire('expected');
});

asyncTest('fire with context overrides callback context', 1, function () {
  //arrange
  var e = new EventHandler();
	var actual;
	var context = { foo: 'bar'};
	e.on('foo', function(){actual = this.foo;});

	//assert
	setTimeout(function () {
		equals(actual, context.foo, 'callback context was correctly set');
		start();
	}, 100);

	//act
	e.fire('foo', context);
});

asyncTest('fire with args callback with args', 1, function () {
  //arrange
  var e = new EventHandler();
	var actual;
	var context = {foo: '1'};
	e.on('foo', function(p1, p2){actual = this.foo.toString() + p1.toString() + p2.toString();});

	//assert
	setTimeout(function () {
		equals(actual, '123', 'callback context was correctly set and arguments have been passed');
		start();
	}, 100);

	//act
	e.fire('foo', context, 2, 3);
});


