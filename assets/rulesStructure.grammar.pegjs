rule
    = subject:subject verb:verb targets:targets { return { subject, verb, targets }; }

// Subject
subject
    = vbg:VBG targets:targets? { return { action: { name: vbg, targets } }; }
    / DT? adjective:adjective? noun:noun? { 
        if (!adjective && noun) return { actor: { name: noun } };
        if (!noun && adjective) return { actor: { name: adjective } };
        if (!noun && !adjective) return null
        return { actor: { name: noun, modifier: adjective }}; 
    }
adjective
    = jjr:JJR { return jjr; }
    / jjs:JJS { return jjs; }
    / jj:JJ { return jj; }
    / rb:RB { return rb; }
noun
    = nns:NNS { return nns; }
    / nn:NN { return nn; }
    / nnp:NNP { return nnp; }

// Verb
verb
    = vbp:VBP preposition:PREPOSITION? { return { name: vbp }; }
    / vbz:VBZ prp:PRP? preposition:PREPOSITION? { return { name: vbz }; }
    / vb:VB preposition:PREPOSITION?  { return { name: vb }; }
    / md:MD verb:verb { return {modal: md, ...verb}; }

// Target
targets
    = subject:subject CC targets:targets { return subject ? [ subject.actor, ...targets ] : targets; }
    / startRange:CD CC endRange:CD subject:subject { return [{ ...subject.actor, range: [startRange, endRange] }]; }
    / target:subject { return target ? [ target.actor ] : null; }

// Tags
DT
    = "DT" separator word __
NN
    = "NN" separator word:word __ { return word; }
NNS
    = "NNS" separator word:word __ { return word; }
NNP
    = "NNP" separator word:word __ { return word; }
JJ
    = "JJ" separator word:word __ { return word; }
JJR
    = "JJR" separator word:word __ { return word; }
JJS
    = "JJS" separator word:word __ { return word; }
VB
    = "VB" separator word:word __ { return word; }
VBG
    = "VBG" separator word:word __ { return word; }
VBP
    = "VBP" separator word:word __ { return word; }
VBZ
    = "VBZ" separator word:word __ { return word; }
MD
    = "MD" separator word:word __ { return word; }
PREPOSITION
    = "IN" separator word:word __ { return word; }
CC
    = "CC" separator word:word __
RB
    = "RB" separator word:word __ { return word; }
PRP
    = "PRP" separator word:word __
CD
    = "CD" separator number:number __ { return number; }

separator
    = "/"
word
    = letters:$letter+ { return letters.toLowerCase(); }
letter
    = [a-z]
    / [A-Z]
number
    = quantity:$[0-9]+ {return parseInt(quantity); }

// Skipped
__
    = (whitespace)*
whitespace "whitespace"
    = "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"
    / Zs
Zs 
    = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]