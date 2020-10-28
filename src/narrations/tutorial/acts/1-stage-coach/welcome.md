---
title: The stage coach
player:
    name: The damsel
    health: 6-6
    inventory:
        trinkets:
            - name: Opened letter
              description: A worrying farewell from her uncle.
        weapons:
            'Letter opener':
                type: 'knife'
                damage: 1-1
                skill: stab
    skills:
        aim: 0.6
        stab: 0.75
actions:
    '"Alys"':
        sideEffect:
            rename: Alys
        goTo: ./alys
    '"Lady Cartwright"':
        sideEffect:
            rename: Lady Cartwright
        goTo: ./ladyCartwright
---

The stage coach rumbled softly over the packed dirt of the path.

**The damsel** looked at the dark woods at the other side of the windows. Between her hands, a letter she had read just once, yet it was already worn out.

The stage coach was for her only, except for the **drunken minister** who snored beside her.

"A dangerous road this one," he had said at the beginning of the journey, already dizzy and sipping from a flask he kept close to his heart. The damsel had nodded, but the minister was insistent.

"Nobody knows what lies ahead, so I'd rather face the unknown with someone whose name I can cry in fear, don't you think?"
