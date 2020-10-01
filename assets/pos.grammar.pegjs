// Tags
conjunctionTag = "CC"
cardinalNumberTag = "CD"
determinerTag = "DT"
thereTag = "EX"
foreignWordTag = "FW"
prepositionTag = "IN"
adjectiveTag = "JJ"
adjectiveComparativeTag = "JJR"
adjectiveSuperlativeTag = "JJS"
listItemMarkerTag = "LS"
modalTag = "MD"
nounTag = "NN"
nounProperTag = "NNP"
nounProperPluralTag = "NNPS"
nounPluralTag = "NNS"
possesiveEndingTag = "POS"
predterminerTag = "PDT"
possessivePronounTag = "PRP"
personalPronounTag = "PRP"
adverbTag = "RB"
adverbComparativeTag = "RBR"
adverbSuperlativeTag = "RBS"
particleTag = "RP"
symbolTag = "SYM"
toTag = "TO"
interjectionTag = "UH"
verbTag = "VB"
verbPastTag = "VBD"
verbGerundTag = "VBG"
verbPastParticipleTag = "VBN"
verbPresentTag = "VBP"
verbPresentThirdPersonTag = "VBZ"
whDeterminerTag = "WDT"
whPronounTag = "WP"
whPossesiveTag = "WP"
whAdverbTag = "WRB"
commaTag =  ","
semiFinalPunctuationTag =  "."

conjunction = conjunctionTag separator word:word __ { return word; }
cardinalNumber = cardinalNumberTag separator number:number __ { return number; }
determiner = determinerTag separator word:word __ { return word; }
there = thereTag separator word:word __ { return word; }
foreignWord = foreignWordTag separator word:word __ { return word; }
preposition = prepositionTag separator word:word __ { return word; }
adjective = adjectiveTag separator word:word __ { return word; }
adjectiveComparative = adjectiveComparativeTag separator word:word __ { return word; }
adjectiveSuperlative = adjectiveSuperlativeTag separator word:word __ { return word; }
listItemMarker = listItemMarkerTag separator word:word __ { return word; }
modal = modalTag separator word:word __ { return word; }
noun = nounTag separator word:word __ { return word; }
nounProper = nounProperTag separator word:word __ { return word; }
nounProperPlural = nounProperPluralTag separator word:word __ { return word; }
nounPlural = nounPluralTag separator word:word __ { return word; }
possesiveEnding = possesiveEndingTag separator word:word __ { return word; }
predterminer = predterminerTag separator word:word __ { return word; }
possessivePronoun = possessivePronounTag separator word:word __ { return word; }
personalPronoun = personalPronounTag separator word:word __ { return word; }
adverb = adverbTag separator word:word __ { return word; }
adverbComparative = adverbComparativeTag separator word:word __ { return word; }
adverbSuperlative = adverbSuperlativeTag separator word:word __ { return word; }
particle = particleTag separator word:word __ { return word; }
symbol = symbolTag separator word:word __ { return word; }
to = toTag separator word:word __ { return word; }
interjection = interjectionTag separator word:word __ { return word; }
verb = verbTag separator word:word __ { return word; }
verbPast = verbPastTag separator word:word __ { return word; }
verbGerund = verbGerundTag separator word:word __ { return word; }
verbPastParticiple = verbPastParticipleTag separator word:word __ { return word; }
verbPresent = verbPresentTag separator word:word __ { return word; }
verbPresentThirdPerson = verbPresentThirdPersonTag separator word:word __ { return word; }
whDeterminer = whDeterminerTag separator word:word __ { return word; }
whPronoun = whPronounTag separator word:word __ { return word; }
whPossesive = whPossesiveTag separator word:word __ { return word; }
whAdverb = whAdverbTag separator word:word __ { return word; }
comma = commaTag separator word:word __ { return word; }
semiFinalPunctuation = semiFinalPunctuationTag separator word:word __ { return word; }

// Base
separator = "/"
word = characters:$character+ { return characters.toLowerCase(); }
character
    = [a-z]
    / [A-Z]
    / ","
number = quantity:$[0-9]+ {return parseInt(quantity); }

// Skipped
__ = (whitespace)*
whitespace "whitespace"
    = "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"
    / Zs
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]
