import Scene from '../../core/Scene';

abstract class ActBuilder {
    abstract build(): Promise<Scene>;

    abstract getNextScene(scene: Scene): Promise<Scene | undefined>;
}

export default ActBuilder;
