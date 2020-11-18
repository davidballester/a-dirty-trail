import Actor from '../core/Actor';
import Handlebars from 'handlebars';

class SceneTemplateEvaluator {
    private template: string;
    private player: Actor | undefined;

    constructor({ template, player }: { template: string; player?: Actor }) {
        this.template = template;
        this.player = player;
    }

    evaluate(): string {
        const handlebarsTemplate = Handlebars.compile(this.template);
        this.registerCustomHandlebarsHelpers();
        const handlebarsTemplateOptions = this.getHandlebarsTemplateOptions();
        return handlebarsTemplate(handlebarsTemplateOptions);
    }

    private registerCustomHandlebarsHelpers(): void {
        this.registerHasTrinketHelper();
        this.registerDoesNotHaveTrinketHelper();
        this.registerHasFlagHelper();
        this.registerHasNotFlagHelper();
        this.registerFlagIsGreaterThanHelper();
        this.registerFlagIsLowerThanHelper();
        this.registerFlagIsEqualToHelper();
        this.registerFlagIsDifferentToHelper();
    }

    private registerHasTrinketHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-has-trinket', function (
            this: Handlebars.HelperDelegate,
            trinketName: string,
            options
        ) {
            if (player?.getInventory().hasTrinket(trinketName)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerDoesNotHaveTrinketHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-has-not-trinket', function (
            this: Handlebars.HelperDelegate,
            trinketName: string,
            options
        ) {
            if (!player?.getInventory().hasTrinket(trinketName)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerHasFlagHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-has-flag', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            options
        ) {
            if (player?.getFlags().hasFlag(flag)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerHasNotFlagHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-has-not-flag', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            options
        ) {
            if (!player?.getFlags().hasFlag(flag)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerFlagIsGreaterThanHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-flag-greater-than', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            value: number,
            options
        ) {
            const flagValue =
                player?.getFlags().getFlag(flag) || Number.MIN_SAFE_INTEGER;
            if (flagValue > value) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerFlagIsLowerThanHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-flag-lower-than', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            value: number,
            options
        ) {
            const flagValue =
                player?.getFlags().getFlag(flag) || Number.MAX_SAFE_INTEGER;
            if (flagValue < value) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerFlagIsEqualToHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-flag-equal', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            value: number,
            options
        ) {
            const flagValue = player?.getFlags().getFlag(flag);
            if (flagValue === value) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private registerFlagIsDifferentToHelper(): void {
        const player = this.player;
        Handlebars.registerHelper('if-flag-different', function (
            this: Handlebars.HelperDelegate,
            flag: string,
            value: number,
            options
        ) {
            const flagValue = player?.getFlags().getFlag(flag);
            if (flagValue !== value) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });
    }

    private getHandlebarsTemplateOptions(): any {
        if (!this.player) {
            return {};
        }
        return {
            playerName: this.player.getName(),
        };
    }
}

export default SceneTemplateEvaluator;
