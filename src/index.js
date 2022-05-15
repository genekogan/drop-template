import { render } from './nil-launchpad.js'
import p5 from 'p5'
import * as tf from '@tensorflow/tfjs';

//const modelUrl = "https://gateway.pinata.cloud/ipfs/QmbCZkvP4S9ucMJYUgBZq2ziUxjsv8xmsRjUTgx7ovUGqi/model.json";
const modelUrl = "/model/model.json";

const Z_DIM = 100;
const categories = ['person', 'dog', 'cat', 'wild']
let dcgan;

/**
 * Define your project traits
 * Following function is  will compute traits with deterministic nilRandom generator
 */
const computeTraits = (nilRandom) => {
  const categoryTrait = nilRandom()

  // Define rarity of different values based on a random number
  const categoryFn = (n) => {
    return categories[Math.floor(4*categoryTrait)]
  }

  const category = categoryFn(categoryTrait)
  
  return { category }
}

/**
 * Define your rendering function
 */
const renderImage = (nilRandom, { category }) => {
  // Since we need a callable function, we use P5 instance mode to call it after random numbers are generated
  // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
  // based on https://happycoding.io/examples/p5js/for-loops/wrong-lines
  const drop = (p5) => {

    p5.setup = async () => {
      dcgan = await tf.loadLayersModel(modelUrl);
      
      const categoryIdx = categories.indexOf(category);
      
      let Z = tf.tensor2d([Array(Z_DIM).fill().map((_, idx) => 
        Math.sqrt(-2.0 * Math.log(nilRandom())) * Math.cos(2.0 * Math.PI * nilRandom())
      )])

      let Y = tf.tensor2d([[categoryIdx]])
      let X = await dcgan.predict([Z, Y]).array();
  
      let x = X[0];
      var h = x.length;
      var w = x[0].length;

      p5.createCanvas(w, h)
      p5.noLoop()

      p5.loadPixels();
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          var off = (j * w + i) * 4;
          p5.pixels[off + 0] = 127.5 * (x[j][i][0] + 1.0);
          p5.pixels[off + 1] = 127.5 * (x[j][i][1] + 1.0);
          p5.pixels[off + 2] = 127.5 * (x[j][i][2] + 1.0);
          p5.pixels[off + 3] = 255;
        }
      }
      p5.updatePixels();
    }

    p5.draw = () => {}

  }

  new p5(drop)
}

render(computeTraits, renderImage)
