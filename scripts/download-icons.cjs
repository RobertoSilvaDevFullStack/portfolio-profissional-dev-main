const https = require('https');
const fs = require('fs').promises;
const path = require('path');

/**
 * Download tech icons as SVG from skillicons.dev
 * Usage: node scripts/download-icons.cjs
 */

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Most commonly used tech icons in the portfolio
const TECH_ICONS = [
    'react',
    'typescript',
    'javascript',
    'nodejs',
    'express',
    'postgresql',
    'prisma',
    'tailwind',
    'vite',
    'git',
    'github',
    'html',
    'css',
    'figma',
    'docker',
    'vercel',
    'nextjs',
    'python',
    'mongodb',
    'mysql'
];

async function downloadIcon(iconName) {
    const url = `https://cdn.simpleicons.org/${iconName}`;
    const filePath = path.join(ICONS_DIR, `${iconName}.svg`);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });
                response.on('end', async () => {
                    try {
                        await fs.writeFile(filePath, data);
                        console.log(`✅ Downloaded: ${iconName}.svg`);
                        resolve(true);
                    } catch (error) {
                        console.error(`❌ Error saving ${iconName}:`, error.message);
                        reject(error);
                    }
                });
            } else {
                console.log(`⏭️  Skipped: ${iconName} (not found on simpleicons)`);
                resolve(false);
            }
        }).on('error', (error) => {
            console.error(`❌ Error downloading ${iconName}:`, error.message);
            reject(error);
        });
    });
}

async function ensureIconsDir() {
    try {
        await fs.access(ICONS_DIR);
    } catch {
        await fs.mkdir(ICONS_DIR, { recursive: true });
        console.log(`📁 Created icons directory: ${ICONS_DIR}\n`);
    }
}

async function main() {
    console.log('🎨 Starting tech icons download...\n');

    await ensureIconsDir();

    console.log(`Downloading ${TECH_ICONS.length} icons...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const icon of TECH_ICONS) {
        try {
            const success = await downloadIcon(icon);
            if (success) successCount++;
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            failCount++;
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Successfully downloaded: ${successCount}`);
    console.log(`   Failed/Skipped: ${failCount}`);
    console.log('\n✨ Download complete!');
    console.log('\n💡 Note: Icons will fallback to skillicons.dev if not found locally');
}

main().catch(console.error);
