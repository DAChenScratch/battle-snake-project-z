(() => {
    const brain = require('brain.js');

    // provide optional config object (or undefined). Defaults shown.
    const config = {
        binaryThresh: 0.1,
        hiddenLayers: [4, 10],     // array of ints for the sizes of the hidden layers in the network
        activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
        leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
    };

    // create a simple feed forward neural network with backpropagation
    const net = new brain.NeuralNetwork(config);

    const randomFloat = () => {
        return parseFloat(Math.random().toFixed(2));
    }

    const generateSet = () => {
        const expected = randomFloat();
        return {
            input: [expected, randomFloat(), randomFloat(), randomFloat()],
            output: [expected],
        };
    };


    const trainingData = [];
    const trainingDataSize = 10;
    for (let i = 0; i < trainingDataSize; i++) {
        trainingData.push(generateSet());
    }

    net.train(trainingData);

    console.log(trainingData);

    const test = () => {
        const testSet = generateSet();
        const result = net.run(testSet.input);
        console.log(result, testSet, Math.abs(result[0] - testSet.output[0]).toFixed(2));
    }

    test();
})();