/*globals describe, it, beforeEach, afterEach, Event */
/*jshint maxstatements:false */
'use strict';

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assert = require('assert');
var sinon = require('sinon');
var tagInputComponent = require('../');

function $(selector, context) {
  context = context || document;
  return context.querySelectorAll(selector);
}

describe('component', function () {
  var div;
  var input;

  function render(props) {
    props = props || {};
    var component = React.render(React.createElement(tagInputComponent, props),
      div);
    input = $('input.new-tag', div)[0];
    return component;
  }

  beforeEach(function () {
    div = document.createElement("div");
    document.body.appendChild(div);
  });

  afterEach(function () {
    if (div) {
      React.unmountComponentAtNode(div);
      div.parentNode.removeChild(div);
    }
    input = null;
  });

  describe('without props', function () {

    beforeEach(function () {
      render();
    });

    it('renders input', function () {
      assert.equal($('input.new-tag', div).length, 1);
    });

    it('focuses on input on render', function () {
      assert(document.activeElement === $('input.new-tag', div)[0]);
    });

    it('adds tag if comma is detected', function () {
      TestUtils.Simulate.change(input, {target: { value: 'foo,' }});

      assert.equal($('.tag', div).length, 1);
      assert.equal($('.tag', div)[0].textContent, 'foo');
    });
  });

  it('adds tag on enter', function () {
    render({
      userInput: 'foo'
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.tag', div).length, 1);
    assert.equal($('.tag', div)[0].textContent, 'foo');
  });

  it('adds another tag', function () {
    var component = render({
      userInput: 'bar'
    });
    component.setState({tags: ['foo']});

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.tag', div).length, 2);
    assert.equal($('.tag', div)[0].textContent, 'foo');
    assert.equal($('.tag', div)[1].textContent, 'bar');
  });

  it('ignores duplicate tags', function () {
    var clock = sinon.useFakeTimers();
    var component = render({
      userInput: 'foo'
    });
    component.setState({tags: ['foo']});

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill.highlight', div).length, 1);
    assert.equal($('.pill .tag', div)[0].textContent, 'foo');

    clock.tick(100);
    assert.equal($('.pill.highlight', div).length, 0);

    clock.restore();
  });

  it('removes tag on backspace', function () {
    var component = render();
    component.setState({tags: ['foo']});

    assert.equal($('.pill', div).length, 1);

    TestUtils.Simulate.keyDown(input, {keyCode: 8}); // Backspace

    assert.equal($('.pill', div).length, 0);
  });

  it('removes tag on click', function () {
    var component = render();
    component.setState({tags: ['foo']});

    assert.equal($('.pill', div).length, 1);

    TestUtils.Simulate.click($('.remove', div)[0]);

    assert.equal($('.pill', div).length, 0);
  });

  it('trims whitespace', function () {
    render({
      userInput: '   foo       '
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.tag', div)[0].textContent, 'foo');
  });

  it('does not remove tag if input has contents', function () {
    var component = render({
      userInput: 'f'
    });
    component.setState({tags: ['bar']});

    TestUtils.Simulate.keyDown(input, {keyCode: 8}); // Backspace

    assert.equal($('.pill', div).length, 1);

    input.value = ''; // force empty
    TestUtils.Simulate.keyDown(input, {keyCode: 8}); // Backspace

    assert.equal($('.pill', div).length, 0);
  });

  it('yields callback with tags', function () {
    var spy = sinon.spy();
    render({
      userInput: 'foo',
      onTagChange: spy
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy.firstCall, ['foo']);
  });

  it('allows tags with custom length', function () {
    render({
      userInput: 'fo',
      minTagLength: 2
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill .tag', div)[0].textContent, 'fo');
  });

  it('listens to input changes', function () {
    var spy = sinon.spy();
    render({
      onInputChange: spy
    });

    TestUtils.Simulate.change(input, {target: { value: 'f' }});
    TestUtils.Simulate.change(input, {target: { value: 'fo' }});

    sinon.assert.calledTwice(spy);
    sinon.assert.calledWith(spy.lastCall, 'fo');
  });
});

