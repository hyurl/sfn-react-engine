# Sfn-React-Engine

**React template engine for [SFN](https://github.com/hyurl/sfn) framework.**

This engine only performs rendering function on server-side, for more 
information about **React**, please visit 
[https://reactjs.org](https://reactjs.org).

## Install

```sh
npm i sfn-react-engine
```

## Example

```typescript
// src/controllers/hello.ts
import { HttpController, APP_PATH, route } from "sfn";
import { ReactEngine } from "sfn-react-engine";

var engine = new ReactEngine();

export default class extends HttpController {
    engine: ReactEngine = engine;
    viewPath = APP_PATH + "/view";
    viewExtname = ".tsx";

    @route.get("/hello")
    index() {
        // Even though the `viewExtension` is set to `.tsx`, when your run the 
        // program, the engine will automatically finds the correct extname.
        return this.view("Hello", { name: "World!" });
    }
}
```

```tsx
// src/views/Hello.tsx
import * as React from "react";

export default class extends React.Component<{ name: string }> {
    render() {
        // Note that `this.props` actually contains two properties `name` and 
        // `i18n` which is auto-assigned by HttpController.view() method.
        return (
            <h1>Hello, {this.props.name}!</h1>
        )
    }
}
```

## Compile

React code cannot be run directly, it must be compiled first. Luckily we're 
coding in TypeScript, which has internal support for React (tsx), just enable it
in `tsconfig.json`, like this:

```json
{
    "compilerOptions": {
        // ...
        "jsx": "react"
    },
    "include": [
        //...
        "src/views/*.tsx"
    ]
}
```

And when you compile the project, the React components will be auto-compiled and 
stored in `${APP_PATH}/views`, which can be used from inside an HttpController.