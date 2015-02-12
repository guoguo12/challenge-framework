# Building a Challenge Framework
Created for Khan Academy.

## Table of Contents

- [Building a Challenge Framework](#)
	- [The Problem](#prob)
	- [The Solution](#sol)
		- [So What?](#so)
		- [Proof of Concept](#proof)
	- [Implementation Details](#imple)
		- [Compatibility](#compat)
		- [Auto-running Tests](#auto)
	- [API Documentation](#docs)
	- [Still Not Convinced?](#still)

<a name="prob"/>
## The Problem

> "We want to analyze student-generated JavaScript code (for our CS platform: https://www.khanacademy.org/cs) and determine if certain aspects of their code is written as expected."

The solution must include three kinds of testing methods:
* **Whitelist**: "The program must contain a for loop and an if statement."
* **Blacklist**: "The program must not use a while loop."
* **Structural analysis**: "The program must use a for loop, inside of which should be an if statement."

<a name="sol"/>
## The Solution

Instead of building a JavaScript API for testing, we're going to create a whole new [domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language) (DSL) for respresenting how pieces of JS code are structured. Our challenge framework will parse the student's code (using [Esprima](http://esprima.org)) and convert it into a **structural expression** (or *structexp*).

Take this piece of code, for instance:
```JavaScript
// Prints every other uppercase letter to console
for (var n = 65; n < 91; n++) {
  if (n % 2) {
    console.log(String.fromCharCode(n));
  }
}
```

The corresponding structexp is `(for (if))`. It tells us that the student's code contains an if statement inside a for statement. Below is another piece of code. Can you figure out what the corresponding structexp is?
```JavaScript
function append(p, n) {
  while (true) {
    if (p.next !== null) {
      break;
    }
    p = p.next;
  }
  p.next = n;
}
```
You were probably able to figure it out based on the first example &mdash; it's `(function (while (if)))`. Our DSL can also represent variable declarations and if-else statements. For example,
```JavaScript
var health = getShipHealth();
if (health < 0) {
  var message = "One last explosion marks your fate as your ship is torn apart.";
} else {
  var message = "Your ship has survived.";
}
```
produces the structexp `var (if var) (else var)`.

<a name="so"/>
### So What?

Now for the fun part: after we've turned the student's code into a structural expression, we simply use **regular expressions** (regex) to test if the student's code matches our desired structure.

For instance, if we want to make sure the student used an if statement enclosed in a for loop, we check that the structrual expression matches `(for .*(if .*).*)`. (We use `.*` a lot because the student could have other structural elements besides the for loop and if statement.)

[Note: With standard regex we would have to escape parentheses (e.g. `\\(for\\)`). My challenge framework code is written so that parentheses are automatically escaped.]

<a name="proof"/>
### Proof of Concept

That's all there is to it! To see all of this in action, check out my live demo [here](https://guoguo12.github.io/challenge-framework/). Some things you can try:
* Click "Submit for Testing" to run all tests.
* Modify the code to make all three tests pass.
* Add your own tests using the tool in the bottom-right corner.

<a name="imple"/>
## Implementation Details

The online demo has two main parts:
* [js/fungus.js](https://github.com/guoguo12/challenge-framework/blob/master/js/fungus.js) &ndash; responsible for decomposing pieces of JavaScript code into structural expressions.
* [js/app.js](https://github.com/guoguo12/challenge-framework/blob/master/js/app.js) and [index.html](https://github.com/guoguo12/challenge-framework/blob/master/index.html) &ndash; logic for the live demo

**fungus.js** is also a standalone testing library that works with structexp (see below for documentation).

The main libraries used are [AngularJS](http://angularjs.org) and [Esprima](http://esprima.org). I also used [Bootstrap](http://getbootstrap.com/), [jQuery](https://jquery.com/), and [Animate.css](https://daneden.github.io/animate.css/) to quickly make my demo look visually appealing.

<a name="compat"/>
### Compatibility

I'm using newer versions of jQuery and AngularJS, so the live demo doesn't work with older browsers like IE 8. That said, the core of the framework (`fungus.js`) *does* work in IE 8, so implementing a real version of this framework would mostly require changes to the UI logic.

<a name="auto"/>
### Auto-running Tests

It was requested that tests run automatically when the code is changed. I have decided not to implement this feature because I think it would be too annoying for users. When I was playing around with Khan Academy's ProcessingJS platform, it bothered me that my code kept running when I wasn't done typing. (I made [this](https://www.khanacademy.org/computer-programming/new-program/5450142823219200), by the way.)

That said, implementing this feature is straightforward &mdash; we just attach an appropriate [ngChange directive](https://docs.angularjs.org/api/ng/directive/ngChange) to the `textarea` element.

<a name="docs"/>
## API Documentation

To use the testing library on a page, simply download `esprima.js` and `fungus.js` and include them in your HTML file:
```HTML
<script src="esprima.js"></script>
<script src="fungus.js"></script>
```
Our API only has one method, `fungus.test(type, structexp, code)`. Its parameters are:

* *type* &ndash; indicates what sort of test to apply (either "must-match", "must-contain", "must-not-match", or "must-not-contain")
* *structexp* &ndash; structural expression to test (as outlined above)
* *code* &ndash; the student's code

`fungus.test()` returns a simple boolean value indicating whether or not the code passed the specified test.

<a name="still"/>
## Still Not Convinced?

Here are some more reasons the DSL outlined above is better than using just an API:

1. **Easy to read and modify**: Tests are strings, rather than pieces of code.
2. **Easy to learn**: Structural expressions look like Lisp S-expressions, and structexp symbols have the same names as their corresponding JavaScript keywords (`if`, `else`, `var`, etc.).
3. **Extensible**: More symbols can easily be introduced to cover other JS features or keywords (like `break`, `continue`, and so on).
4. **Programmable**: What if we wanted to test for 100 nested for loops? We could manually type out `(for (for (for ... )))`. Or we could imagine the existence of a programmable templating device, or **macro**, that could do this for us. This hasn't been implemented yet, but it might look something like this: `[nested 100 for]`.
