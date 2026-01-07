const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * Optimize images by compressing them
 * Usage: node scripts/optimize-images.js
 */

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = {
    jpeg: 80,
    png: 80,
    webp: 85
};

async function optimizeImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const tempPath = imagePath + '.tmp';

    try {
        let sharpInstance = sharp(imagePath);

        // Get image metadata
        const metadata = await sharpInstance.metadata();

        // Resize if too large (max 1920px width)
        if (metadata.width > 1920) {
            sharpInstance = sharpInstance.resize(1920, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Apply format-specific optimization
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                sharpInstance = sharpInstance.jpeg({ quality: QUALITY.jpeg, progressive: true });
                break;
            case '.png':
                sharpInstance = sharpInstance.png({ quality: QUALITY.png, compressionLevel: 9 });
                break;
            case '.webp':
                sharpInstance = sharpInstance.webp({ quality: QUALITY.webp });
                break;
            default:
                return null;
        }

        await sharpInstance.toFile(tempPath);

        const originalSize = (await fs.stat(imagePath)).size;
        const optimizedSize = (await fs.stat(tempPath)).size;

        // Only replace if we actually saved space
        if (optimizedSize < originalSize) {
            await fs.unlink(imagePath);
            await fs.rename(tempPath, imagePath);

            const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

            console.log(`✅ Optimized: ${path.basename(imagePath)}`);
            console.log(`   Before: ${(originalSize / 1024).toFixed(2)} KB`);
            console.log(`   After: ${(optimizedSize / 1024).toFixed(2)} KB`);
            console.log(`   Savings: ${savings}%\n`);

            return { path: imagePath, originalSize, optimizedSize, savings };
        } else {
            await fs.unlink(tempPath);
            console.log(`⏭️  Skipped: ${path.basename(imagePath)} (already optimized)\n`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error optimizing ${imagePath}:`, error.message);
        // Clean up temp file if it exists
        try {
            await fs.unlink(tempPath);
        } catch { }
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
                if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
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
        console.error(`Error reading directory ${dir}:`, error.message);
    }

    return images;
}

async function main() {
    console.log('🎨 Starting image optimization...\n');
    console.log(`📁 Scanning directory: ${PUBLIC_DIR}\n`);

    const images = await findImages(PUBLIC_DIR);

    if (images.length === 0) {
        console.log('No images found to optimize.');
        return;
    }

    console.log(`Found ${images.length} image(s) to optimize\n`);

    const results = [];
    for (const imagePath of images) {
        const result = await optimizeImage(imagePath);
        if (result) {
            results.push(result);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Images optimized: ${results.length}`);
    console.log(`   Images skipped: ${images.length - results.length}`);

    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
        const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
        const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(2);

        console.log(`   Total saved: ${((totalOriginal - totalOptimized) / 1024).toFixed(2)} KB`);
        console.log(`   Overall savings: ${totalSavings}%`);
    }

    console.log('\n✨ Optimization complete!');
}

main().catch(console.error);
