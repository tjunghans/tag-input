/*globals describe, it, beforeEach, afterEach, Event */
/*jshint maxstatements:false */
'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');
var tagInput = require('../');

function $(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

// TestUtils.SimulateNative.click(button);

describe('component', function () {
  var div;

  function render() {
    React.render(React.createElement(tagInput), div);
  }

  function addTag(value) {
    var input = $('input.new-tag', div)[0];
    input.value = value;

    TestUtils.Simulate.change(input);

    return input;
  }

  function addTagOnEnter(value) {
    var input = addTag(value);
    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    return input;
  }

  beforeEach(function () {
    div = document.createElement("div");
    render();
  });

  afterEach(function () {
    if (div) {
      React.unmountComponentAtNode(div);
    }
  });

  it('renders input', function () {
    assert.equal($('input.new-tag', div).length, 1);
  });

  it('adds tag on enter', function () {
    var input = addTagOnEnter('foo');

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill', div)[0].textContent, 'foo');
    assert.equal(input.value, '');
  });

  it('adds tag if comma is detected', function () {
    var input = addTag('foo,');

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill', div)[0].textContent, 'foo');
    assert.equal(input.value, '');
  });

  it('adds another tag', function () {
    addTagOnEnter('foo');
    addTagOnEnter('bar');

    assert.equal($('.pill', div).length, 2);
    assert.equal($('.pill', div)[0].textContent, 'foo');
    assert.equal($('.pill', div)[1].textContent, 'bar');
  });

  it('ignores duplicate tags', function () {
    var clock = sinon.useFakeTimers();
    addTagOnEnter('foo');
    addTagOnEnter('foo');

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill.highlight', div).length, 1);
    assert.equal($('.pill', div)[0].textContent, 'foo');

    clock.tick(100);
    assert.equal($('.pill.highlight', div).length, 0);

    clock.restore();
  });


});

