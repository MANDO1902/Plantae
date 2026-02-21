const sharp = require('sharp');
const path = require('path');

const svgFile = path.join(__dirname, 'plantae-icon.svg');

async function generateIcons() {
    await sharp(svgFile).resize(192, 192).png().toFile(path.join(__dirname, 'pwa-192x192.png'));
    console.log('Generated pwa-192x192.png');
    await sharp(svgFile).resize(512, 512).png().toFile(path.join(__dirname, 'pwa-512x512.png'));
    console.log('Generated pwa-512x512.png');
    await sharp(svgFile).resize(180, 180).png().toFile(path.join(__dirname, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');
}

generateIcons().catch(console.error);
