import Scene from './Scene';

abstract class Narration {
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

    setCurrentScene(scene: Scene) {
        this.currentScene = scene;
    }

    abstract initialize(): void;

    abstract loadNextScene(scene: Scene): void;
}

export default Narration;
