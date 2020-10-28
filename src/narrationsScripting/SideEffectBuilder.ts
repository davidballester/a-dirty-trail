import Scene from '../core/Scene';
import { RenamePlayerRule } from './Rules';
import scriptingProcessor from './ScriptingProcessor';

class SideEffectBuilder {
    private scene: Scene;
    private sideEffectScript: string;

    constructor({
        scene,
        sideEffectScript,
    }: {
        scene: Scene;
        sideEffectScript: string;
    }) {
        this.scene = scene;
        this.sideEffectScript = sideEffectScript;
    }

    build(): void {
        const rule = scriptingProcessor.parse(this.sideEffectScript);
        switch (rule.type) {
            case 'renamePlayer': {
                return this.sideEffectRenamePlayer(rule as RenamePlayerRule);
            }
        }
    }

    private sideEffectRenamePlayer(rule: RenamePlayerRule): void {
        const player = this.scene.getPlayer();
        player.changeName(rule.newName);
    }
}

export default SideEffectBuilder;
