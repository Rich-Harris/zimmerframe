# zimmerframe

A tool for walking.

Specifically, it's a tool for walking an abstract syntax tree (AST), where every node is an object with a `type: string`. This includes [ESTree](https://github.com/estree/estree) nodes, such as you might generate with [Acorn](https://github.com/acornjs/acorn) or [Meriyah](https://github.com/meriyah/meriyah), but also includes things like [CSSTree](https://github.com/csstree/csstree) or an arbitrary AST of your own devising.

## Usage

```ts
import { walk } from 'zimmerframe';
import { parse } from 'acorn';
import { Node } from 'estree';

const program = parse(`
let message = 'hello';
console.log(message);

if (true) {
	let answer = 42;
	console.log(answer);
}
`);

// You can pass in arbitrary state
const state = {
	declarations: [],
	depth: 0
};

const transformed = walk(program as Node, state, {
	VariableDeclarator(node, { state }) {
		// `state` is passed into each visitor
		if (node.id.type === 'Identifier') {
			state.declarations.push({
				depth: state.depth,
				name: node.id.name
			});
		}
	},
	BlockStatement(node, { state, next, skip, stop }) {
		// calling `this.next(...)` will replace state
		// for any child nodes. you can also control
		// when child nodes are visited. otherwise,
		// child nodes will be visited afterwards,
		// unless you call `skip()` (which skips
		// children) or `stop()` (which stops
		// all subsequent traversal)
		console.log('entering BlockStatement');
		next({ ...state, depth: state.depth + 1 });
		console.log('leaving BlockStatement');
	},
	Literal(node) {
		// if you return something, it will replace
		// the current node
		if (node.value === 'hello') {
			return {
				...node,
				value: 'goodbye'
			};
		}
	},
	IfStatement(node, { transform }) {
		// normally, returning a value will halt
		// traversal into child nodes. you can
		// transform children with the current
		// visitors using `transform(node, state?)`
		if (node.test.type === 'Literal' && node.test.value === true) {
			return transform(node.consequent);
		}
	}
});
```

The `transformed` AST would look like this:

```js
let message = 'goodbye';
console.log(message);

{
	let answer = 42;
	console.log(answer);
}
```
