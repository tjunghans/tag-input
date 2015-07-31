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
  });

  it('adds tag if comma is detected', function () {
    var spy = sinon.spy();

    render({
      userInput: 'foo,',
      onTagChange: spy
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['foo']);
  });

  it('adds tag on enter', function () {
    var spy = sinon.spy();
    render({
      userInput: 'foo',
      onTagChange: spy
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['foo']);
  });

  it('adds another tag', function () {
    var spy = sinon.spy();
    render({
      userInput: 'bar',
      tags: ['foo'],
      onTagChange: spy
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.tag', div).length, 1);
    assert.equal($('.tag', div)[0].textContent, 'foo');
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['foo', 'bar']);
  });

  it('adds multiple tags (via copy & paste)', function () {
    var spy = sinon.spy();
    var spyInputChange = sinon.spy();
    render({
      onTagChange: spy,
      onInputChange: spyInputChange
    });

    TestUtils.Simulate.change(input, {target: {
      value: 'java, soccer,foobar, yoghurt,  java'
    }});

    assert.equal(spy.callCount, 4);
    sinon.assert.calledTwice(spyInputChange);
    sinon.assert.calledWith(spyInputChange.lastCall, '');
  });

  it('parses props userInput', function () {
    var spy = sinon.spy();
    render({
      userInput: 'foo, quux',
      tags: ['foo', 'bar', 'baz'],
      onTagChange: spy
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['foo', 'bar', 'baz', 'quux']);
  });

  it('parses props userInput with many tags', function () {
    var spy = sinon.spy();
    render({
      userInput: 'java, soccer,foobar, yoghurt,  java',
      onTagChange: spy
    });

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['java', 'soccer', 'foobar', 'yoghurt']);
  });

  it('ignores duplicate tags', function () {
    var clock = sinon.useFakeTimers();
    render({
      userInput: 'foo',
      tags: ['foo']
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    assert.equal($('.pill', div).length, 1);
    assert.equal($('.pill.highlight', div).length, 1);
    assert.equal($('.pill .tag', div)[0].textContent, 'foo');

    clock.tick(100);
    assert.equal($('.pill.highlight', div).length, 0);

    clock.restore();
  });

  it('removes tag on backspace', function () {
    var spy = sinon.spy();
    render({
      tags: ['foo'],
      onTagChange: spy
    });

    TestUtils.Simulate.keyDown(input, {keyCode: 8}); // Backspace

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, []);
  });

  it('does not remove tag if input has contents', function () {
    var spy = sinon.spy();
    var inputSpy = sinon.spy();
    render({
      userInput: 'f',
      tags: ['bar'],
      onTagChange: spy,
      onInputChange: inputSpy
    });

    TestUtils.Simulate.keyDown(input, {keyCode: 8}); // Backspace
    TestUtils.Simulate.change(input, {target: { value: '' }});

    sinon.assert.notCalled(spy);
    sinon.assert.calledOnce(inputSpy);
    sinon.assert.calledWith(inputSpy, '');
  });

  it('removes tag on click', function () {
    var spy = sinon.spy();
    render({
      tags: ['foo'],
      onTagChange: spy
    });

    assert.equal($('.pill', div).length, 1);

    TestUtils.Simulate.click($('.remove', div)[0]);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, []);
  });

  it('trims whitespace', function () {
    var spy = sinon.spy();
    render({
      userInput: '   foo       ',
      onTagChange: spy
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, ['foo']);
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
    var spy = sinon.spy();
    render({
      userInput: 'fo',
      minTagLength: 2,
      onTagChange: spy
    });

    TestUtils.Simulate.keyUp(input, {keyCode: 13});

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy.firstCall, ['fo']);
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

