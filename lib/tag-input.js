'use strict';

var React = require('react/addons');
var raf = require('raf');
var pill = require('./pill');

var MIN_TAG_LENGTH = 3;

function resetInput(component) {
  component.setState({
    userInput: ''
  });
  React.findDOMNode(component.refs.newTag).focus();
}

function calculateInputWidth(component) {
  var input = React.findDOMNode(component.refs.newTag);
  input.style.width = 'auto';
  raf(function () {
    var parent = input.parentNode;
    var newWidth = parent.clientWidth - input.offsetLeft;
    input.style.width = (newWidth - 10) + 'px';
  });
}

function sanitized(tag) {
  return tag.trim().toLowerCase();
}

function addTag(component, tag) {
  var existingTags = component.state.tags;
  var sanitizedTag = sanitized(tag);
  var duplicateIndex = existingTags.indexOf(sanitizedTag);
  clearTimeout(component._highlightTimer);
  if (duplicateIndex !== -1) {
    component.setState({
      existingTagIndex: duplicateIndex
    });
    component._highlightTimer = setTimeout(function () {
      component.setState({
        existingTagIndex: -1
      });
    }, 100);
    return false;
  }
  component.setState({
    tags: React.addons.update(existingTags, {$push: [sanitizedTag]})
  });
}

function removeTag(index) {
  var newTags = this.state.tags.slice();
  newTags.splice(index, 1);
  this.setState({ tags: newTags });
  React.findDOMNode(this.refs.newTag).focus();
}

function validateTag(tag) {
  if (typeof tag !== 'string') {
    return false;
  }
  var sanitizedTag = tag.trim();
  if (sanitizedTag.length < MIN_TAG_LENGTH) {
    return false;
  }

  return true;
}

module.exports = React.createClass({
  displayName: 'tag-input',
  propTypes: {
    cssClass: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      tags: [],
      userInput: '',
      existingTagIndex: -1
    };
  },
  render: function () {
    var cssClassNames = ['new-tag'];
    if (this.props.cssClass) {
      cssClassNames.push(this.props.cssClass);
    }
    var tagItems = this.state.tags.map(function (tag, i) {
      var highlightCssClass = this.state.existingTagIndex === i ?
          ' highlight' : '';
      return React.createElement(pill, {
        key: i,
        cssClass: highlightCssClass,
        tag: tag,
        onClick: this._onRemoveTag.bind(this, i)
      });
    }, this);
    return (
      React.DOM.div({className: 'tag-input'},
        tagItems,
        React.DOM.input({
          type: 'text',
          onChange: this._onInputChange,
          onKeyUp: this._onInputKeyUp,
          onKeyDown: this._onInputKeyDown,
          className: cssClassNames.join(' '),
          ref: 'newTag',
          value: this.state.userInput
        }))
    );
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.newTag).focus();
  },
  componentDidUpdate: function () {
    calculateInputWidth(this);
  },
  _highlightTimer: null,
  _onRemoveTag: function (index) {
    removeTag.bind(this)(index);
  },
  _onInputChange: function (event) {
    var userInput = event.target.value;
    this.setState({userInput: userInput});
    var newTag;
    if (userInput.indexOf(',') > 0) {
      newTag = userInput.split(',')[0];
      if (validateTag(newTag)) {
        addTag(this, newTag);
        resetInput(this);
      }
    }
  },
  _onInputKeyDown: function (event) {
    var userInput = event.target.value;

    if (event.keyCode === 8 && userInput === '') {
      // Backspace key
      if (this.state.tags.length) {
        removeTag.bind(this)(this.state.tags.length - 1);
      }
    }
  },
  _onInputKeyUp: function (event) {
    var userInput = event.target.value;
    this.setState({userInput: userInput});
    if (event.keyCode === 13) {
      // Enter key
      if (validateTag(userInput)) {
        addTag(this, userInput);
      }
      resetInput(this);
    }
  }
});
