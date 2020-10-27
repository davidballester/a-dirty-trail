/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownText from '../core/MarkdownText';
import parseMarkdown from 'markdown-yaml-metadata-parser';

class SceneTextsReader {
    private sceneSetupFilePath: string;
    private input: Dictionary;

    constructor({
        sceneSetupFilePath,
        input = {},
    }: {
        sceneSetupFilePath: string;
        input?: Dictionary;
    }) {
        this.sceneSetupFilePath = sceneSetupFilePath;
        this.input = input;
    }

    async getTexts(): Promise<SceneTexts> {
        const { metadata, content } = await this.readSceneTexts();
        const setup = this.replaceInputs(content);
        const rawActionsText = this.buildActionsText(metadata);
        const actionsText = rawActionsText.map((rawActionText) =>
            this.replaceInputs(rawActionText)
        );
        return {
            setup,
            actionsText,
        };
    }

    private async readSceneTexts(): Promise<{
        metadata: Dictionary;
        content: MarkdownText;
    }> {
        const markdownFileContent = await this.readFileContent();
        return parseMarkdown(markdownFileContent);
    }

    private async readFileContent(): Promise<string> {
        return import(this.sceneSetupFilePath).then(
            (sceneSetup: string | { default: string }) => {
                if ((sceneSetup as any).default) {
                    return (sceneSetup as any).default;
                }
                return sceneSetup;
            }
        );
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

    private buildActionsText(actionsRawTexts: Dictionary): MarkdownText[] {
        return Object.keys(actionsRawTexts)
            .sort()
            .map((actionKey) => {
                const actionRawText = actionsRawTexts[actionKey];
                return this.replaceInputs(actionRawText);
            });
    }
}

export interface SceneTexts {
    setup: MarkdownText;
    actionsText: MarkdownText[];
}

type Dictionary = { [key: string]: string };

export default SceneTextsReader;
