const brain = require('brain.js');

export function generateConfig(maxLayerSize = 10, maxHiddenLayers = 10) {
    const activations = ['sigmoid', 'relu', 'leaky-relu', 'tanh'];
    const hiddenLayers = [];
    const hiddenLayersAmount = Math.ceil(Math.random() * maxHiddenLayers);
    for (let i = 0; i < hiddenLayersAmount; i++) {
        const layerSize = Math.ceil(Math.random() * maxLayerSize) + 1;
        hiddenLayers.push(layerSize);
    }
    return {
        binaryThresh: Math.random(),
        hiddenLayers: hiddenLayers,
        activation: activations[Math.floor(Math.random() * activations.length)],
        leakyReluAlpha: Math.random(),
    };
}

export async function trainer(trainingData, config, iterations = 20000) {
    const net = new brain.NeuralNetwork(config);
    const promise = net.trainAsync(trainingData, {
        iterations: iterations,
        log: true,
        logPeriod: 10,
        callback: (...args) => {
            console.log(args);
            // net.halt();
        },
        callbackPeriod: 10,
    });
    console.log(promise);
    return net;
}
