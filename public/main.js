'use strict';

var React = require('react');
var tagInputComponent = require('../');

var tagInputContainer = React.createClass({
  getInitialState: function () {
    return {
      userInput: ''
    };
  },
  render: function () {
    var self = this;
    return (
      React.DOM.div(null, React.createElement(tagInputComponent, {
        userInput: self.state.userInput,
        onInputChange: function (input) {
          self.setState({ userInput: input });
        },
        onTagChange: function (tags) {
          console.log(tags);
        }
      }))
    );
  }
});

React.render(React.createElement(tagInputContainer),
  document.querySelector('#content'));

