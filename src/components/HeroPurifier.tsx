import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import { heroState } from './heroState';

/* ── Aqua 2090 Raga RO purifier, modelled from the product photography ────────
   Scroll choreography (progress 0 → 1):
   0.00–0.22  turns to face you; the shell turns translucent ("x-ray") and the
              four cartridges light up in order
   0.22–0.32  shell solid again, the tap is pressed
   0.30–0.86  pure water pours into the glass, bubbles rise
   0.60–0.86  the backdrop rises from deep water to the calm sea surface
   0.86–1.00  tap released, last drops fall                                     */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Proportions from the reference photos: 1.30 W × 1.66 H × 0.70 D.
const W = 1.3;
const H = 1.66;
const D = 0.7;
const FRONT = D / 2;
const TOP = H / 2;
const BASE = -H / 2;
const SPLIT_X = 0.19; // where the flat left panel meets the ribbed tank
const BAND_Y = -0.37; // top of the lower base band
const TAP_X = 0.29;
const OUTLET = new THREE.Vector3(TAP_X, -0.415, 0.43);
const TRAY_Y = -0.685;
const GLASS_H = 0.2;
const GLASS_MAX = 0.16;
const POSE = { wide: { scale: 1.02, y: 0.08 }, portrait: { scale: 0.66, y: 0.95 } };

function useMaterials() {
  return useMemo(
    () => ({
      // Satin-metallic ABS — the Raga finish has a soft pearlescent sheen.
      shell: new THREE.MeshPhysicalMaterial({
        color: heroState.colour,
        roughness: 0.42,
        metalness: 0.08,
        clearcoat: 0.5,
        clearcoatRoughness: 0.25,
        sheen: 0.6,
        sheenRoughness: 0.5,
        sheenColor: new THREE.Color('#ffffff'),
        transparent: true,
      }),
      seam: new THREE.MeshStandardMaterial({ color: '#0f1114', roughness: 0.7, transparent: true }),
      smoke: new THREE.MeshPhysicalMaterial({
        color: '#22262b',
        transparent: true,
        opacity: 0.84,
        roughness: 0.05,
        clearcoat: 1,
        envMapIntensity: 1.6,
        depthWrite: false,
      }),
      chrome: new THREE.MeshPhysicalMaterial({ color: '#f4f6f8', metalness: 1, roughness: 0.06 }),
      silver: new THREE.MeshPhysicalMaterial({ color: '#e6e9ed', metalness: 0.85, roughness: 0.22, clearcoat: 0.6 }),
      black: new THREE.MeshPhysicalMaterial({ color: '#0d0e10', roughness: 0.2, clearcoat: 1 }),
      podium: new THREE.MeshPhysicalMaterial({ color: '#f4f6f7', roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.3 }),
      gold: new THREE.MeshPhysicalMaterial({ color: '#c6ad7c', metalness: 1, roughness: 0.25 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#f6fcfe',
        transparent: true,
        opacity: 0.2,
        roughness: 0,
        clearcoat: 1,
        envMapIntensity: 2.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: '#d2eff8',
        transmission: 1,
        roughness: 0.03,
        thickness: 0.3,
        ior: 1.33,
        attenuationColor: new THREE.Color('#3f9fc4'),
        attenuationDistance: 0.25,
        envMapIntensity: 0.8,
        clearcoat: 1,
      }),
      sediment: new THREE.MeshPhysicalMaterial({ color: '#f1ede2', roughness: 0.85, sheen: 1 }),
      carbon: new THREE.MeshPhysicalMaterial({ color: '#25272c', roughness: 0.55 }),
      membrane: new THREE.MeshPhysicalMaterial({ color: '#2e66b8', roughness: 0.3, clearcoat: 1 }),
      copper: new THREE.MeshPhysicalMaterial({ color: '#c07a45', metalness: 1, roughness: 0.28 }),
      cap: new THREE.MeshPhysicalMaterial({ color: '#fafafa', roughness: 0.35 }),
    }),
    [],
  );
}

/** Canvas-drawn decals: AQUA 2090 outline wordmark and Raga script. */
function useDecals() {
  const [tex, setTex] = useState<{ logo: THREE.CanvasTexture; raga: THREE.CanvasTexture; led: THREE.CanvasTexture } | null>(null);
  useEffect(() => {
    let alive = true;
    const fonts = document.fonts;
    const ready = fonts ? Promise.all([fonts.load('60px Michroma'), fonts.ready]).catch(() => undefined) : Promise.resolve();
    ready.then(() => {
      const make = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        draw(c.getContext('2d')!);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      };
      // Squared, wide outline wordmark — close to the real AQUA 2090 badge.
      const logo = make(512, 256, (g) => {
        g.strokeStyle = 'rgba(255,255,255,0.96)';
        g.lineJoin = 'round';
        g.textAlign = 'left';
        g.lineWidth = 3.5;
        g.font = '58px Michroma, Jost, sans-serif';
        g.strokeText('AQUA', 150, 98);
        g.lineWidth = 5;
        g.font = '104px Michroma, Jost, sans-serif';
        g.strokeText('2090', 26, 215);
      });
      // LED panel: three status bars with icons, like the real strip.
      const led = make(128, 512, (g) => {
        g.fillStyle = '#0d0e10';
        g.fillRect(0, 0, 128, 512);
        g.strokeStyle = 'rgba(255,255,255,0.55)';
        g.fillStyle = 'rgba(255,255,255,0.55)';
        g.lineWidth = 4;
        // power icon
        g.beginPath();
        g.arc(64, 118, 20, -Math.PI * 0.3, Math.PI * 1.3);
        g.stroke();
        g.fillRect(62, 92, 4, 24);
        // tank icon
        g.strokeRect(46, 262, 36, 34);
        g.fillRect(46, 282, 36, 14);
        // sparkle icon
        g.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2;
          g.moveTo(64, 430);
          g.lineTo(64 + Math.cos(a) * 20, 430 + Math.sin(a) * 20);
        }
        g.stroke();
        g.font = '15px Jost, sans-serif';
        g.textAlign = 'center';
        g.fillText('POWER', 64, 160);
        g.fillText('TANK FULL', 64, 322);
        g.fillText('PURIFYING', 64, 472);
      });
      const raga = make(512, 256, (g) => {
        g.fillStyle = 'rgba(255,255,255,0.95)';
        g.font = 'italic 600 120px "Cormorant Garamond", serif';
        g.fillText('Raga', 60, 150);
        g.font = '600 30px Jost, sans-serif';
        g.fillText('S E R I E S', 120, 200);
      });
      if (alive) setTex({ logo, raga, led });
    });
    return () => {
      alive = false;
    };
  }, []);
  return tex;
}

const streamVertex = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const streamFragment = /* glsl */ `
  uniform float uTime; uniform float uLen;
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main() {
    float fres = pow(1.0 - abs(dot(vN, vV)), 1.6);
    float streak = smoothstep(0.55, 1.0, sin(vUv.y * 70.0 * uLen + uTime * 28.0 + vUv.x * 12.566) * 0.5 + 0.5);
    vec3 col = mix(vec3(0.7, 0.88, 0.95), vec3(1.0), clamp(fres * 0.9 + streak * 0.35, 0.0, 1.0));
    gl_FragColor = vec4(col, 0.35 + fres * 0.6 + streak * 0.12);
  }
`;

function Purifier({ low }: { low: boolean }) {
  const m = useMaterials();
  const tex = useDecals();
  const group = useRef<THREE.Group>(null!);
  const tap = useRef<THREE.Group>(null!);
  const tankWater = useRef<THREE.Mesh>(null!);
  const glassWater = useRef<THREE.Mesh>(null!);
  const glassSurface = useRef<THREE.Mesh>(null!);
  const stream = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Mesh[]>([]);
  const leds = useRef<THREE.MeshBasicMaterial[]>([]);
  const decals = useRef<THREE.MeshBasicMaterial[]>([]);
  const splash = useRef<THREE.Mesh[]>([]);
  const bubbles = useRef<THREE.InstancedMesh>(null!);
  const smooth = useRef(0);
  const flow = useRef({ head: OUTLET.y, tail: OUTLET.y, on: false });
  const target = useMemo(() => new THREE.Color(), []);
  const { pointer, viewport } = useThree();
  const portrait = viewport.aspect < 1;

  const streamUniforms = useMemo(() => ({ uTime: { value: 0 }, uLen: { value: 1 } }), []);
  const bubbleSeeds = useMemo(() => Array.from({ length: 10 }, () => [Math.random(), Math.random(), Math.random()]), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stages = [
    { x: -0.5, mat: m.sediment, glow: '#e8d6aa', at: 0.04 },
    { x: -0.33, mat: m.carbon, glow: '#9fb3c8', at: 0.09 },
    { x: -0.16, mat: m.membrane, glow: '#7fd0ee', at: 0.14 },
    { x: 0.01, mat: m.copper, glow: '#f0b27a', at: 0.19 },
  ];

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    smooth.current = THREE.MathUtils.damp(smooth.current, heroState.progress, 5, dt);
    const p = smooth.current;

    target.set(heroState.colour);
    m.shell.color.lerp(target, 1 - Math.exp(-dt * 5));

    // Pose
    const pose = portrait ? POSE.portrait : POSE.wide;
    const g = group.current;
    const turn = ease(range(p, 0, 0.22));
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, THREE.MathUtils.lerp(-0.62, 0.3, turn) + pointer.x * 0.12, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.02 - pointer.y * 0.03, 4, dt);
    g.scale.setScalar(pose.scale);
    // Gentle float, as if suspended in water.
    g.position.set(portrait ? 0 : Math.min(viewport.width * 0.24, 2.05), pose.y + Math.sin(t * 0.9) * 0.022, 0);
    g.rotation.z = Math.sin(t * 0.6) * 0.012;

    // Camera eases toward the glass while water pours
    const zoom = ease(range(p, 0.28, 0.6)) * (1 - range(p, 0.9, 1) * 0.5);
    const glassY = pose.y + (TRAY_Y + 0.12) * pose.scale;
    state.camera.position.z = THREE.MathUtils.lerp(6.4, portrait ? 5.4 : 4.6, zoom);
    state.camera.position.y = THREE.MathUtils.lerp(0.35, glassY + 0.4, zoom);
    state.camera.lookAt(
      THREE.MathUtils.lerp(g.position.x * 0.6, portrait ? g.position.x + TAP_X * pose.scale : g.position.x * 0.5 + TAP_X * pose.scale, zoom),
      THREE.MathUtils.lerp(portrait ? 0.35 : 0, portrait ? glassY - 0.3 : glassY + 0.08, zoom),
      0,
    );

    // X-ray reveal
    const xray = range(p, 0.02, 0.07) * (1 - range(p, 0.22, 0.28));
    const op = 1 - xray * 0.84;
    m.shell.opacity = op;
    m.shell.depthWrite = op > 0.97;
    m.seam.opacity = op;
    decals.current.forEach((d) => d && (d.opacity = op));
    stages.forEach((st, i) => {
      const mat = rings.current[i]?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.emissiveIntensity = range(p, st.at, st.at + 0.04) * 2.4 * Math.max(xray, 0.25) + (flow.current.on ? 0.3 + Math.sin(t * 6 - i) * 0.2 : 0);
    });

    // Tap pressed (the body-coloured block tilts back, like the real push tap)
    const open = ease(range(p, 0.24, 0.32)) * (1 - ease(range(p, 0.86, 0.94)));
    tap.current.rotation.x = -0.28 * open;

    // Stream with gravity head/tail
    const fill = ease(range(p, 0.32, 0.86));
    const surface = TRAY_Y + 0.02 + fill * GLASS_MAX;
    const f = flow.current;
    const shouldFlow = open > 0.6;
    if (shouldFlow && !f.on) {
      f.on = true;
      f.head = OUTLET.y;
      f.tail = OUTLET.y;
    }
    if (f.on) {
      f.head = Math.max(surface, f.head - dt * 3.5);
      if (!shouldFlow) {
        f.tail -= dt * 3.5;
        if (f.tail <= f.head) f.on = false;
      } else f.tail = OUTLET.y;
    }
    const len = f.tail - f.head;
    stream.current.visible = f.on && len > 0.004;
    stream.current.scale.set(1, Math.max(len, 0.001), 1);
    stream.current.position.set(OUTLET.x, (f.tail + f.head) / 2, OUTLET.z);
    streamUniforms.uTime.value = t;
    streamUniforms.uLen.value = len;
    const hitting = f.on && f.head <= surface + 0.001 && len > 0.015;

    glassWater.current.visible = fill > 0.003;
    glassWater.current.scale.y = Math.max(fill * GLASS_MAX, 0.001);
    glassWater.current.position.y = TRAY_Y + 0.02 + (fill * GLASS_MAX) / 2;
    glassSurface.current.visible = fill > 0.003;
    glassSurface.current.position.y = surface + (hitting ? Math.sin(t * 30) * 0.002 : 0);
    const level = 0.85 - fill * 0.3;
    tankWater.current.scale.y = level;
    tankWater.current.position.y = BAND_Y + 0.01 + level / 2;

    splash.current.forEach((d, i) => {
      if (!d) return;
      const cycle = (t * 2.2 + i / splash.current.length) % 1;
      const a = (i / splash.current.length) * Math.PI * 2;
      d.visible = hitting;
      d.position.set(OUTLET.x + Math.cos(a) * cycle * 0.045, surface + Math.sin(cycle * Math.PI) * 0.035, OUTLET.z + Math.sin(a) * cycle * 0.045);
      d.scale.setScalar(0.007 * (1 - cycle));
    });
    bubbleSeeds.forEach(([a, r, o], i) => {
      const h = fill * GLASS_MAX;
      dummy.position.set(OUTLET.x + Math.cos(a * 6.28) * r * 0.04, TRAY_Y + 0.03 + ((t * (0.1 + o * 0.1) + a) % 1) * h, OUTLET.z + Math.sin(a * 6.28) * r * 0.04);
      dummy.scale.setScalar(fill > 0.05 ? 0.004 + o * 0.004 : 0);
      dummy.updateMatrix();
      bubbles.current.setMatrixAt(i, dummy.matrix);
    });
    bubbles.current.instanceMatrix.needsUpdate = true;

    // LEDs as on the real panel: red (service), white (purifying, pulses), green (tank full)
    const [red, white, green] = leds.current;
    if (red) red.color.setRGB(1, 0.15, 0.12).multiplyScalar(0.9);
    if (white) white.color.setRGB(1, 1, 1).multiplyScalar(f.on || p < 0.22 ? 0.55 + Math.sin(t * 5) * 0.45 : 0.25);
    if (green) green.color.setRGB(0.15, 1, 0.4).multiplyScalar(p > 0.9 || p < 0.02 ? 1 : 0.3);
  });

  const ribXs = Array.from({ length: 6 }, (_, i) => SPLIT_X + 0.028 + i * 0.031);

  return (
    <group ref={group}>
      {/* Pearl podium with a champagne-gold ring */}
      <mesh position={[0.05, BASE - 0.09, 0.1]} material={m.podium}>
        <cylinderGeometry args={[1.15, 1.2, 0.18, 96]} />
      </mesh>
      <mesh position={[0.05, BASE - 0.002, 0.1]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
        <torusGeometry args={[1.15, 0.008, 12, 128]} />
      </mesh>

      {/* Main body (left), base band under the tank, top cap */}
      <RoundedBox args={[SPLIT_X + W / 2, H - 0.1, D]} radius={0.06} smoothness={8} position={[(SPLIT_X - W / 2) / 2, -0.05, 0]} material={m.shell} renderOrder={2} />
      <RoundedBox args={[W / 2 - SPLIT_X, BAND_Y - BASE, D]} radius={0.05} smoothness={6} position={[(SPLIT_X + W / 2) / 2, (BAND_Y + BASE) / 2, 0]} material={m.shell} renderOrder={2} />
      <RoundedBox args={[W + 0.02, 0.11, D + 0.02]} radius={0.05} smoothness={8} position={[0, TOP - 0.055, 0]} material={m.shell} renderOrder={2} />
      <mesh position={[0, TOP - 0.112, FRONT + 0.002]} material={m.seam}>
        <boxGeometry args={[W - 0.06, 0.004, 0.002]} />
      </mesh>

      {/* Raised front panels (upper door + lower band), with natural seams between */}
      <RoundedBox args={[SPLIT_X + W / 2 - 0.06, TOP - 0.13 - BAND_Y - 0.02, 0.02]} radius={0.012} smoothness={4} position={[(SPLIT_X - W / 2) / 2, (TOP - 0.13 + BAND_Y + 0.02) / 2, FRONT + 0.008]} material={m.shell} renderOrder={2} />
      <RoundedBox args={[SPLIT_X + W / 2 - 0.06, BAND_Y - BASE - 0.06, 0.02]} radius={0.012} smoothness={4} position={[(SPLIT_X - W / 2) / 2, (BAND_Y + BASE) / 2 + 0.01, FRONT + 0.008]} material={m.shell} renderOrder={2} />
      <mesh position={[(SPLIT_X - W / 2) / 2, BAND_Y + 0.003, FRONT + 0.004]} material={m.seam}>
        <boxGeometry args={[SPLIT_X + W / 2 - 0.06, 0.005, 0.002]} />
      </mesh>

      {/* Internal cartridges (seen during the x-ray stage) */}
      {stages.map((st, i) => (
        <group key={i} position={[st.x, 0.12, -0.02]}>
          <mesh material={st.mat}>
            <cylinderGeometry args={[0.062, 0.062, 0.78, 32]} />
          </mesh>
          <mesh position={[0, 0.41, 0]} material={m.cap}>
            <cylinderGeometry args={[0.067, 0.067, 0.04, 32]} />
          </mesh>
          <mesh position={[0, -0.41, 0]} material={m.cap}>
            <cylinderGeometry args={[0.067, 0.067, 0.04, 32]} />
          </mesh>
          <mesh ref={(el) => void (el && (rings.current[i] = el))} position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.02, 32]} />
            <meshStandardMaterial color={st.glow} emissive={st.glow} emissiveIntensity={0} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Smoked storage tank — wraps onto the right side, water inside */}
      <mesh ref={tankWater} position={[(SPLIT_X + W / 2) / 2 + 0.01, 0, 0]} material={m.water}>
        <boxGeometry args={[W / 2 - SPLIT_X - 0.05, 1, D - 0.12]} />
      </mesh>
      <RoundedBox
        args={[W / 2 - SPLIT_X - 0.005, TOP - 0.11 - BAND_Y + 0.02, D - 0.04]}
        radius={0.03}
        smoothness={5}
        position={[(SPLIT_X + W / 2) / 2, (TOP - 0.11 + BAND_Y - 0.02) / 2, 0]}
        material={m.smoke}
        renderOrder={5}
      />

      {/* Body-coloured vertical ribs running over the tank's left edge and the base */}
      {ribXs.map((x) => (
        <RoundedBox key={x} args={[0.019, TOP - 0.11 - BASE, 0.04]} radius={0.008} smoothness={4} position={[x, (TOP - 0.11 + BASE) / 2, FRONT - 0.004]} material={m.shell} renderOrder={6} />
      ))}

      {/* Tap: silver loop frame, body-coloured push block, chrome nozzle, black tray */}
      <group position={[TAP_X, 0, FRONT]}>
        {[-0.108, 0.108].map((x) => (
          <mesh key={x} position={[x, -0.455, 0.05]} material={m.silver}>
            <boxGeometry args={[0.016, 0.5, 0.018]} />
          </mesh>
        ))}
        <mesh position={[0, -0.205, 0.05]} material={m.silver}>
          <boxGeometry args={[0.232, 0.016, 0.018]} />
        </mesh>
        {[-0.205, -0.7].map((y) => (
          <mesh key={y} position={[0, y, 0.022]} material={m.silver}>
            <boxGeometry args={[0.232, 0.016, 0.045]} />
          </mesh>
        ))}
        <mesh position={[0, TRAY_Y - 0.012, 0.075]} material={m.black}>
          <boxGeometry args={[0.2, 0.026, 0.13]} />
        </mesh>
        <group ref={tap} position={[0, -0.22, 0.02]}>
          <RoundedBox args={[0.12, 0.13, 0.1]} radius={0.02} smoothness={4} position={[0, -0.075, 0.05]} material={m.shell} />
        </group>
        <mesh position={[0, -0.38, 0.08]} material={m.chrome}>
          <cylinderGeometry args={[0.024, 0.026, 0.07, 28]} />
        </mesh>
        <mesh position={[0, -0.416, 0.08]} material={m.black}>
          <cylinderGeometry args={[0.012, 0.012, 0.004, 16]} />
        </mesh>
      </group>

      {/* LED strip (lower left) */}
      <RoundedBox args={[0.075, 0.28, 0.012]} radius={0.012} smoothness={3} position={[-0.52, -0.6, FRONT + 0.02]} material={m.black} />
      {tex && (
        <mesh position={[-0.52, -0.6, FRONT + 0.0265]}>
          <planeGeometry args={[0.068, 0.272]} />
          <meshBasicMaterial map={tex.led} toneMapped={false} />
        </mesh>
      )}
      {[-0.5, -0.585, -0.67].map((y, i) => (
        <mesh key={y} position={[-0.52, y, FRONT + 0.028]}>
          <boxGeometry args={[0.044, 0.007, 0.002]} />
          <meshBasicMaterial ref={(el) => void (el && (leds.current[i] = el))} toneMapped={false} />
        </mesh>
      ))}

      {/* Logos */}
      {tex && (
        <>
          <mesh position={[-0.36, 0.56, FRONT + 0.0195]} renderOrder={7}>
            <planeGeometry args={[0.36, 0.18]} />
            <meshBasicMaterial ref={(el) => void (el && (decals.current[0] = el))} map={tex.logo} transparent depthWrite={false} toneMapped={false} />
          </mesh>
          <mesh position={[0.0, -0.22, FRONT + 0.0195]} renderOrder={7}>
            <planeGeometry args={[0.22, 0.11]} />
            <meshBasicMaterial ref={(el) => void (el && (decals.current[1] = el))} map={tex.raga} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </>
      )}

      {/* Light streaks catching the smoked tank's front edge and the cap edge */}
      <mesh position={[W / 2 - 0.035, (TOP - 0.11 + BAND_Y) / 2, D / 2 - 0.018]} renderOrder={9}>
        <planeGeometry args={[0.012, TOP - 0.15 - BAND_Y]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[0, TOP - 0.004, FRONT + 0.004]} renderOrder={9}>
        <planeGeometry args={[W - 0.08, 0.006]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Inlet / outlet knobs on the right side */}
      {[-0.6, -0.71].map((y) => (
        <mesh key={y} position={[W / 2 + 0.02, y, 0.18]} rotation={[0, 0, Math.PI / 2]} material={m.black}>
          <cylinderGeometry args={[0.024, 0.024, 0.045, 24]} />
        </mesh>
      ))}

      {/* Glass on the drip tray */}
      <mesh position={[OUTLET.x, TRAY_Y + GLASS_H / 2, OUTLET.z]} material={m.glass} renderOrder={8}>
        <cylinderGeometry args={[0.062, 0.052, GLASS_H, 48, 1, true]} />
      </mesh>
      <mesh position={[OUTLET.x, TRAY_Y + 0.01, OUTLET.z]} material={m.glass} renderOrder={8}>
        <cylinderGeometry args={[0.052, 0.052, 0.02, 48]} />
      </mesh>
      <mesh ref={glassWater} position={[OUTLET.x, TRAY_Y, OUTLET.z]} material={m.water}>
        <cylinderGeometry args={[0.058, 0.05, 1, 48]} />
      </mesh>
      <mesh ref={glassSurface} rotation={[-Math.PI / 2, 0, 0]} position={[OUTLET.x, TRAY_Y, OUTLET.z]}>
        <circleGeometry args={[0.058, 48]} />
        <meshPhysicalMaterial color="#e9f8fc" transparent opacity={0.55} roughness={0} clearcoat={1} envMapIntensity={2} />
      </mesh>
      <instancedMesh ref={bubbles} args={[undefined, undefined, 10]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </instancedMesh>

      <mesh ref={stream} visible={false}>
        <cylinderGeometry args={[0.011, 0.013, 1, 20, 1, true]} />
        <shaderMaterial uniforms={streamUniforms} vertexShader={streamVertex} fragmentShader={streamFragment} transparent depthWrite={false} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} ref={(el) => void (el && (splash.current[i] = el))} visible={false}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.8} roughness={0} />
        </mesh>
      ))}

      <ContactShadows position={[0.05, BASE + 0.002, 0.1]} scale={2.6} blur={2} opacity={0.55} far={1.4} resolution={low ? 256 : 512} color="#0b2236" />
    </group>
  );
}

/* ── Real water photography as a living backdrop ───────────────────────────── */

const backdropVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const backdropFragment = /* glsl */ `
  uniform sampler2D uDeep;
  uniform sampler2D uSurface;
  uniform float uDeepAspect;
  uniform float uSurfaceAspect;
  uniform vec2 uRes;
  uniform vec2 uParallax;
  uniform float uZoom;
  uniform float uMix;
  uniform float uTime;
  varying vec2 vUv;

  vec2 cover(vec2 uv, float imgAspect) {
    float screen = uRes.x / uRes.y;
    vec2 s = vec2(1.0);
    if (screen > imgAspect) s.y = imgAspect / screen; else s.x = screen / imgAspect;
    return (uv - 0.5) * s * uZoom + 0.5 + uParallax;
  }

  // Value noise + fbm for organic, flowing water motion.
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  // Tileable caustic network (iterated trig).
  float caustic(vec2 uv, float t) {
    vec2 p = mod(uv * 6.28318, 6.28318) - 250.0;
    vec2 i = p;
    float c = 1.0;
    for (int n = 0; n < 4; n++) {
      float tt = t * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005)));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    return clamp(pow(abs(c), 8.0), 0.0, 1.0);
  }

  void main() {
    float t = uTime;

    // ── Deep water: domain-warped flow so the whole photo sways and drifts like real water
    vec2 ua = cover(vUv, uDeepAspect);
    vec2 q = vec2(fbm(ua * 3.0 + vec2(0.0, t * 0.12)), fbm(ua * 3.0 + vec2(5.2, -t * 0.1)));
    vec2 flow = (q - 0.5) * 0.022;
    flow.y += sin(ua.x * 9.0 + t * 0.8) * 0.0025;
    vec3 deep = texture2D(uDeep, ua + flow).rgb;
    // slight chromatic shimmer, like light bending through moving water
    deep.r = texture2D(uDeep, ua + flow * 1.25).r;

    float nearSurface = smoothstep(0.35, 1.0, ua.y);
    float cst = caustic(ua * vec2(1.6, 1.1) + flow * 4.0, t * 0.45);
    deep += vec3(0.75, 0.95, 1.0) * cst * 0.32 * nearSurface;

    // swaying sun shafts
    float sway = sin(t * 0.25) * 0.08 + fbm(vec2(ua.x * 2.0, t * 0.1)) * 0.1;
    vec2 sun = vec2(0.66, 1.05);
    float ang = atan(ua.x - sun.x, sun.y - ua.y);
    float shafts = pow(max(0.0, sin(ang * 22.0 + sway * 6.0)), 8.0) * smoothstep(1.1, 0.2, distance(ua, sun));
    shafts *= 0.55 + 0.45 * fbm(vec2(ua.x * 4.0, t * 0.3));
    deep += vec3(0.82, 0.96, 1.0) * shafts * 0.16 * smoothstep(0.05, 1.0, ua.y);

    // flickering highlights where waves break near the top
    float glint = smoothstep(0.82, 0.98, fbm(ua * 14.0 + vec2(t * 0.6, -t * 0.4))) * nearSurface;
    deep += glint * 0.25;

    // ── Sea surface: rolling swell below the horizon, sparkles on the crests
    vec2 ub = cover(vUv, uSurfaceAspect);
    float below = 1.0; // aerial sea: the whole frame is water
    vec2 swell = vec2(
      (fbm(ub * vec2(3.0, 9.0) + vec2(t * 0.15, 0.0)) - 0.5) * 0.012,
      sin(ub.x * 12.0 + ub.y * 40.0 - t * 1.1) * 0.004 + (fbm(ub * 6.0 - t * 0.2) - 0.5) * 0.01
    ) * below;
    vec3 surface = texture2D(uSurface, ub + swell).rgb;
    float sparkle = smoothstep(0.93, 1.0, noise(ub * vec2(160.0, 120.0) + vec2(t * 2.0, -t * 1.4)));
    surface += sparkle * 0.3;
    // sunlight caustics dancing across the shallow turquoise
    surface += vec3(0.85, 1.0, 0.98) * caustic(ub * 1.4 + swell * 3.0, t * 0.35) * 0.18;

    vec3 col = mix(deep, surface, uMix);
    float v = length(vUv - 0.5);
    col *= 1.0 - 0.3 * smoothstep(0.35, 0.85, v);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function WaterBackdrop() {
  const [deep, surface] = useTexture(['/images/water-sunburst.webp', '/images/water-turquoise.webp']);
  const { size, pointer } = useThree();
  const uniforms = useMemo(
    () => ({
      uDeep: { value: deep },
      uSurface: { value: surface },
      uDeepAspect: { value: 2000 / 1500 },
      uSurfaceAspect: { value: 2000 / 1500 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uParallax: { value: new THREE.Vector2() },
      uZoom: { value: 0.92 },
      uMix: { value: 0 },
      uTime: { value: 0 },
    }),
    [deep, surface],
  );
  useEffect(() => {
    // Keep the photo's exact tones: sample raw sRGB values and skip tone mapping.
    [deep, surface].forEach((t) => {
      t.colorSpace = THREE.NoColorSpace;
      t.needsUpdate = true;
    });
  }, [deep, surface]);
  useFrame(({ clock }, dt) => {
    const p = heroState.progress;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uMix.value = THREE.MathUtils.damp(uniforms.uMix.value, ease(range(p, 0.6, 0.86)), 4, dt);
    uniforms.uZoom.value = THREE.MathUtils.damp(uniforms.uZoom.value, 0.92 - ease(range(p, 0.28, 0.6)) * 0.08, 4, dt);
    uniforms.uParallax.value.set(
      THREE.MathUtils.damp(uniforms.uParallax.value.x, -pointer.x * 0.012, 3, dt),
      THREE.MathUtils.damp(uniforms.uParallax.value.y, -pointer.y * 0.01 - p * 0.03, 3, dt),
    );
  });
  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={backdropVertex} fragmentShader={backdropFragment} depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  );
}

const bubbleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  attribute vec3 aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aSeed.x + 3.5, 8.0) - 3.5;
    p.x += sin(uTime * 1.2 + aSeed.y * 6.28) * 0.06;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSeed.z * uPixel * (6.0 / -mv.z);
    vAlpha = smoothstep(-3.5, -2.5, p.y) * smoothstep(4.5, 3.5, p.y);
  }
`;
const bubbleFragment = /* glsl */ `
  uniform float uFade;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float rim = smoothstep(0.32, 0.47, d) * smoothstep(0.5, 0.46, d);
    float core = smoothstep(0.5, 0.0, d) * 0.18;
    float spec = smoothstep(0.12, 0.0, length(c - vec2(-0.16, 0.16)));
    float a = (rim * 0.85 + core + spec * 0.9) * vAlpha * uFade;
    gl_FragColor = vec4(vec3(0.92, 0.98, 1.0), a);
  }
`;

/** Rising bubbles with bright rims and a specular glint, like the reference photo. */
function Bubbles({ count }: { count: number }) {
  const { gl } = useThree();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([Math.random() * 14 - 7, Math.random() * 8 - 3.5, -4 + Math.random() * 5.2], i * 3);
      const big = Math.random() < 0.12;
      seed.set([0.15 + Math.random() * 0.45, Math.random(), big ? 6 + Math.random() * 8 : 1.2 + Math.random() * 3], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    return g;
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixel: { value: gl.getPixelRatio() }, uFade: { value: 1 } }), [gl]);
  useFrame(({ clock }, dt) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uFade.value = THREE.MathUtils.damp(uniforms.uFade.value, 1 - ease(range(heroState.progress, 0.6, 0.86)) * 0.85, 4, dt);
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial uniforms={uniforms} vertexShader={bubbleVertex} fragmentShader={bubbleFragment} transparent depthWrite={false} />
    </points>
  );
}

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  attribute vec3 aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // slow, current-driven drift with gentle eddies
    p.x = mod(p.x + uTime * (0.04 + aSeed.x * 0.08) + 7.0, 14.0) - 7.0;
    p.y += sin(uTime * (0.3 + aSeed.y * 0.4) + aSeed.z * 6.28) * 0.18 + cos(uTime * 0.2 + p.x) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (0.8 + aSeed.z * 1.8) * uPixel * (6.0 / -mv.z);
    vAlpha = 0.25 + aSeed.y * 0.45;
  }
`;
const particleFragment = /* glsl */ `
  uniform float uFade;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vec3(0.9, 0.97, 1.0), smoothstep(0.5, 0.0, d) * vAlpha * uFade);
  }
`;

/** Fine particles suspended and drifting in the current. */
function Suspended({ count }: { count: number }) {
  const { gl } = useThree();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([Math.random() * 14 - 7, Math.random() * 7 - 3, -4.5 + Math.random() * 5.5], i * 3);
      seed.set([Math.random(), Math.random(), Math.random()], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3));
    return g;
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixel: { value: gl.getPixelRatio() }, uFade: { value: 1 } }), [gl]);
  useFrame(({ clock }, dt) => {
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uFade.value = THREE.MathUtils.damp(uniforms.uFade.value, 1 - ease(range(heroState.progress, 0.6, 0.86)), 4, dt);
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial uniforms={uniforms} vertexShader={particleVertex} fragmentShader={particleFragment} transparent depthWrite={false} />
    </points>
  );
}

export default function HeroPurifier() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const low = useMemo(() => window.matchMedia('(max-width: 768px)').matches || (navigator.hardwareConcurrency ?? 8) <= 4, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={low ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.35, 6.4], fov: 30 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}
      >
        <WaterBackdrop />
        <ambientLight intensity={0.18} />
        <hemisphereLight args={['#eaf8ff', '#1d6f96', 0.4]} />
        <directionalLight position={[2, 7, 5]} intensity={1.6} color="#fffaf0" />
        <directionalLight position={[-5, 2, 2]} intensity={0.6} color="#9fdcf0" />
        <spotLight position={[-2, 4, -3]} intensity={16} angle={0.7} penumbra={1} color="#bfe9ff" />
        <Purifier low={low} />
        <Bubbles count={low ? 70 : 170} />
        <Suspended count={low ? 120 : 320} />
        <Environment resolution={low ? 128 : 256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[-5, 1, 3]} rotation-y={Math.PI / 2} scale={[6, 2.5, 1]} color="#cdeefa" />
          <Lightformer form="rect" intensity={1.8} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#f3e3c2" />
          <Lightformer form="ring" intensity={3} position={[2, 2, 6]} scale={2} />
          <mesh scale={30}>
            <sphereGeometry />
            <meshBasicMaterial color="#2b86ad" side={THREE.BackSide} />
          </mesh>
        </Environment>
      </Canvas>
    </div>
  );
}
