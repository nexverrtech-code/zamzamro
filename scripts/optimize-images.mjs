// Converts the raw marketing images in /raw into optimised WebP assets in /public/images.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = 'public/images';
await mkdir(out, { recursive: true });

const map = {
  '1.jpg': 'zamzam-business-card',
  '2.jpg': 'water-level-controller-and-commercial-ro',
  '3.jpg': 'aqua-2090-raga-series',
  '4.jpg': 'lx-one-titanium-gun-metal',
  '5.jpg': 'water-pia-purifier',
  '6.jpg': 'automatic-water-level-controller-banner',
  '7.jpg': 'nile-aqua-jade',
  '8.jpg': 'water-softener-installation',
  '9.jpg': 'aqua-2090-green',
  '10.jpg': 'aqua-ultra-all-water-sources',
  '11.jpg': 'clean-water-hi-flo-metallic-cherry',
  '12.jpg': 'clean-water-mountain-water-black',
  '13.jpg': 'nile-aqua-v5',
  '14.jpg': 'aqua-roma-gold',
};

for (const [src, name] of Object.entries(map)) {
  await sharp(`raw/${src}`).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${out}/${name}.webp`);
}

// Brand emblem (water drop) cropped from the business card.
await sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).png().toFile(`${out}/zamzam-emblem.png`);
// Full logo lockup.
await sharp('raw/1.jpg').extract({ left: 265, top: 40, width: 750, height: 450 }).webp({ quality: 90 }).toFile(`${out}/zamzam-logo.webp`);
// Product cut-outs from the commercial banner (2.jpg is 1280x720).
await sharp('raw/2.jpg').extract({ left: 515, top: 390, width: 205, height: 295 }).webp({ quality: 85 }).toFile(`${out}/ss-standard-system.webp`);
await sharp('raw/2.jpg').extract({ left: 735, top: 390, width: 205, height: 295 }).webp({ quality: 85 }).toFile(`${out}/ss-hot-normal-system.webp`);
await sharp('raw/2.jpg').extract({ left: 960, top: 175, width: 290, height: 520 }).webp({ quality: 85 }).toFile(`${out}/triple-stage-commercial-ro.webp`);
await sharp('raw/2.jpg').extract({ left: 0, top: 230, width: 500, height: 470 }).webp({ quality: 85 }).toFile(`${out}/water-level-controller.webp`);
await sharp('raw/9.jpg').resize({ width: 600 }).webp({ quality: 85 }).toFile(`${out}/aqua-2090-green-cutout.webp`);
await sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).resize(64, 89).png().toFile('public/favicon.png');
console.log('Images optimised.');

// Transparent emblem variants (navy + white) derived from luminance.
async function tintedEmblem(rgb, file) {
  const src = sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).resize({ width: 280 });
  const alpha = await src.clone().greyscale().negate().linear(1.6, -40).toColourspace('b-w').raw().toBuffer();
  const { width, height } = await src.clone().raw().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  await sharp({ create: { width, height, channels: 3, background: rgb } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(`${out}/${file}`);
}
await tintedEmblem({ r: 32, g: 38, b: 87 }, 'emblem-navy.png');
await tintedEmblem({ r: 255, g: 255, b: 255 }, 'emblem-white.png');

// Real water photography (hero backdrop + page backgrounds) and Aqua 2090 reference shots.
await sharp('raw/15.jpg').resize({ width: 1920 }).webp({ quality: 78 }).toFile(`${out}/water-underwater.webp`);
await sharp('raw/16.jpg').resize({ width: 1920 }).webp({ quality: 78 }).toFile(`${out}/water-surface.webp`);
await sharp('raw/15.jpg').resize({ width: 900 }).webp({ quality: 70 }).toFile(`${out}/water-underwater-sm.webp`);
const aqua = { '17.png': 'aqua-2090-purple', '18.png': 'aqua-2090-graphite', '19.png': 'aqua-2090-pink', '20.png': 'aqua-2090-mint', '21.png': 'aqua-2090-sky' };
for (const [src, name] of Object.entries(aqua)) {
  await sharp(`raw/${src}`).resize({ width: 900, withoutEnlargement: true }).flatten({ background: '#ffffff' }).webp({ quality: 85 }).toFile(`${out}/${name}.webp`);
}

// Preferred water backgrounds (soft & sweet theme).
for (const [src, name] of [['25.jpg', 'water-sunburst'], ['26.jpg', 'water-turquoise']]) {
  await sharp(`raw/${src}`).resize({ width: 1920 }).webp({ quality: 80 }).toFile(`${out}/${name}.webp`);
  await sharp(`raw/${src}`).resize({ width: 900 }).webp({ quality: 72 }).toFile(`${out}/${name}-sm.webp`);
}
