'use strict';

var React = require('react/addons');

var MIN_TAG_LENGTH = 3;

function resetInput(component) {
  component.setState({
    userInput: ''
  });
  React.findDOMNode(component.refs.newTag).focus();
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
    tags: React.addons.update(existingTags, {$push: [sanitizedTag]}),
  });
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
    var self = this;
    var tagItems = this.state.tags.map(function (tag, i) {
      var highlightCssClass = self.state.existingTagIndex === i ?
          ' highlight' : '';
      return React.DOM.span({
        key: i,
        className: 'pill' + highlightCssClass
      },
        React.DOM.span({ className: 'tag' }, tag),
        React.DOM.a({
          className: 'remove',
          onClick: self._onRemoveTag.bind(self, i)
        }, String.fromCharCode(215)));
    });
    return (
      React.DOM.div({className: 'tag-input'},
        tagItems,
        React.DOM.input({
          type: 'text',
          onChange: this._onInputChange,
          onKeyUp: this._onInputKeyUp,
          className: cssClassNames.join(' '),
          ref: 'newTag',
          value: this.state.userInput
        }))
    );
  },
  _highlightTimer: null,
  _onRemoveTag: function (index) {
    var newTags = this.state.tags.slice();
    newTags.splice(index, 1);
    this.setState({ tags: newTags });
    React.findDOMNode(this.refs.newTag).focus();
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
  _onInputKeyUp: function (event) {
    var userInput = event.target.value;
    this.setState({userInput: userInput});
    if (event.keyCode === 13) {
      if (validateTag(userInput)) {
        addTag(this, userInput);
      }
      resetInput(this);
    }
  }
});
