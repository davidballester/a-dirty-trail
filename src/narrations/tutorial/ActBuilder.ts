import Actor from '../../core/Actor';
import Scene from '../../core/Scene';

abstract class ActBuilder {
    abstract build(player: Actor): Scene;
}

export default ActBuilder;
