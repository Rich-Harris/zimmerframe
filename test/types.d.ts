export interface Node<Type extends string> {
	type: Type;
	[key: string]: any;
}
