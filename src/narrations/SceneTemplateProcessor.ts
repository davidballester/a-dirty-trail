import MarkdownText from '../core/MarkdownText';
import SceneTemplate from './SceneTemplate';

class SceneTemplateProcessor {
    private sceneTemplate: SceneTemplate;
    private input: Dictionary;

    constructor({
        sceneTemplate,
        input = {},
    }: {
        sceneTemplate: SceneTemplate;
        input?: Dictionary;
    }) {
        this.sceneTemplate = sceneTemplate;
        this.input = input;
    }

    getTexts(): SceneTexts {
        const setup = this.replaceInputs(this.sceneTemplate.setup);
        const rawActionsText = this.buildActionsText();
        const actionsText = rawActionsText.map((rawActionText) =>
            this.replaceInputs(rawActionText)
        );
        return {
            setup,
            actionsText,
        };
    }

    private replaceInputs(content: MarkdownText): MarkdownText {
        return Object.keys(this.input).reduce((newContent, inputKey) => {
            const inputValue = this.input[inputKey];
            return newContent.replace(
                new RegExp(`\{\{${inputKey}\}\}`, 'g'),
                inputValue
            );
        }, content.trim());
    }

    private buildActionsText(): MarkdownText[] {
        return Object.keys(this.sceneTemplate.metadata)
            .sort()
            .map((actionKey) => {
                const actionRawText = this.sceneTemplate.metadata[actionKey];
                return this.replaceInputs(actionRawText);
            });
    }
}

export interface SceneTexts {
    setup: MarkdownText;
    actionsText: MarkdownText[];
}

type Dictionary = { [key: string]: string };

export default SceneTemplateProcessor;
