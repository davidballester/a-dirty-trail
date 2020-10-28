import SceneBuilder from '../narrationsScripting/SceneBuilder';
import SceneTemplate from '../narrationsScripting/SceneTemplate';
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
        this.currentScene = scene;
    }

    loadNextScene(nextScene: Scene): void {
        this.currentScene = nextScene;
    }

    initialize(sceneTemplate: SceneTemplate): Scene {
        const sceneBuilder = new SceneBuilder({
            sceneTemplate,
            narration: this,
        });
        const scene = sceneBuilder.build();
        this.loadNextScene(scene);
        return scene;
    }
}

export default Narration;
