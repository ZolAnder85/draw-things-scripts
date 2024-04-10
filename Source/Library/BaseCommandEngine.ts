/// <reference path="CommonUtil.ts" />
/// <reference path="ParameterList.ts" />

type CommandHandler = (parameters: ParameterList) => void;

type CommandMap = {[key: string]: CommandHandler};

abstract class BaseCommandEngine {
	protected commands: CommandMap;

	public handleBlock(block: string): void {
		console.log("Handling Block:");
		console.log(block);
		console.log("\n");
		for (const line of block.split("\n")) {
			this.handleLine(line.trim());
		}
		this.handleEnd();
		console.log("\n");
	}

	public handleLine(line: string): void {
		if (line.startsWith("/")) {
			try {
				this.handleCommand(line.substring(1).trim());
			} catch (message) {
				if (message == "ABORT") {
					throw "ABORT";
				}
				console.log(`Error at line: ${line}`);
				console.log(`Error message: ${message}`);
			}
		} else if (line.startsWith("-")) {
			this.handleNegative(line.substring(1).trim());
		} else if (line) {
			this.handlePositive(line);
		}
	}

	protected handleCommand(line: string): void {
		const parts = line.split(/[:\s]+/);
		const name = parts[0];
		if (name in this.commands) {
			const parameters = new ParameterList(parts.slice(1));
			this.commands[name](parameters);
			parameters.checkEmpty(name);
		} else {
			throw "No such command.";
		}
	}

	protected abstract handlePositive(line: string): void

	protected abstract handleNegative(line: string): void

	protected abstract handleEnd(): void
}