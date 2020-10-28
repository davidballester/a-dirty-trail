import MarkdownText from '../core/MarkdownText';

interface SceneTemplate {
    modulePath?: string;
    title: MarkdownText;
    metadata: SceneTemplateMetadata;
    setup: MarkdownText;
}

export interface SceneTemplateMetadata {
    actions?: { [key: string]: SceneTemplateAction };
}

export interface SceneTemplateAction {
    sideEffect?: Rule;
    goTo: string;
}

type Rule = string;

export default SceneTemplate;
