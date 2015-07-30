'use strict';

var React = require('react/addons');
var pill = require('./pill');

function calculateInputWidth() {
  var input = React.findDOMNode(this.refs.newTag);
  input.style.width = (React.findDOMNode(this.refs.newTagSize)
    .clientWidth + 8) + 'px';
}

// Fixme: Make configurable
function sanitized(tag) {
  return tag.trim();
}

function addTag(tag) {
  var existingTags = this.state.tags;
  var sanitizedTag = sanitized(tag);
  var duplicateIndex = existingTags.indexOf(sanitizedTag);
  clearTimeout(this._highlightTimer);
  if (duplicateIndex !== -1) {
    this.setState({
      existingTagIndex: duplicateIndex
    });
    var self = this;
    this._highlightTimer = setTimeout(function () {
      self.setState({ existingTagIndex: -1 });
    }, 100);
    return false;
  }
  var newTags = this.state.tags.slice();
  newTags.push(sanitizedTag);
  this.setState({ tags: newTags  });
  this.onTagChange(newTags);
}

function validate(cmp, tag) {
  if (typeof tag !== 'string') {
    return false;
  }
  var sanitizedTag = tag.trim();
  if (sanitizedTag.length < cmp.props.minTagLength) {
    return false;
  }
  return true;
}

module.exports = React.createClass({
  displayName: 'tag-input',
  propTypes: {
    cssClass: React.PropTypes.string,
    onTagsChange: React.PropTypes.func,
    onInputChange: React.PropTypes.func,
    minTagLength: React.PropTypes.number
  },
  getDefaultProps: function () {
    return {
      minTagLength: 3,
      userInput: ''
    };
  },
  getInitialState: function () {
    return {
      tags: [],
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
      React.DOM.div({
        className: 'tag-input',
        onClick: this._focusInput
      },
        tagItems,
        React.DOM.input({
          type: 'text',
          onChange: this._onChange,
          onKeyUp: this._onInputKeyUp,
          onKeyDown: this._onInputKeyDown,
          className: cssClassNames.join(' '),
          ref: 'newTag',
          value: this.props.userInput
        }),
        React.DOM.span({
          className: 'new-tag-size',
          ref: 'newTagSize'
        }, this.props.userInput))
    );
  },
  componentDidMount: function () {
    this._focusInput();
  },
  componentDidUpdate: function () {
    calculateInputWidth.bind(this)();
  },
  onTagChange: function (tags) {
    if (this.props.onTagChange) {
      this.props.onTagChange(tags);
    }
  },
  _highlightTimer: null,
  _focusInput: function () {
    React.findDOMNode(this.refs.newTag).focus();
  },
  _resetInput: function () {
    this._setUserInput('');
    this._focusInput();
  },
  _setUserInput: function (userInput) {
    if (this.props.onInputChange) {
      this.props.onInputChange(userInput);
    }
  },
  _onRemoveTag: function (index) {
    var newTags = this.state.tags.slice();
    newTags.splice(index, 1);
    this.setState({ tags: newTags });
    this.onTagChange(newTags);
    this._focusInput();
  },
  _onChange: function (event) {
    var userInput = event.target.value;
    this._setUserInput(userInput);
    var newTag;
    if (userInput.indexOf(',') > 0) {
      newTag = userInput.split(',')[0];
      if (validate(this, newTag)) {
        addTag.bind(this)(newTag);
        this._resetInput();
      }
    }
  },
  _onInputKeyDown: function (event) {
    if (event.keyCode === 8 && event.target.value === '') {
      // Backspace key
      if (this.state.tags.length) {
        this._onRemoveTag(this.state.tags.length - 1);
      }
    }
  },
  _onInputKeyUp: function (event) {
    if (event.keyCode === 13) { // Enter key
      var userInput = this.props.userInput;
      if (validate(this, userInput)) {
        addTag.bind(this)(userInput);
      }
      this._resetInput();
    }
  }
});
