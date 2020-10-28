export interface Rule {
    type: 'renamePlayer' | 'takeWeapon';
}

export interface RenamePlayerRule {
    type: 'renamePlayer';
    newName: string;
}

export interface TakeWeaponRule {
    type: 'takeWeapon';
    item: {
        name: string;
        itemType: 'weapon';
        type: string;
        minDamage: number;
        maxDamage: number;
        skill: string;
        ammunitionType?: string;
        currentAmmunition?: number;
        maxAmmunition?: number;
    };
}
