/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format for better performance
 * Run: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
    require.resolve('sharp');
} catch (e) {
    console.log('Installing sharp for image optimization...');
    execSync('npm install --save-dev sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (!IMAGE_EXTENSIONS.includes(ext)) {
        return;
    }

    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${fileName}.webp`);

    try {
        await sharp(filePath)
            .webp({ quality: 85 })
            .toFile(webpPath);

        const originalSize = fs.statSync(filePath).size;
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);

        console.log(`✓ ${fileName}${ext} → ${fileName}.webp (${savings}% smaller)`);
    } catch (error) {
        console.error(`✗ Failed to optimize ${filePath}:`, error.message);
    }
}

async function findAndOptimizeImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await findAndOptimizeImages(filePath);
        } else {
            await optimizeImage(filePath);
        }
    }
}

async function main() {
    console.log('🖼️  Starting image optimization...\n');

    await findAndOptimizeImages(PUBLIC_DIR);

    console.log('\n✅ Image optimization complete!');
    console.log('💡 Tip: Update your HTML to use <picture> tags with WebP fallbacks');
}

main().catch(console.error);
