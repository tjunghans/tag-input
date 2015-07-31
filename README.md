# Tag-Input (with React)

[![SemVer]](http://semver.org)
[![License]](https://github.com/tjunghans/tag-input/blob/master/LICENCE)
[![Build Status](https://travis-ci.org/tjunghans/tag-input.svg?branch=master)](https://travis-ci.org/tjunghans/tag-input)

A react component that renders an input field. When hitting enter or entering a comma, the value will be used to create a tag. Tags are displayed in front of the input.

[Demo](http://tangiblej.neocities.org/tag-input-example.html)


## Install

Install as node dependency:

```
npm install tag-input --save
```


## Quickstart

To test locally change to node_modules/tag-input and run:

```
npm start & npm run watch
```


## Commands

- `npm run build` - build production css and js
- `npm run watch` - compile css and js
- `npm run watch:test` - run tests on change
- `npm start` - start static dev server
- `npm test` - run lint and tests


## Usage

- Version 2.x
- Version 1.3 (deprecated)


### Version 2.x

The `userInput` and `tags` states have been removed in order to make it the componetn reusable in situations where it was used as a child component.
In order to make use of this component a parent component is required. The parent component manages the userInput and tags state. It listens to changes and re-renderers the `tag-input`component. Have a look at the following example:

```javascript
'use strict';

var React = require('react');
var tagInputComponent = require('../');

var tagInputContainer = React.createClass({
  getInitialState: function () {
    return {
      userInput: '',
      tags: []
    };
  },
  render: function () {
    var self = this;
    return (
      React.DOM.div(null, React.createElement(tagInputComponent, {
        userInput: self.state.userInput,
        tags: self.state.tags,
        onInputChange: function (input) {
          self.setState({ userInput: input });
        },
        onTagChange: function (tags) {
          self.setState({ tags: tags });
          // save the tags here
        }
      }))
    );
  }
});

React.render(React.createElement(tagInputContainer),
  document.querySelector('#content'));
```


### Version 1.3

```javascript
var React = require('react');
var tagInput = require('tag-input');

React.render(React.createElement(tagInput),
  document.querySelector('#content'));
```


## Component Props

- `onInputChange`: called whenever the input value is changed.
- `onTagChange`: called when a tag is added or removed. Called with tags array.
- `minTagLength`: Set the minimum character length of a tag. Default is 3.
- `cssClass`: optional css class for container
- `tags`: array of strings that represent the tags
- `userInput`: the value of the input


## License

MIT

[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/mochify.svg


