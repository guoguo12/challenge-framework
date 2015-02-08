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

The corresponding structexp is `(for (if))`. It tells us that the student's code contains an if statement inside a for statement.

