export interface BaseNode {
	type: string;
}

export type NodeOf<T extends string, X> = X extends { type: T } ? X : never;
