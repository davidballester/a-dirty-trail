world
    = __ rules:rule+ __  { return rules; }

// Rules
rule
    = rule:(
        words:word+ whitespace? { return words }
    )+ "."? __? { return rule.join(" "); }

// Language
word
    = characters:$character+ { return characters.toLowerCase(); }
character
    = [a-z]
    / [A-Z]
    / [0-9]

// Skipped
__
    = (whitespace / lineTerminatorSequence / comment)*
sourceCharacter
    = .
whitespace "whitespace"
    = "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"
    / Zs
lineTerminator
    = [\n\r\u2028\u2029]
lineTerminatorSequence
    = "\n"
    / "\r\n"
    / "\r"
    / "\u2028"
    / "\u2029"
comment
    = "#" (!lineTerminator sourceCharacter)*
Zs 
    = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]