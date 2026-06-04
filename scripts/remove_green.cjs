const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const inputDir = 'd:/CARS_PROJECT/assets/ubuntu';
const outputDir = 'd:/CARS_PROJECT/ua-ie-car-scout/public/assets/icons';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png') && !f.includes('_original'));

// Color distance function
function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

async function processImage(file) {
  const inPath = path.join(inputDir, file);
  const outPath = path.join(outputDir, file);
  
  if (file === 'hero_car_background.png') {
    fs.copyFileSync(inPath, outPath);
    console.log(`Copied ${file}`);
    return;
  }

  try {
    const image = await Jimp.read(inPath);
    // Find the background color (sample top-left pixel)
    const bgColor = Jimp.intToRGBA(image.getPixelColor(0, 0));
    
    // We assume the background is green or whatever the top-left pixel is
    // Actually, let's just make it transparent if it's close to the top-left pixel
    // To handle antialiasing, we can make it semi-transparent based on distance
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const dist = colorDistance(r, g, b, bgColor.r, bgColor.g, bgColor.b);
      
      // Threshold for removing background
      if (dist < 60) {
        // Close to background -> transparent
        this.bitmap.data[idx + 3] = 0; // alpha
      } else if (dist < 120) {
        // Edge -> semi-transparent
        this.bitmap.data[idx + 3] = Math.floor(255 * ((dist - 60) / 60));
      }
    });

    // Resize icons to a reasonable size to save bandwidth, since they are UI icons
    image.resize(128, 128); // 128x128 is plenty for icons

    await image.writeAsync(outPath);
    console.log(`Processed ${file}`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

async function main() {
  for (const file of files) {
    await processImage(file);
  }
  console.log('Done!');
}

main();
