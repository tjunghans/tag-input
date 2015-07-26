'use strict';

var React = require('react');
var tagInputComponent = require('../');

React.render(React.createElement(tagInputComponent, {
  onTagChange: function (tags) {
    console.log(tags);
  }
}),
  document.querySelector('#content'));

