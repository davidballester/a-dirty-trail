/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Scene from '../core/Scene';
import { InventoryTemplate } from './InventoryTemplate';
import InventoryBuilder from './InventoryBuilder';
import { ModifyFlag, SideEffectTemplate } from './SideEffectTemplate';

class SideEffectBuilder {
    private scene: Scene;
    private sideEffectTemplate: SideEffectTemplate;

    constructor({
        scene,
        sideEffectTemplate,
    }: {
        scene: Scene;
        sideEffectTemplate: SideEffectTemplate;
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
        if (this.sideEffectTemplate.modifyHealth) {
            this.modifyHealth(this.sideEffectTemplate.modifyHealth);
        }
        this.flagsSideEffects();
    }

    private rename(newName: string): void {
        const player = this.scene.getPlayer();
        player.changeName(newName);
    }

    private loot(sceneTemplateInventory: InventoryTemplate): void {
        const inventoryBuilder = new InventoryBuilder({
            inventoryTemplate: sceneTemplateInventory,
        });
        const lootInventory = inventoryBuilder.build();
        const player = this.scene.getPlayer();
        player.getInventory().loot(lootInventory);
    }

    private modifyHealth(modifyHealth: number): void {
        const player = this.scene.getPlayer();
        player.getHealth().modify(modifyHealth);
    }

    private flagsSideEffects(): void {
        const flags = this.scene.getPlayer().getFlags();
        if (this.sideEffectTemplate.addFlag) {
            flags.addFlag(this.sideEffectTemplate.addFlag);
        }
        if (this.sideEffectTemplate.addFlags) {
            this.sideEffectTemplate.addFlags.forEach((flag) =>
                flags.addFlag(flag)
            );
        }
        if (this.sideEffectTemplate.removeFlag) {
            flags.removeFlag(this.sideEffectTemplate.removeFlag);
        }
        if (this.sideEffectTemplate.removeFlags) {
            this.sideEffectTemplate.removeFlags.forEach((flag) =>
                flags.removeFlag(flag)
            );
        }
        if (this.sideEffectTemplate.modifyFlag) {
            this.modifyFlags([this.sideEffectTemplate.modifyFlag]);
        }
        if (this.sideEffectTemplate.modifyFlags) {
            this.modifyFlags(this.sideEffectTemplate.modifyFlags);
        }
    }

    private modifyFlags(modifyFlags: ModifyFlag[]): void {
        const flags = this.scene.getPlayer().getFlags();
        modifyFlags.forEach(({ name, value }) => {
            flags.modifyFlag(name, value);
        });
    }
}

export default SideEffectBuilder;
