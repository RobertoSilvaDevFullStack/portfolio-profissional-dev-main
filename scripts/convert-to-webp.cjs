const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Convert images to WebP format for better performance
 * Usage: node scripts/convert-to-webp.js
 */

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

async function convertImageToWebP(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();

    if (!SUPPORTED_FORMATS.includes(ext)) {
        return null;
    }

    const webpPath = imagePath.replace(ext, '.webp');

    try {
        await sharp(imagePath)
            .webp({ quality: 85 }) // High quality WebP
            .toFile(webpPath);

        const originalSize = (await fs.stat(imagePath)).size;
        const webpSize = (await fs.stat(webpPath)).size;
        const savings = ((1 - webpSize / originalSize) * 100).toFixed(2);

        console.log(`✅ Converted: ${path.basename(imagePath)}`);
        console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   WebP: ${(webpSize / 1024).toFixed(2)} KB`);
        console.log(`   Savings: ${savings}%\n`);

        return { original: imagePath, webp: webpPath, savings };
    } catch (error) {
        console.error(`❌ Error converting ${imagePath}:`, error.message);
        return null;
    }
}

async function findImages(dir) {
    const images = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                // Skip node_modules and other build directories
                if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
                    images.push(...await findImages(fullPath));
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (SUPPORTED_FORMATS.includes(ext)) {
                    images.push(fullPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error.message);
    }

    return images;
}

async function main() {
    console.log('🖼️  Starting image conversion to WebP...\n');
    console.log(`📁 Scanning directory: ${PUBLIC_DIR}\n`);

    const images = await findImages(PUBLIC_DIR);

    if (images.length === 0) {
        console.log('No images found to convert.');
        return;
    }

    console.log(`Found ${images.length} image(s) to convert\n`);

    const results = [];
    for (const imagePath of images) {
        const result = await convertImageToWebP(imagePath);
        if (result) {
            results.push(result);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total images processed: ${results.length}`);

    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => {
            const stats = require('fs').statSync(r.original);
            return sum + stats.size;
        }, 0);

        const totalWebP = results.reduce((sum, r) => {
            const stats = require('fs').statSync(r.webp);
            return sum + stats.size;
        }, 0);

        const totalSavings = ((1 - totalWebP / totalOriginal) * 100).toFixed(2);

        console.log(`   Total original size: ${(totalOriginal / 1024).toFixed(2)} KB`);
        console.log(`   Total WebP size: ${(totalWebP / 1024).toFixed(2)} KB`);
        console.log(`   Total savings: ${totalSavings}%`);
    }

    console.log('\n✨ Conversion complete!');
}

main().catch(console.error);
