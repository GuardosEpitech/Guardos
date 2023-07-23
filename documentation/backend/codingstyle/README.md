# Node.js (Express) Coding Guidelines

## Formatting

- 2 spaces for indentation
- Use 2 spaces for indenting your code and swear an oath to never mix tabs and spaces
- Use UNIX-style newlines (\n), and a newline character as the last character of a file. Windows-style newlines (\r\n) are forbidden inside any repository.
- No trailing white spaces
- Use semicolons
- 80 chars per line
- Use single quotes

```javascript
var foo = 'bar'; // RIGHT
var foo = "bar"; // WRONG
```

- Opening braces go on the same line

```javascript
if (true) {
  console.log('winning');
} // RIGHT

if (true) {
  console.log('winning');
} else if (false) {
  console.log('this is good');
} else {
  console.log('finally');
} // RIGHT
```

- Declare one var per statement

## Naming Conventions

- Use lowerCamelCase for variables, properties, and function names
- Use UpperCamelCase for classes
- Use UPPERCASE for constants

## Variables

### Object/Array Creation

- Use trailing commas and put short declarations on a single line.

```javascript
var a = ['hello', 'world'];
var b = {
  good: 'code',
  'is generally': 'pretty',
};
```

## Conditionals

- Use the === operator
- Use descriptive conditions

```javascript
var isValidPassword = password.length >= 4 && /^(?=.*\d).{4,}$/.test(password);
if (isValidPassword) {
  console.log('winning');
}
```

## Functions

- Write small functions
- Return early from functions
- To avoid deep nesting of if-statements, always return a function’s value as early as possible.

```javascript
function isPercentage(val) {
  if (val < 0) {
    return false;
  }
  if (val > 100) {
    return false;
  }
  return true;
}
```

- Method chaining: One method per line should be used if you want to chain methods.

```javascript
User
  .findOne({ name: 'foo' })
  .populate('bar')
  .exec(function(err, user) {
    return true;
  });
```

## Comments

- Use slashes for both single line and multi-line comments. Try to write comments that explain higher-level mechanisms or clarify difficult segments of your code. Don’t use comments to restate trivial things.

```javascript
// 'ID_SOMETHING=VALUE' -> ['ID_SOMETHING=VALUE', 
// 'SOMETHING', 'VALUE']
var matches = item.match(/ID_([^\n]+)=([^\n]+)/);

// This function has a nasty side effect where a failure to 
// increment a redis counter used for statistics will 
// cause an exception. This needs to be fixed in a later iteration.
function loadUser(id, cb) {
  // ...
}

var isSessionValid = (session.expires < Date.now());
if (isSessionValid) {
  // ...
}
```

## Miscellaneous

- 'Requires' at the top: Always put requires at the top of the file to clearly illustrate a file’s dependencies. Besides giving an overview for others at a quick glance of dependencies and possible memory impact, it allows one to determine if they need a package.json file should they choose to use the file elsewhere. Write your require statements in alphabetical order for easier reference.

**Source:** [Node.js Coding Style Guidelines](https://medium.com/swlh/node-js-coding-style-guidelines-74a20d00c40b)