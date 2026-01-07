const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Aggressive image optimization for maximum performance
 * Usage: node scripts/aggressive-optimize.cjs
 */

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_DIR = path.join(__dirname, '..', 'src');

async function optimizeImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const tempPath = imagePath + '.tmp';

    try {
        let sharpInstance = sharp(imagePath);
        const metadata = await sharpInstance.metadata();

        // More aggressive resizing
        const maxWidth = 1200; // Reduced from 1920
        if (metadata.width > maxWidth) {
            sharpInstance = sharpInstance.resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Aggressive compression based on format
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                sharpInstance = sharpInstance.jpeg({
                    quality: 70, // More aggressive
                    progressive: true,
                    mozjpeg: true
                });
                break;
            case '.png':
                sharpInstance = sharpInstance.png({
                    quality: 70, // More aggressive
                    compressionLevel: 9,
                    palette: true
                });
                break;
            case '.webp':
                sharpInstance = sharpInstance.webp({
                    quality: 75, // More aggressive
                    effort: 6
                });
                break;
            default:
                return null;
        }

        await sharpInstance.toFile(tempPath);

        const originalSize = (await fs.stat(imagePath)).size;
        const optimizedSize = (await fs.stat(tempPath)).size;

        if (optimizedSize < originalSize) {
            await fs.unlink(imagePath);
            await fs.rename(tempPath, imagePath);

            const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

            console.log(`✅ Optimized: ${path.basename(imagePath)}`);
            console.log(`   ${(originalSize / 1024).toFixed(2)} KB → ${(optimizedSize / 1024).toFixed(2)} KB (${savings}% saved)\n`);

            return { path: imagePath, originalSize, optimizedSize, savings };
        } else {
            await fs.unlink(tempPath);
            console.log(`⏭️  Skipped: ${path.basename(imagePath)} (already optimal)\n`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error: ${imagePath}:`, error.message);
        try { await fs.unlink(tempPath); } catch { }
        return null;
    }
}

async function findImages(dir) {
    const images = [];
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!['node_modules', 'dist', 'build', '.git', 'icons'].includes(entry.name)) {
                    images.push(...await findImages(fullPath));
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (supportedFormats.includes(ext)) {
                    images.push(fullPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading ${dir}:`, error.message);
    }

    return images;
}

async function main() {
    console.log('🎨 Aggressive Image Optimization\n');

    const publicImages = await findImages(PUBLIC_DIR);

    console.log(`Found ${publicImages.length} image(s)\n`);

    const results = [];
    for (const imagePath of publicImages) {
        const result = await optimizeImage(imagePath);
        if (result) results.push(result);
    }

    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
        const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

        console.log('\n📊 Summary:');
        console.log(`   Images optimized: ${results.length}`);
        console.log(`   Total saved: ${((totalOriginal - totalOptimized) / 1024).toFixed(2)} KB`);
        console.log(`   Overall savings: ${totalSavings}%`);
    }

    console.log('\n✨ Complete!');
}

main().catch(console.error);
