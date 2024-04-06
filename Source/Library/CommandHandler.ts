/// <reference path="CommonUtil.ts" />
/// <reference path="ParameterList.ts" />

type CommandCallback = (parameters: ParameterList) => void;

type LineCallback = (line: string) => void;

type EndCallback = () => void;

type CommandMap = {[key: string]: CommandCallback};

class CommandHandler {
	public commands: CommandMap;
	public onPositive: LineCallback;
	public onNegative: LineCallback;
	public onEnd: EndCallback;

	public handleBlock(block: string): void {
		for (const line of block.split("\n")) {
			this.handleLine(line.trim());
		}
		this.handleEnd();
	}

	public handleLine(line: string): void {
		if (line.startsWith("/")) {
			if (this.commands) {
				this.handleCommand(line.substring(1).trim());
			} else {
				console.log(`Warning at line: ${line}`);
				console.log(`No commands registered.`);
			}
		} else if (line.startsWith("-")) {
			this.handleNegative(line.substring(1).trim());
		} else if (line) {
			this.handlePositive(line);
		}
	}

	private handleCommand(line: string): void {
		const parts = line.split(/[:\s]+/);
		const name = parts[0];
		if (name in this.commands) {
			const parameters = new ParameterList(parts.slice(1));
			try {
				this.commands[name](parameters);
			} catch (message) {
				if (message == "ABORT") {
					throw "ABORT";
				}
				console.log(`Error at line: ${line}`);
				console.log(`Error message: ${message}`);
			}
		} else {
			console.log(`Error at line: ${line}`);
			console.log(`No such command: ${name}`);
		}
	}

	private handlePositive(line: string): void {
		if (this.onPositive) {
			this.onPositive(line);
		}
	}

	private handleNegative(line: string): void {
		if (this.onNegative) {
			this.onNegative(line);
		}
	}

	public handleEnd(): void {
		if (this.onEnd) {
			this.onEnd();
		}
	}
}