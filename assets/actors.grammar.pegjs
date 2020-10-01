rule
    = subjects:subjects isA target:target { return { type: 'isA', subjects, target } }
    / actorType:subject have range:healthPoints { return { type: 'healthPoints', actorType, range }}

target
    = someAdjective:someAdjective someNoun:someNoun { return { type: someNoun, status: someAdjective } }

healthPoints
    = preposition number1:cardinalNumber conjunction number2:cardinalNumber "NN/health NNS/point"
        { return { min: Math.min(number1, number2), max: Math.max(number1, number2) } }

have = modal? someVerbTag separator "have" __
