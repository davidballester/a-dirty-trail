rule
    = subjects:subjects isA target:subject { return { type: 'isA', subjects, targets: [ target ] } }
    / preposition determiner subject:subject there modal isA targets:subjects { return { type: 'contains', subjects: [ subject ], targets }}
