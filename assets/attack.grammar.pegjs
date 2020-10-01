rule
    = subjects:subjects isA target:subject { return { type: 'isA', subjects, target } }
    / subjects:subjects require target:skill { return { type: 'skill', subjects, target } }
    / subjects:subjects deals damage:damage { return { type: 'damage', subjects, damage } }
    / subjects:subjects carries ammunition:ammunition { return { type: 'ammunition', subjects, ammunition } }

skill
    = someAdjective:someAdjective? someNouns:someNoun+ { return `${someAdjective || someNouns[0]}Combat` }

damage
    = preposition damage1:cardinalNumber conjunction damage2:cardinalNumber "NN/damage NNS/point"
        { return { min: Math.min(damage1, damage2), max: Math.max(damage1, damage2) } }
    / damage1:cardinalNumber conjunction damage2:cardinalNumber "NN/damage NNS/point"
        { return { min: Math.min(damage1, damage2), max: Math.max(damage1, damage2) } }
    / damage:cardinalNumber "NN/damage NNS/point"
        { return { min: damage, max: damage } }

ammunition = max:cardinalNumber type:someNoun { return { max, type } }

require = modal? someVerbTag separator "require" __
deals = someVerbTag separator "deal" __
carries = modal? someVerbTag separator "carry" __
