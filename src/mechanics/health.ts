export class Health {
    currentHitpoints: number;
    maxHitpoints: number;

    constructor(currentHitpoints: number, maxHitpoints: number) {
        this.maxHitpoints = maxHitpoints;
        this.currentHitpoints = currentHitpoints;
    }

    isAlive() {
        return this.currentHitpoints > 0;
    }

    modifyHitpoints(delta: number) {
        this.currentHitpoints += delta;
        this.currentHitpoints = Math.min(
            this.currentHitpoints,
            this.maxHitpoints
        );
        this.currentHitpoints = Math.max(this.currentHitpoints, 0);
    }
}
