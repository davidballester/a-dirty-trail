interface TaggedWord {
    normal: string;
    pos: string;
    lemma?: string;
}

/**
 * Rules tagged using NL processing tools
 */
export interface NLTaggedRule {
    id: string;
    taggedWords: TaggedWord[];
}
