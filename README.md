# Building a Challenge Framework
Created for Khan Academy.

## The Problem

> "We want to analyze student-generated JavaScript code (for our CS platform: https://www.khanacademy.org/cs) and determine if certain aspects of their code is written as expected."

The solution must include three kinds of testing methods:
* **Whitelist**: "The program must contain a for loop and an if statement."
* **Blacklist**: "The program must not use a while loop."
* **Structural analysis**: "The program must use a for loop, inside of which should be an if statement."

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

### So What?

Now for the fun part: after we've turned the student's code into a structural expression, we simply use [regex](https://en.wikipedia.org/wiki/Regular_expression) to test if the student's code matches our desired structure.

For instance, if we want to make sure the student used an if statement enclosed in a for loop, we check that the structrual expression matches `(for .*(if .*).*)`. (We use `.*` a lot because the student could have other structural elements besides the for loop and if statement.)

[Note: With standard regex we would have to escape parentheses (e.g. `\\(for\\)`). My challenge framework code is written so that parentheses are automatically escaped.]

### Proof of Concept

That's all there is to it! To see all of this in action, check out my live demo [here](https://guoguo12.github.io/challenge-framework/). Some things you can try:
* Click "Submit for Testing" to run all tests.
* Modify the code to make all three tests pass.
* Add your own tests using the tool in the bottom-right corner.
