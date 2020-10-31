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
}

export default Narration;
