const brain = require('brain.js');

export async function trainer(trainingData) {
    console.log('Training data size:', trainingData.length)
    const net = new brain.NeuralNetworkGPU();
    net.train(trainingData);
    return net;
}
