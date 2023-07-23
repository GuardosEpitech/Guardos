# Coding Guidelines for React ESLint

## 1. Linting & Formatter

- Linting: ESLint
  - eslint-plugin-react-hooks → assuring general rules

- Formatter: Prettier
  - simplifies following guidelines
  - needs config file with adjustments to our guidelines

## 2. Naming Conventions

- PascalCase
- camelCase
- React Components & their file names
- JavaScript data types
- Interfaces
- Folders
- Types
- Files of non-components

```javascript
// BannersEditForm.ts
const BannersEditForm = () => {}

interface TodoItem {
    id: number;
    name: string
}

type TodoList = TodoItem[];

// src/utils/form.ts
const getLastDigit = () => { ... }

const userTypes = [ ... ]
```

## 3. Components

- Only use function components to increase performance and readability.

### 3.1. Structure

1. Imports: alphabetically sorted, separated by newline
   - React Import
   - Library Import
   - Absolute Path-Imports
   - Relative Path-Imports
   - Types
   - Styles
   - Variables
   - Components
   - Definition
   - Functions
   - useEffects (Lifecycle Methods)
   - Additional destructures
   - Return
   - Export

### 3.2 Separate Component Types

- Smart / Container Components
  - Has data + logic
  - Simple UI elements
  - Calls Redux, Hooks, APIs, Libs, ...
  - Reusable → independent from context
  - Manages state and re-renders
  - Almost never state (only for UI manipulation), no Hooks, just the render function
  - Almost no styling
  - Gets props

```javascript
function SmartComponent() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });
    
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

const DumbComponent = (props) => {
    return (
        <div>
            <ul>
                <li> Information - {props.title} </li>
            </ul>
        </div>
    )
};
```

### 3.3 Hooks

- Only call hooks from top-level
- Not from loops, conditions, or nested functions
- Otherwise: unexpected behavior
- Only call hooks from React function components
- General rule: limit custom hooks, BUT
  - As a wrapper for several hooks
  - Separation in sub-custom hooks when too complex
  - Naming: always start name with "use", example: useFriendStatus

### 3.4 Functions

- Never start function name with '_'
  - Would imply private function, which doesn't exist in JS
- Outsource functions from return objects if longer than one line

```javascript
const handleButtonClick = () => {
    setState(!state);
    resetForm();
    reloadData();
}

<button onClick={handleButtonClick} />
```

- Implicit return: short form for small functions

```javascript
const add = (a, b) => a + b;
```

### 3.5 TSX

- Use TSX for React elements (return objects)
- Use Ternary-Operator or AND-Operator (without else case) for conditional rendering
- Use fragments (from React) instead of empty div-elements

```javascript
const UserButton = ({ text1, text2 }) => {
    const { role } = user;
    return (
        // fragment
        <>
            { role === ADMIN ? <AdminUser /> : <NormalUser /> }
            { role == ADMIN && <button>{text1}</button> }
            <button>{text2}</button>
        </>
    );
};
```

- Highlight different elements by newline (here between header and div)

```javascript
return (
    <>
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
        </header>

        <div>
            <ul>
                <li> Information - {props.title} </li>
            </ul>
        </div>
    </>
)
```

### 3.6 Props and State

- Destructuring

```javascript
const { name, age, profession } = user;
```

- Define props as type to assure data type

```typescript
type ComponentProps = {
    someProperty: string;
};
```

- Use short form for props: if boolean true, no explicit definition is needed

```javascript
<Form hasPadding withError />
```

- Group state variables if in one sense unit

```javascript
const [position, setPosition] = useState({ x: 0, y: 0 });
```

### 3.7 Further Component Guidelines

- Always just one component per file
- Keep components small → rather sub-components
- Memo for child-components → reduce rendering & increase performance

```javascript
import { memo } from "react";

const Todos = ({ todos }) => {
    return (
        <>
            <h2>My Todos</h2>
            {todos.map((todo, index) => {
                return <p key={index}>{todo}</p>;
            })}
        </>
    );
};

export default memo(Todos);
```

- Compound Component Pattern
  - Groups components & creates parent-child relations

```jsx
<Accordion>
    <Accordion.Title>Frequently Asked Questions</Accordion.Title>
    <Accordion.Frame>
        </Accordion.Item>
    </Accordion.Frame>
</Accordion>
```

## 4. Naming

- All units get English names
- For consistent naming, DON'T use default export
  - Prevents different aliases for the same components
- Component and its file are called the same → Component.tsx
- SCSS-Files named after the component → Component.scss
- Tests named after the component → Component.test.js

## 5. Styling

- TSX in parentheses
- Return (</>);
- Double quotes in TSX
- Single quotes in TS
- Self-close components without child
- Props over several lines → close tag on the next line
- String props without curly brackets
- Use arrow functions

```javascript
hello = () => {
    return "Hello World!";
}
```

- Template literals instead of string concatenation

```javascript
const userDetails = `${user.firstName} ${user.lastName}`;
```

- We use 2 spaces as tabs

## 6. Folder Structure

- Divided by file purpose / type:

```
└── src/
    ├── assets/
    ├── components/
    │   ├── item/
    │   │   ├── item.tsx
    │   │   └── item.test.tsx
    │   └── table/
    ├── pages/
    ├── services/
    ├── store/
    ├── utils/
    ├── index.tsx
    └── App.tsx
```

## 7. Further Guidelines

- To guarantee the coding guidelines, they

 will be explicitly checked during the code review (that is necessary for every code change)
- Tests are necessary for every component
- Declarative instead of imperative coding (arr.reduce instead of for loop)

```javascript
const sum = arr.reduce((acc, value) => acc + value, 0);
```

- For lists: prefer using own id instead of index

```jsx
{list.map((item) => {
    return <li key={item.id}>{item.value}</li>;
})}
```

- Styles only for dynamic properties, else: SCSS files
- Use object literals if sensible (Object Literal instead of a switch statement)

```javascript
const components = {
    ADMIN: AdminUser,
    EMPLOYEE: EmployeeUser,
    USER: NormalUser
};

const Component = components[role];
return <Componenent />;
```

- Always set a value for the `alt` prop for img tags.

**Resources:**

- [React Code Conventions and Best Practices](https://levelup.gitconnected.com/react-code-conventions-and-best-practices-433e23ed69aa)
