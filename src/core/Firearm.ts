import Weapon from './Weapon';
import WeaponAmmunition from './WeaponAmmunition';

class Firearm extends Weapon {
    getAmmunition(): WeaponAmmunition {
        const ammunition = super.getAmmunition();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return ammunition!;
    }
}

export default Firearm;
