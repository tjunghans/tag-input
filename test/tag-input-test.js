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
  var input;

  function render() {
    React.render(React.createElement(tagInput), div);
    input = $('input.new-tag', div)[0];
  }

  function addTag(value) {
    input.value = value;

    TestUtils.Simulate.change(input);

    return input;
  }

  function addTagOnEnter(value) {
    addTag(value);
    TestUtils.Simulate.keyUp(input, {keyCode: 13});
  }

  beforeEach(function () {
    div = document.createElement("div");
    document.body.appendChild(div);
    render();
    sinon.stub(process, 'nextTick');
  });

  afterEach(function () {
    if (div) {
      React.unmountComponentAtNode(div);
      div.parentNode.removeChild(div);
    }
    input = null;
    process.nextTick.restore();
  });

  it('renders input', function () {
    assert.equal($('input.new-tag', div).length, 1);
  });

  it('adds tag on enter', function () {
    addTagOnEnter('foo');

    assert.equal($('.tag', div).length, 1);
    assert.equal($('.tag', div)[0].textContent, 'foo');
    assert.equal(input.value, '');
  });

  it('adds tag if comma is detected', function () {
    addTag('foo,');

    assert.equal($('.tag', div).length, 1);
    assert.equal($('.tag', div)[0].textContent, 'foo');
    assert.equal(input.value, '');
  });

  it('converts tag to lowercase', function () {
    addTagOnEnter('FOo');

    assert.equal($('.tag', div)[0].textContent, 'foo');
  });

  it('trims whitespace', function () {
    addTagOnEnter(' foo   ');

    assert.equal($('.tag', div)[0].textContent, 'foo');
  });

  it('adds another tag', function () {
    addTagOnEnter('foo');
    addTagOnEnter('bar');

    assert.equal($('.tag', div).length, 2);
    assert.equal($('.tag', div)[0].textContent, 'foo');
    assert.equal($('.tag', div)[1].textContent, 'bar');
  });

  it('ignores duplicate tags', function () {
    var clock = sinon.useFakeTimers();
    addTagOnEnter('foo');
    addTagOnEnter('foo');

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill.highlight', div).length, 1);
    assert.equal($('.pill .tag', div)[0].textContent, 'foo');

    clock.tick(100);
    assert.equal($('.pill.highlight', div).length, 0);

    clock.restore();
  });

  it('removes tag', function () {
    addTagOnEnter('foo');

    TestUtils.Simulate.click($('.remove', div)[0]);

    assert.equal($('.pill', div).length, 0);
  });

  it('focuses on input on render', function () {
    assert(document.activeElement === $('input.new-tag', div)[0]);
  });

  it('removes tag on backspace', function () {
    addTagOnEnter('foo');

    TestUtils.Simulate.keyDown(input, {keyCode: 8});

    assert.equal($('.pill', div).length, 0);
  });

  it('does not remove tag if input has contents', function () {
    addTagOnEnter('foo');
    TestUtils.Simulate.change(input, { target: { value: 'b' } });

    TestUtils.Simulate.keyDown(input, {keyCode: 8});
    TestUtils.Simulate.change(input, { target: { value: '' } });
    assert.equal($('.pill', div).length, 1);

    TestUtils.Simulate.keyDown(input, {keyCode: 8});
    assert.equal($('.pill', div).length, 0);
  });
});

