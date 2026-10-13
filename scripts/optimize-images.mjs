// Converts the raw images in /raw into high-quality WebP assets in /public/images.
// Quality-first: originals are never downscaled below their native size, small crops are
// upscaled with Lanczos and lightly sharpened so they stay crisp in cards on retina screens.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const out = 'public/images';
await mkdir(out, { recursive: true });

const HQ = { quality: 92, effort: 6, smartSubsample: true };
const webp = (img, file, opts = HQ) => img.webp(opts).toFile(`${out}/${file}.webp`);

// Full creatives / product photos at native resolution.
const full = {
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
for (const [src, name] of Object.entries(full)) {
  await webp(sharp(`raw/${src}`).resize({ width: 1600, withoutEnlargement: true }), name);
}
await webp(sharp('raw/9.jpg').resize({ width: 960, kernel: 'lanczos3' }).sharpen({ sigma: 0.5 }), 'aqua-2090-green-cutout');

// Crops from the banners — upscaled 2× for retina, lightly sharpened.
const crop = async (src, region, name, scale = 2) => {
  const img = sharp(`raw/${src}`).extract(region).resize({ width: Math.round(region.width * scale), kernel: 'lanczos3' }).sharpen({ sigma: 0.6 });
  await webp(img, name);
};
await crop('1.jpg', { left: 265, top: 40, width: 750, height: 450 }, 'zamzam-logo', 1.5);
await crop('2.jpg', { left: 515, top: 390, width: 205, height: 295 }, 'ss-standard-system');
await crop('2.jpg', { left: 735, top: 390, width: 205, height: 295 }, 'ss-hot-normal-system');
await crop('2.jpg', { left: 960, top: 175, width: 290, height: 520 }, 'triple-stage-commercial-ro');
await crop('2.jpg', { left: 0, top: 230, width: 500, height: 470 }, 'water-level-controller');

// Brand emblem: original crop + transparent navy / white variants at 3× for crisp retina logos.
await sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).png().toFile(`${out}/zamzam-emblem.png`);
await sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).resize(64, 89).png().toFile('public/favicon.png');
async function tintedEmblem(rgb, file) {
  const src = sharp('raw/1.jpg').extract({ left: 570, top: 40, width: 140, height: 195 }).resize({ width: 420, kernel: 'lanczos3' });
  const alpha = await src.clone().greyscale().negate().linear(1.6, -40).toColourspace('b-w').raw().toBuffer();
  const { width, height } = await src.clone().raw().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  await sharp({ create: { width, height, channels: 3, background: rgb } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(`${out}/${file}`);
}
await tintedEmblem({ r: 32, g: 38, b: 87 }, 'emblem-navy.png');
await tintedEmblem({ r: 255, g: 255, b: 255 }, 'emblem-white.png');

// Aqua 2090 product shots (studio photos) at native size.
const aqua = { '17.png': 'aqua-2090-purple', '18.png': 'aqua-2090-graphite', '19.png': 'aqua-2090-pink', '20.png': 'aqua-2090-mint', '21.png': 'aqua-2090-sky' };
for (const [src, name] of Object.entries(aqua)) {
  await webp(sharp(`raw/${src}`).flatten({ background: '#ffffff' }), name);
}

// Real water photography — full resolution backgrounds + a lighter version for small uses.
for (const [src, name] of [['25.jpg', 'water-sunburst'], ['26.jpg', 'water-turquoise']]) {
  await webp(sharp(`raw/${src}`), name, { quality: 86, effort: 6, smartSubsample: true });
  await webp(sharp(`raw/${src}`).resize({ width: 1200 }), `${name}-sm`, { quality: 84, effort: 6 });
}

console.log('Images optimised (high quality).');
