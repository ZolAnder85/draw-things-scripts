/// <reference path="CommonUtil.ts" />

type BlockCallback = (block: string) => void;

class Preprocessor {
	private variables: TODO;
	private wildcards: TODO;
	private random: XSRandom;

	public constructor(seed: number) {
		this.random = new XSRandom(seed);
	}

	register(wildcards: TODO): void {
	}

	public handleBlock(block: string, callback: BlockCallback): void {
		const list = [ block ];
		while (list.length) {
			const current = list.pop();
			const match = current.match(/{[^{}]+}/);
			if (match) {
				const original = match[0];
				const result = this.handleWildcard(original);
				for (const replacement of result.reverse()) {
					list.push(current.replace(original, replacement));
				}
			} else {
				callback(current);
			}
		}
	}

	private handleWildcard(original: string): string[] {
		let parts;
		if (parts = original.match(/{@(\w+)=(.+)}/)) {
		}
	}
}