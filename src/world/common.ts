export const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
};

export const getRandomItems = <T>(items: T[], min: number, max: number) => {
    min = Math.min(min, items.length);
    max = Math.min(items.length, max);
    const itemsRange = max - min;
    const numberOfRandomItems = Math.round(Math.random() * itemsRange + min);
    const randomItemsIndices = [] as number[];
    for (let i = 0; i < numberOfRandomItems; i++) {
        let randomIndex = -1;
        do {
            randomIndex = Math.floor(Math.random() * items.length);
        } while (randomItemsIndices.indexOf(randomIndex) >= 0);
        randomItemsIndices.push(randomIndex);
    }
    return randomItemsIndices.map((index) => items[index]);
};
