/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Scene from '../core/Scene';
import {
    SceneTemplateInventory,
    SceneTemplateSideEffect,
} from './SceneTemplate';
import InventoryBuilder from './InventoryBuilder';

class SideEffectBuilder {
    private scene: Scene;
    private sideEffectTemplate: SceneTemplateSideEffect;

    constructor({
        scene,
        sideEffectTemplate,
    }: {
        scene: Scene;
        sideEffectTemplate: SceneTemplateSideEffect;
    }) {
        this.scene = scene;
        this.sideEffectTemplate = sideEffectTemplate;
    }

    build(): void {
        if (this.sideEffectTemplate.loot) {
            this.loot(this.sideEffectTemplate.loot);
        }
        if (this.sideEffectTemplate.rename) {
            this.rename(this.sideEffectTemplate.rename);
        }
    }

    private rename(newName: string): void {
        const player = this.scene.getPlayer();
        player.changeName(newName);
    }

    private loot(sceneTemplateInventory: SceneTemplateInventory): void {
        const inventoryBuilder = new InventoryBuilder({
            inventoryTemplate: sceneTemplateInventory,
        });
        const lootInventory = inventoryBuilder.build();
        const player = this.scene.getPlayer();
        player.getInventory().loot(lootInventory);
    }
}

export default SideEffectBuilder;
