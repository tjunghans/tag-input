# React-Round-Trip-Rate

[![SemVer]](http://semver.org)
[![License]](https://github.com/tjunghans/react-round-trip-rate/blob/master/LICENCE)
[![Build Status](https://travis-ci.org/tjunghans/react-round-trip-rate.svg?branch=master)](https://travis-ci.org/tjunghans/react-round-trip-rate)

A react component that renders a button that, if clicked repeatedly changes
state according to `steps`(default 3, for example for min, normal and max).

[Demo](http://tangiblej.neocities.org/react-round-trip-rate-example.html)


## Install

Install as node dependency:

```
npm install react-round-trip-rate --save
```


## Quickstart

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

```javascript

var React = require('react');
var roundTripRate = require('react-round-trip-rate');

React.createElement(roundTripRate, {
  steps: 3, // steps as in good, very good, excellent
  label: 'Java skill', // the name of what is being rated. In this case Java skill
  cssClass: 'rating'
}));
```

## Properties

- `label`: button label
- `steps`: number of rating steps
- `cssClass`: css class to apply to the button


## License

MIT

[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/mochify.svg


