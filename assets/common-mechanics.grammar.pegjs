// Aggrupations
someVerbTag
    = verbPastTag
    / verbPresentTag
    / verbPresentThirdPersonTag
    / verbTag

someAdjective
    = adjectiveComparative:adjectiveComparative { return adjectiveComparative; }
    / adjectiveSuperlative:adjectiveSuperlative { return adjectiveSuperlative; }
    / adjective:adjective { return adjective; }
    
someNounTag
    = nounProperTag
    / nounProperPluralTag
    / nounPluralTag
    / nounTag

someNoun
    = nounProper:nounProper { return nounProper; }
    / nounProperPlural:nounProperPlural { return nounProperPlural; }
    / nounPlural:nounPlural { return nounPlural; }
    / noun:noun { return noun; }

isA = someVerbTag separator "be" __

// Structures
subjects
    = subject:subject 
        otherSubjects:(comma otherSubject:subject { return otherSubject })* 
        lastSubject:(conjunction lastSubject:subject { return lastSubject })? 
        { return [ subject, ...(otherSubjects || []), lastSubject].filter(Boolean)}

subject
    = determiner subject:subject { return subject }
    / someNoun:someNoun { return someNoun }