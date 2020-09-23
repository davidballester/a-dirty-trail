import { Actor, Rule, Subject, Target } from '../model';

export const getRulesWithActor = (actor: Actor, rules: Rule[]): Rule[] => {
    return rules.filter(
        ({ subject, targets }) =>
            isSubject(actor, subject) || isTarget(actor, targets)
    );
};

export const getInstances = (actor: Actor, rules: Rule[]): Actor[] => {
    const isARule = getRulesWithSubjectAndTargetByVerb(rules, 'be');
    const isAnActorRules = getRulesWithActorAsTarget(actor, isARule);
    if (isAnActorRules.length) {
        return isAnActorRules
            .filter(({ subject }) => !!subject.actor)
            .map(({ subject }) => getInstances(subject.actor!, isARule))
            .reduce(
                (instances, subinstances) => [...instances, ...subinstances],
                []
            )
            .filter(
                (instance, index, instances) =>
                    instances.findIndex((candidate) =>
                        isSameActor(candidate, instance)
                    ) === index
            );
    } else {
        // Leaf of the tree
        return [actor];
    }
};

export const getContents = (actor: Actor, rules: Rule[]): Actor[] => {
    const haveRules = getRulesWithSubjectAndTargetByVerb(rules, 'have');
    const actorRules = getRulesWithActor(actor, haveRules);
    return actorRules
        .filter(({ subject }) => !!subject.actor)
        .map(({ subject, targets }) => {
            if (isSubject(actor, subject)) {
                return targets
                    .map((target) => getInstances(target, rules))
                    .reduce(
                        (contents, instances) => [...contents, ...instances],
                        []
                    );
            } else {
                // isTarget
                return getInstances(subject.actor!, rules);
            }
        })
        .reduce((allContents, contents) => [...allContents, ...contents], [])
        .filter(
            (instance, index, instances) =>
                instances.findIndex((candidate) =>
                    isSameActor(candidate, instance)
                ) === index
        );
};

const getRulesWithActorAsTarget = (actor: Actor, rules: Rule[]): Rule[] =>
    rules.filter((rule) => isTarget(actor, rule.targets));

const isSubject = ({ name, modifier }: Actor, subject: Subject): boolean => {
    return (
        !!subject &&
        !!subject.actor &&
        subject.actor.name === name &&
        (!modifier || subject.actor.modifier === modifier)
    );
};

const isTarget = ({ name, modifier }: Actor, targets: Target[]): boolean =>
    !!targets &&
    !!targets.length &&
    targets.some(
        (individualTarget) =>
            individualTarget.name === name &&
            (!modifier || individualTarget.modifier === modifier)
    );

const isSameActor = (actorAndModifier, candidateActorAndModifier) =>
    candidateActorAndModifier.actor === actorAndModifier.actor &&
    candidateActorAndModifier.modifier === actorAndModifier.modifier;

const getRulesWithSubjectAndTargetByVerb = (
    rules: Rule[],
    targetVerb: string
): Rule[] =>
    rules
        .filter(({ verb: { name: verb } }) => verb === targetVerb)
        .filter(
            ({ subject, targets }) => !!subject && !!targets && !!targets.length
        );

module.exports = {
    getRulesWithActor,
    getInstances,
    getContents,
};
