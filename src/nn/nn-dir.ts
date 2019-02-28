(() => {
    const brain = require('brain.js');

    // const config = {
    //     binaryThresh: 0.3,
    //     hiddenLayers: [4, 10],
    //     // activation: 'sigmoid',
    //     // activation: 'relu',
    //     activation: 'leaky-relu',
    //     // activation: 'tanh',
    //     leakyReluAlpha: 0.01,
    // };

    const randomFloat = () => {
        return parseFloat(Math.random().toFixed(2));
    }

    const generateSet = () => {
        let expected = randomFloat();
        expected = Math.round(expected * 3) / 4;
        return {
            input: [expected, randomFloat(), randomFloat(), randomFloat()],
            output: [expected],
        };
    };

    const generateConfig = () => {
        const activations = ['sigmoid', 'relu', 'leaky-relu', 'tanh'];
        const hiddenLayers = [];
        const hiddenLayersAmount = Math.ceil(Math.random() * 10);
        for (let i = 0; i < hiddenLayersAmount; i++) {
            const layerSize = Math.ceil(Math.random() * 10) + 1;
            hiddenLayers.push(layerSize);
        }
        return {
            binaryThresh: Math.random(),
            hiddenLayers: hiddenLayers,
            activation: activations[Math.floor(Math.random() * activations.length)],
            leakyReluAlpha: Math.random(),
        };
    };

    let best = null;
    const test = () => {
        const config = generateConfig();
        // console.log(config);
        const net = new brain.NeuralNetwork(config);

        const trainingData = [];
        const trainingDataSize = Math.ceil(Math.random() * 10 + 10);
        for (let i = 0; i < trainingDataSize; i++) {
            trainingData.push(generateSet());
        }
        // console.log(trainingData);

        net.train(trainingData);

        const results = {
            correct: 0,
            incorrect: 0,
        };

        for (let r = 0; r < 1000; r++) {
            const testSet = generateSet();
            const result = net.run(testSet.input);
            if (testSet.output[0] * 4 == Math.round(result[0] * 4)) {
                results.correct++;
            } else {
                results.incorrect++;
            }
        }
        console.log(results);
        if (!best || results.correct > best.results.correct) {
            best = {
                net: net.toJSON(),
                config: config,
                results: results,
                trainingDataSize: trainingDataSize,
            };
            process.stdout.write('New best: ');
            process.stdout.write(JSON.stringify(best, null, 4));
            process.stdout.write('\n');
        }
    }

    for (let r = 0; r < 1000; r++) {
        test();
    }
})();