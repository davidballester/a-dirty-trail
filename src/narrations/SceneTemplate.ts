import MarkdownText from '../core/MarkdownText';

interface SceneTemplate {
    metadata: { [key: string]: MarkdownText };
    setup: MarkdownText;
}

export default SceneTemplate;
