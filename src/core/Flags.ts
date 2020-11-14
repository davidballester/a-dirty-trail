class Flags {
    private flagMap: FlagMap;

    constructor(flagMap: FlagMap = {}) {
        this.flagMap = flagMap;
    }

    getFlag(name: string): number {
        return this.flagMap[name] || 0;
    }

    hasFlag(name: string): boolean {
        return this.getFlag(name) > 0;
    }

    addFlag(name: string, quantity = 1): void {
        this.modifyFlag(name, quantity);
    }

    modifyFlag(name: string, quantity: number): number {
        if (!this.flagMap[name]) {
            this.flagMap[name] = 0;
        }
        this.flagMap[name] += quantity;
        return this.flagMap[name];
    }

    removeFlag(name: string): void {
        const symbol = this.getFlag(name);
        this.modifyFlag(name, -symbol);
    }

    getFlagMap(): FlagMap {
        return this.flagMap;
    }
}

export default Flags;

export type FlagMap = { [name: string]: number };
