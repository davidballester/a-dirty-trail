export type AttackRuleType = 'isA' | 'skill' | 'damage' | 'ammunition';

export interface Damage {
    min: number;
    max: number;
}

export interface AttackRule {
    id: string;
    type: AttackRuleType;
    subjects: string[];
    target?: string;
    damage?: Damage;
    ammunition?: {
        max: number;
        type: string;
    };
}

export interface ActorRule {
    id: string;
    type: 'isA' | 'healthPoints';
    subjects?: string[];
    target?: {
        type: string;
        status: string;
    };
    actorType?: string;
    range?: {
        min: number;
        max: number;
    };
}

export interface SceneRule {
    id: string;
    type: 'isA' | 'contains';
    subjects: string[];
    targets: string[];
}
