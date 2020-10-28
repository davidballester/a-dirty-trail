import SceneTemplate from './SceneTemplate';
import SceneTemplateProcessor from './SceneTemplateProcessor';

describe(SceneTemplateProcessor.name, () => {
    let sceneTemplateProcessor: SceneTemplateProcessor;
    beforeEach(() => {
        const sceneTemplate = {
            metadata: {
                action1: 'The desert was the apotheosis of all deserts.',
                action2: 'It was {{color}} and blinding.',
            },
            setup:
                '\r\nThe man in black fled across the desert, and {{playerName}} followed.\r\n',
        } as SceneTemplate;
        const input = {
            playerName: 'the gunslinger',
            color: 'white',
        };
        sceneTemplateProcessor = new SceneTemplateProcessor({
            sceneTemplate,
            input,
        });
    });

    describe('getTexts', () => {
        it('returns the setup', () => {
            const { setup } = sceneTemplateProcessor.getTexts();
            expect(setup).toEqual(
                'The man in black fled across the desert, and the gunslinger followed.'
            );
        });

        it('returns the actions in the correct order', () => {
            const { actionsText } = sceneTemplateProcessor.getTexts();
            expect(actionsText).toEqual([
                'The desert was the apotheosis of all deserts.',
                'It was white and blinding.',
            ]);
        });
    });
});
