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

    net.train([
        { input: [0, 0], output: [0] },
        { input: [0.25, 0.25], output: [0.25] },
        { input: [0.5, 0.5], output: [0.5] },
        { input: [0.75, 0.75], output: [0.75] },
        { input: [1, 1], output: [1] },
    ]);

    console.log(net.run([1, 1]));
    console.log(net.run([0.25, 0.25]));
    console.log(net.run([0, 0]));
})();
