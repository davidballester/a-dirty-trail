import SceneTextsReader from './SceneTextsReader';

describe('SceneTextsReader', () => {
    let sceneSetupFilePath: string;
    let input: { [key: string]: string };
    let sceneTextsReader: SceneTextsReader;
    beforeEach(() => {
        sceneSetupFilePath = './__tests__/foo';
        input = {
            playerName: 'the gunslinger',
            color: 'white',
        };
        sceneTextsReader = new SceneTextsReader({ sceneSetupFilePath, input });
    });

    describe('getTexts', () => {
        it('returns the setup', async () => {
            const { setup } = await sceneTextsReader.getTexts();
            expect(setup).toEqual(
                'The man in black fled across the desert, and the gunslinger followed.'
            );
        });

        it('returns the actions in the correct order', async () => {
            const { actionsText } = await sceneTextsReader.getTexts();
            expect(actionsText).toEqual([
                'The desert was the apotheosis of all deserts.',
                'It was white and blinding.',
            ]);
        });
    });
});
