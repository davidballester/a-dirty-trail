export interface Actor {
    name: string;
    modifier?: string;
}

export interface Target extends Actor {}

export interface Action {
    name: string;
    targets: Target[];
}

export interface Subject {
    actor?: Actor;
    action?: Action;
}

export interface Verb {
    name: string;
    modal?: string;
}

export interface Rule {
    subject: Subject;
    verb: Verb;
    targets: Target[];
}
