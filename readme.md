# Mocha Bar

Mocha Bar is a compact and fast test reporter for the browser.

## Setup Instructions

Add Mocha Bar to the `devDependencies` of your Node.js project: in the console, switch to your
project folder and enter the following command.

```console
npm install --save-dev mocha-bar
```

Then edit the HTML file that runs the tests, inserting the following lines into the `<head>`
element.

```html
<link rel='stylesheet' href='../node_modules/mocha-bar/mocha-bar.css'>
<script src='../node_modules/mocha-bar/index.js'></script>
```

Finally, edit your JavaScript and tell Mocha to use the reporter:

```js
mocha.setup({ ui: 'bdd', reporter: MochaBar });
```
