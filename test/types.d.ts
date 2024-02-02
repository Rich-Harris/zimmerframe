export interface Root {
	type: 'Root';
	children: TestNode[];
	metadata?: any;
}

export interface A {
	type: 'A';
	metadata?: any;
}

export interface B {
	type: 'B';
}

export interface C {
	type: 'C';
}

export interface TransformedRoot {
	type: 'TransformedRoot';
	elements: TestNode[];
}

export interface TransformedA {
	type: 'TransformedA';
}

export interface TransformedB {
	type: 'TransformedB';
}

export interface TransformedC {
	type: 'TransformedC';
}

export type TestNode =
	| Root
	| A
	| B
	| C
	| TransformedRoot
	| TransformedA
	| TransformedB
	| TransformedC;
