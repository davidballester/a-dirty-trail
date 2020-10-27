import Weapon from './Weapon';
import WeaponAmmunition from './WeaponAmmunition';

class Firearm extends Weapon {
    getAmmunition(): WeaponAmmunition {
        const ammunition = super.getAmmunition();
        if (!ammunition) {
            throw new Error('Firearm without ammunition!');
        }
        return ammunition;
    }
}

export default Firearm;
