import { NarrationTemplate } from '../templateSystem/NarrationTemplate';
import NarrationTemplateBuilder from '../templateSystem/NarrationTemplateBuilder';
import Scene from './Scene';

class Narration {
    private title: string;
    private currentScene?: Scene;

    constructor({ title }: { title: string }) {
        this.title = title;
    }

    getTitle(): string {
        return this.title;
    }

    getCurrentScene(): Scene | undefined {
        return this.currentScene;
    }

    setCurrentScene(scene: Scene): void {
        const executeSideEffect = !this.currentScene;
        this.currentScene = scene;
        if (executeSideEffect) {
            this.currentScene.executeSideEffect();
        }
    }

    loadNextScene(nextScene: Scene): void {
        this.currentScene = nextScene;
        this.currentScene.executeSideEffect();
    }

    save(): NarrationTemplate | undefined {
        if (!this.currentScene || this.currentScene.isCombat()) {
            return undefined;
        }
        const narrationTemplateBuilder = new NarrationTemplateBuilder({
            narration: this,
        });
        return narrationTemplateBuilder.build();
    }
}

export default Narration;
