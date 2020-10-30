# A dirty trail

A minimalistic narrative-first game with simple mechanics.

## How to use

First, access the narrations catalogue and choose a narration:

```ts
import { NarrationsCatalogue, Narration } from 'a-dirty-trail'
...
const narrationTitles: string[] = narrationsCatalogue.getNarrationTitles()
const narration: Narration = narrationsCatalogue.getNarration('Tutorial')
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
import { NarrationEngine, CombatEngine } from 'a-dirty-trail'
...
if (scene.isCombat()) {
    const combatEngine = new CombatEngine({ scene })
    ...
} else {
    const narrationEngine = new NarrationEngine({ scene })
    ...
}
```

Narrative scenes are quite simple. The player can choose to execute a number of actions on them. The moment they execute an `AdvanceAction`, they will move to a new scene.

```ts
const actionsMap = narrationEngine.getPlayerActions();
const advanceActions = actionsMap.getAdvanceActions();
```

Combat scenes are turn-based. The player always acts first and then a single oponent. The combat goes on until there are no more enemies left on the scene.

```ts
if (combatEngine.getActorCurrentTurn().equals(player)) {
    const actionsMap = combatEngine.getPlayerActions();
    const attackActions = actionsMap.getAttackActions();
    const action = attackActions[0];
    combatEngine.executePlayerAction(action);
} else {
    await combatEngine.executeNextOponentAction();
}
```

The game ends when the player is dead or when the narration engine says so.

```ts
const gameOver = !player.isAlive() || narrationEngine.isNarrationFinished();
```

Simple as that!

## Build

There is a single build step.

```
npm run build
```

Part of this step is turning the Markdown files of the scenes that compose narrations into TS files. These are stored along the original MD files. **Do not modify the TS files yourself.** They will be overwritten. Modify the Markdown files itself.

## Template language

The creation of the narratives is based on templates written in Markdown files. These contain not only the narration itself, but the actions available on each scene, enemies even the definition of the player.
