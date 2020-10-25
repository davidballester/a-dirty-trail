import Actor from '../../core/Actor';
import Damage from '../../core/Damage';
import Health from '../../core/Health';
import Inventory from '../../core/Inventory';
import Skill from '../../core/Skill';
import SkillSet from '../../core/SkillSet';
import Trinket from '../../core/Trinket';
import Weapon from '../../core/Weapon';

class AlysBuilder {
    private alys?: Actor;

    getAlys(): Actor {
        if (!this.alys) {
            this.alys = this.buildAlys();
        }
        return this.alys;
    }

    private buildAlys(): Actor {
        const health = this.buildHealth();
        const inventory = this.buildInventory();
        const skillSet = this.buildSkillSet();
        return new Actor({
            name: 'the damsel',
            health,
            inventory,
            skillSet,
        });
    }

    private buildHealth(): Health {
        return new Health({ current: 6, max: 6 });
    }

    private buildInventory(): Inventory {
        const letterOpener = this.buildLetterOpener();
        const letter = this.buildLetter();
        return new Inventory({
            weapons: [letterOpener],
            trinkets: [letter],
        });
    }

    private buildLetterOpener(): Weapon {
        return new Weapon({
            name: 'letter opener',
            type: 'knife',
            skill: 'stab',
            damage: new Damage({ min: 1, max: 1 }),
        });
    }

    private buildLetter(): Trinket {
        return new Trinket({
            name: 'Opened letter',
            description: 'A worrying farewell from her uncle.',
        });
    }

    private buildSkillSet(): SkillSet {
        return new SkillSet({
            skills: [
                new Skill({ name: 'stab', probabilityOfSuccess: 0.75 }),
                new Skill({ name: 'aim', probabilityOfSuccess: 0.6 }),
            ],
        });
    }
}

export default AlysBuilder;
