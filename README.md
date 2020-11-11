# A dirty trail

A minimalistic narrative-first game with simple mechanics.

## What's here

The model, mechanics and most of the bootstrapping utilities to set up games.

_But, where are the actual narratives?_

You provide them! With simple YAML metadata in markdown files, you create your own narratives.

_Oh, so with that, I got myself a working game?_

Almost there, but not yet. You also need to write some code to fetch the scenes of your narratives as the game goes on. It's quite simple, though, don't worry.

## Set up

You'll need to extend two abstract classes: [NarrationsCatalogue](src/narrations/NarrationsCatalogue) and [SceneTemplateResolver](src/templateSystem/SceneTemplateResolver).

For the first one, `NarrationsCatalogue`, implement `fetchNarrations`. Here's an example on how to do it assuming you're fetching data from a remote API:

```ts
import { NarrationsCatalogue, Narration } from 'a-dirty-trail';

class MyNarrationsCatalogue extends NarrationsCatalogue {
    abstract fetchNarrations(): Promise<Narration[]> {
        const titles = await fetch('https://mysite.tech/narrations');
        return titles.map((title) => new Narration({ title }));
    }
}
```

Now you also need to extend `SceneTemplateResolver` and implement `fetchMarkdownSceneTemplate`. Another example right below:

```ts
import { SceneTemplateResolver } from 'a-dirty-trail';

class MySceneTemplateResolver extends SceneTemplateResolver {
    protected abstract fetchMarkdownSceneTemplate(
        narrationTitle: string,
        sceneId?: string
    ): Promise<string> {
        return fetch(
            `https://mysite.tech/narrations/${narrationTitle}/${sceneId}.md`
        );
    }
}
```

You're done with the development bits! Now, to the usage.

## How to use

First, instantiate your `SceneTemplateResolver` and `NarrationsCatalogue`:

```ts
const sceneTemplateResolver = new MySceneTemplateResolver();
const narrationsCatalogue = new MyNarrationsCatalogue({
    sceneTemplateResolver,
});
```

Then, access the list of narrations and pick one

```ts
import { Narration } from 'a-dirty-trail'

const narrations: Narration[] = await narrationsCatalogue.fetchNarrations()
const myNarration = narrations[0
```

A narration is a set of scenes. Each narration holds a reference to the current scene you can access.

```ts
import { Scene, Actor } from 'a-dirty-trail'
...
const scene = narration.getCurrentScene()
const player = scene.getPlayer()
```

There are two kinds of scenes: action scenes and narrative scenes. Based on its kind, instantiate an engine to operate on it.

```ts
import { NarrativeSceneEngine, CombatSceneEngine } from 'a-dirty-trail'
...
if (scene.isCombat()) {
    const combatSceneEngine = new CombatSceneEngine({ scene })
    ...
} else {
    const narrativeSceneEngine = new NarrativeSceneEngine({ scene })
    ...
}
```

Narrative scenes are quite simple. The player can choose to execute a number of actions on them. The moment they execute an `AdvanceAction`, they will move to a new scene.

```ts
const actionsMap = narrativeSceneEngine.getPlayerActions();
const advanceActions = actionsMap.getAdvanceActions();
const advanceAction = advanceActions[0];
await narrativeSceneEngine.executePlayerAction(advanceAction);
```

Combat scenes are turn-based. The player always acts first and then a single oponent. The combat goes on until there are no more enemies left on the scene.

```ts
if (!combatSceneEngine.isCombatOver()) {
    if (combatSceneEngine.isPlayerTurn()) {
        const actionsMap = combatSceneEngine.getPlayerActions();
        const attackActions = actionsMap.getAttackActions();
        const action = attackActions[0];
        await combatSceneEngine.executePlayerAction(action);
    } else {
        await combatSceneEngine.executeNextOponentAction();
    }
}
```

The game ends when the player is dead or when the narration engine says so.

```ts
const gameOver =
    !player.isAlive() || narrativeSceneEngine.isNarrationFinished();
```

Simple as that!

## Build

There is a single build step.

```
npm run build
```

## Template language

The creation of the narratives is based on templates written in Markdown files. These contain not only the narration itself, but the actions available on each scene, enemies even the definition of the player.
