import { render } from './nil-launchpad.js'
import p5 from 'p5'

/**
 * Define your project traits
 * Following function is  will compute traits with deterministic nilRandom generator
 */
const computeTraits = (nilRandom) => {
  const colorTrait = nilRandom()

  // Define rarity of different values based on a random number
  const backgroundColorFn = (n) => {
    if (n <= 0.5) { // 50%
      return 'gold'
    } else { // 50%
      return 'silver'
    }
  }

  const lineColorFn = (n) => {
    if (n <= 0.1) { // 10%
      return 'green'
    } else
    if (n <= 0.3) { // 20%
      return 'blue'
    } else { // 70%
      return 'white'
    }
  }

  // Get the vaules, which can be later accessed in the image generation function
  const backgroundColor = backgroundColorFn(colorTrait)
  const lineColor = lineColorFn(colorTrait)

  return { backgroundColor, lineColor }
}

/**
 * Define your rendering function
 */
const renderImage = (nilRandom, { backgroundColor, lineColor }) => {
  // Since we need a callable function, we use P5 instance mode to call it after random numbers are generated
  // https://github.com/processing/p5.js/wiki/Global-and-instance-mode
  // based on https://happycoding.io/examples/p5js/for-loops/wrong-lines
  const drop = (p5) => {
    const width = document.body.clientWidth
    const body = document.body,
          html = document.documentElement
    const height = Math.max(body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight)

    p5.setup = () => {
      p5.createCanvas(width, height)
      p5.noLoop()
    }

    p5.draw = () => {
      let DIM = p5.min(width, height);

      let mod1 = p5.random();
      let mod2 = p5.random();
      let mod3 = p5.random();
      let mod4 = p5.random();
      let mod5 = p5.random();

      let n, skip, verts;
      n = parseInt(5 + 16 * p5.random());
      do {
        skip = [ 
          parseInt(1 + (n-1) * p5.random()),
          parseInt(1 + (n-1) * p5.random()), 
          parseInt(1 + (n-1) * p5.random())
        ];
      } 
      while (n % skip[2] === 0);
    
      verts = [];
      for (var i = 0; i < n; i++) {
        var ang = p5.lerp(0, p5.TWO_PI, i / n);
        verts.push({
          x: 0.333 * DIM * p5.cos(ang),
          y: 0.333 * DIM * p5.sin(ang)
        });
      }  
    
      var hueInit = p5.random();
    
      var strokeHue = parseInt(360 * ((hueInit + mod2) % 1.0));
      var strokeSaturation = parseInt(90 + 10 * p5.random());
      var strokeBrightness = parseInt(90 + 10 * p5.random());
      var strokeAlpha = 0.85 + 0.13 * p5.random();
    
      var fillHue = parseInt(360 * ((hueInit + 0.5 + mod3) % 1.0));
      var fillSaturation = parseInt(60 + 40 * p5.random());
      var fillBrightness = parseInt(60 + 40 * p5.random());
      var fillAlpha = 0.25 + 0.15 * p5.random();

      


      p5.colorMode(p5.HSB, 360, 100, 100, 1);    

      p5.background(0); 
      var rads = Math.ceil((height**2 + width**2) ** 0.5);
      for (var r=rads; r>0; r-=5) {
        p5.fill(fillHue, fillSaturation, p5.lerp(0.72*fillBrightness, 0, r/rads));
        p5.noStroke();
        p5.ellipse(width/2, height/2, r, r);
      }
    
      var thickness = p5.map(mod1, 0.0, 1.0, 0.1, 1.0) * DIM / 500.0;
    
      for (var k=0; k<8; k++) {
        if (k < 5) {
          p5.noFill();
          p5.stroke(strokeHue, strokeSaturation, strokeBrightness, strokeAlpha * 0.1 * (k+1));
          p5.strokeWeight((7.0-k) * thickness);
        }
        else if (k == 5) {
          p5.noStroke();
          p5.fill(fillHue, fillSaturation, fillBrightness, fillAlpha * mod4);
        }
        else if (k == 6) {
          p5.noFill();
          p5.stroke(strokeHue, strokeSaturation, strokeBrightness, strokeAlpha*0.555);
          p5.strokeWeight(2.0  * thickness);
        }
        else if (k == 7) {
          p5.noFill();
          p5.stroke(strokeHue, strokeSaturation, strokeBrightness, strokeAlpha);
          p5.strokeWeight(1.0 * thickness);
        }
    
        p5.push();
        p5.translate(width/2, height/2);
        p5.rotate(0.5 * Math.PI * mod5)
        var i1 = 0;
        do {
          var i2 = (i1 + skip[0]) % n;
          var i3 = (i1 + skip[1]) % n;
          var i4 = (i1 + skip[2]) % n;
          p5.beginShape();
            p5.curveVertex(verts[i1].x, verts[i1].y);
            p5.curveVertex(verts[i2].x, verts[i2].y);
            p5.curveVertex(verts[i3].x, verts[i3].y);
            p5.curveVertex(verts[i4].x, verts[i4].y);
          p5.endShape(p5.CLOSE);
          if (k>6) {
            p5.bezier(
              verts[i1].x, verts[i1].y, 
              verts[i2].x, verts[i2].y, 
              verts[i3].x, verts[i3].y, 
              verts[i4].x, verts[i4].y
            );
          }
          i1 = i3;
        } 
        while (i1 !== 0); 
    
        p5.pop();
      }
    
    }

    
  }

  new p5(drop)
}

render(computeTraits, renderImage)
