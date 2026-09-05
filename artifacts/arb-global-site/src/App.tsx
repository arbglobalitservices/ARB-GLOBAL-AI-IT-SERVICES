import { type ReactNode, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Cloud,
  CreditCard,
  Database,
  Landmark,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  Network,
  Phone,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  featured?: boolean;
};

const plans: Plan[] = [
  { id: '01', name: 'Signal Start', description: 'A focused first move into applied AI.', price: 49999 },
  { id: '02', name: 'Cloud Lift', description: 'Modernize one critical business workflow.', price: 89999 },
  { id: '03', name: 'AI Desk', description: 'A private intelligence layer for your team.', price: 129999 },
  { id: '04', name: 'Ops Pilot', description: 'Automate the work that slows growth.', price: 175000 },
  { id: '05', name: 'Data Current', description: 'Turn fragmented data into decisions.', price: 225000 },
  { id: '06', name: 'Growth Engine', description: 'Intelligent systems built for momentum.', price: 299999, featured: true },
  { id: '07', name: 'Vision Stack', description: 'Computer vision for real-world operations.', price: 375000 },
  { id: '08', name: 'Digital Twin', description: 'Model your next operating advantage.', price: 450000 },
  { id: '09', name: 'Scale Grid', description: 'Cloud architecture for the next chapter.', price: 525000 },
  { id: '10', name: 'Command Centre', description: 'A connected view of the whole business.', price: 650000 },
  { id: '11', name: 'Enterprise AI', description: 'Responsible AI across your organisation.', price: 825000 },
  { id: '12', name: 'Autonomy Lab', description: 'Agents that handle complexity with care.', price: 999999 },
  { id: '13', name: 'Global Fabric', description: 'Systems that move with your markets.', price: 1250000 },
  { id: '14', name: 'Boardroom Build', description: 'A high-trust transformation programme.', price: 1650000 },
  { id: '15', name: 'North Star', description: 'The full ARB partnership for scale.', price: 2200000 },
];

const formatINR = (amount: number) =>
  `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

const formatUSD = (amount: number) =>
  `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(amount / 84))}`;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const dragRef = useRef({ active: false, lastX: 0, longitude: 0 });
  const rotationAdjustRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const ctx = context;
    const stars = Array.from({ length: 190 }, (_, index) => ({
      x: ((index * 73) % 997) / 997,
      y: ((index * 137) % 557) / 557,
      size: index % 11 === 0 ? 1.25 : 0.55 + (index % 3) * 0.25,
      alpha: 0.23 + (index % 6) / 15,
    }));
    const dots = [
      { lat: 51, lon: -0.1, color: '#00f2fe', label: 'LON' },
      { lat: 19, lon: 73, color: '#ffd700', label: 'BOM' },
      { lat: 35, lon: 139, color: '#00f2fe', label: 'TYO' },
      { lat: 40, lon: -74, color: '#ffd700', label: 'NYC' },
      { lat: -33, lon: 151, color: '#00f2fe', label: 'SYD' },
      { lat: 1, lon: 103, color: '#00f2fe', label: 'SIN' },
      { lat: 25, lon: 55, color: '#ffd700', label: 'DXB' },
    ];
    const continents = [
      [[72, -140], [60, -128], [50, -124], [38, -117], [26, -105], [18, -96], [28, -83], [42, -76], [54, -82], [65, -95]],
      [[14, -82], [6, -75], [-5, -78], [-18, -70], [-35, -65], [-55, -70], [-46, -52], [-20, -42], [4, -52]],
      [[70, -10], [61, 4], [52, 28], [41, 39], [30, 30], [18, 42], [5, 35], [-10, 17], [-28, 20], [-35, 4], [-15, -10], [5, -2], [32, -14]],
      [[34, 44], [26, 59], [20, 73], [8, 78], [22, 91], [29, 105], [45, 123], [62, 137], [70, 112], [54, 86], [45, 65]],
      [[-12, 113], [-22, 114], [-37, 130], [-31, 149], [-17, 153], [-10, 140]],
    ];
    const routes = [
      [0, 3], [0, 1], [1, 2], [1, 6], [2, 4], [3, 6], [6, 5], [5, 4], [0, 5],
    ];
    let raf = 0;
    let rotation = -0.52;
    let pulse = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, width * ratio);
      canvas.height = Math.max(1, height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const project = (lat: number, lon: number, centerX: number, centerY: number, radius: number) => {
      const longitude = (lon * Math.PI) / 180 + rotation + rotationAdjustRef.current;
      const latitude = (lat * Math.PI) / 180;
      const x = Math.cos(latitude) * Math.sin(longitude);
      const y = Math.sin(latitude);
      const z = Math.cos(latitude) * Math.cos(longitude);
      return { x: centerX + x * radius, y: centerY - y * radius, z };
    };
    const drawRoute = (a: { lat: number; lon: number }, b: { lat: number; lon: number }, centerX: number, centerY: number, radius: number, routeIndex: number) => {
      ctx.beginPath();
      let visible = false;
      for (let step = 0; step <= 30; step += 1) {
        const t = step / 30;
        const arc = Math.sin(Math.PI * t) * 0.08;
        const point = project(
          a.lat + (b.lat - a.lat) * t + arc * 100,
          a.lon + (b.lon - a.lon) * t,
          centerX,
          centerY,
          radius,
        );
        if (point.z > -0.08) {
          if (!visible) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          visible = true;
        } else {
          visible = false;
        }
      }
      ctx.strokeStyle = routeIndex % 2 === 0 ? 'rgba(0,242,254,.44)' : 'rgba(255,215,0,.44)';
      ctx.lineWidth = 0.85;
      ctx.stroke();
      const movingT = ((pulse * 0.00016 + routeIndex * 0.117) % 1);
      const moving = project(
        a.lat + (b.lat - a.lat) * movingT + Math.sin(Math.PI * movingT) * 8,
        a.lon + (b.lon - a.lon) * movingT,
        centerX,
        centerY,
        radius,
      );
      if (moving.z > -0.05) {
        ctx.beginPath();
        ctx.fillStyle = routeIndex % 2 === 0 ? '#00f2fe' : '#ffd700';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.arc(moving.x, moving.y, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };
    const draw = () => {
      if (!width || !height) resize();
      pulse += 16;
      if (!dragRef.current.active) rotation += 0.0011;
      ctx.clearRect(0, 0, width, height);
      const centerX = width * 0.52;
      const centerY = height * 0.49;
      const radius = Math.min(width, height) * (width < 500 ? 0.38 : 0.39);
      const cursor = pointerRef.current;
      stars.forEach((star) => {
        let x = star.x * width;
        let y = star.y * height;
        const distance = Math.hypot(x - cursor.x, y - cursor.y);
        if (distance < 90) {
          x += ((x - cursor.x) / Math.max(distance, 1)) * (90 - distance) * 0.11;
          y += ((y - cursor.y) / Math.max(distance, 1)) * (90 - distance) * 0.11;
        }
        ctx.fillStyle = `rgba(175,224,234,${star.alpha})`;
        ctx.fillRect(x, y, star.size, star.size);
      });
      const glow = ctx.createRadialGradient(centerX - radius * .26, centerY - radius * .29, radius * .05, centerX, centerY, radius * 1.1);
      glow.addColorStop(0, '#104358');
      glow.addColorStop(.48, '#082638');
      glow.addColorStop(.86, '#041523');
      glow.addColorStop(1, 'rgba(1,7,15,0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();
      for (let line = -60; line <= 60; line += 30) {
        ctx.beginPath();
        for (let step = -90; step <= 90; step += 3) {
          const lat = line + Math.sin((step / 45) + rotation * 1.2) * 2;
          const point = project(lat, step, centerX, centerY, radius);
          if (step === -90) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = 'rgba(81,183,200,.13)';
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      for (let longitude = -150; longitude <= 180; longitude += 30) {
        ctx.beginPath();
        for (let step = -90; step <= 90; step += 3) {
          const point = project(step, longitude, centerX, centerY, radius);
          if (step === -90) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = 'rgba(81,183,200,.12)';
        ctx.lineWidth = .55;
        ctx.stroke();
      }
      continents.forEach((continent) => {
        ctx.beginPath();
        continent.forEach(([lat, lon], index) => {
          const point = project(lat, lon, centerX, centerY, radius);
          if (index === 0) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(24,92,91,.28)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(70,185,176,.21)';
        ctx.lineWidth = .65;
        ctx.stroke();
      });
      routes.forEach(([start, end], index) => drawRoute(dots[start], dots[end], centerX, centerY, radius, index));
      dots.forEach((dot) => {
        const point = project(dot.lat, dot.lon, centerX, centerY, radius);
        if (point.z < -0.08) return;
        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 13;
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.strokeStyle = dot.color === '#ffd700' ? 'rgba(255,215,0,.28)' : 'rgba(0,242,254,.26)';
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -.65, Math.PI * .63);
      ctx.strokeStyle = 'rgba(0,242,254,.5)';
      ctx.lineWidth = 1.15;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 7, -.18, Math.PI * .42);
      ctx.strokeStyle = 'rgba(255,215,0,.42)';
      ctx.lineWidth = .7;
      ctx.stroke();
      raf = window.requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    draw();
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="globe-wrap" data-testid="globe-interactive">
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        aria-label="Interactive global systems map"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
          if (dragRef.current.active) {
            rotationAdjustRef.current += (event.clientX - dragRef.current.lastX) * 0.005;
            dragRef.current.lastX = event.clientX;
          }
        }}
        onPointerLeave={() => { pointerRef.current = { x: -1000, y: -1000 }; }}
        onPointerDown={(event) => {
          dragRef.current = { active: true, lastX: event.clientX, longitude: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          dragRef.current.active = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      />
      <div className="globe-readout"><span className="readout-dot" /> GLOBAL NETWORK / LIVE</div>
      <div className="globe-legend">
        <span className="legend-item"><i className="legend-dot" /> AI ROUTES</span>
        <span className="legend-item"><i className="legend-dot gold" /> CLOUD ROUTES</span>
      </div>
    </div>
  );
}

function ThreeGlobeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const probeCanvas = document.createElement('canvas');
    const hasWebGL = Boolean(
      probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl'),
    );
    if (!hasWebGL) {
      setWebglFailed(true);
      return () => undefined;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return () => undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'three-globe-canvas';
    renderer.domElement.setAttribute('aria-label', 'Interactive 3D globe with live global routes');
    mount.appendChild(renderer.domElement);

    const globe = new THREE.Group();
    scene.add(globe);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const earthTexture = textureLoader.load(
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
      },
    );

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.48, 64, 48),
      new THREE.MeshPhongMaterial({
        color: 0x3a8ca0,
        emissive: 0x061c2b,
        emissiveIntensity: 0.55,
        map: earthTexture,
        shininess: 14,
      }),
    );
    globe.add(earth);

    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.495, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0x55c7d1,
        transparent: true,
        opacity: 0.11,
        wireframe: true,
      }),
    );
    globe.add(wireframe);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.56, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.075,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    );
    globe.add(atmosphere);

    const ambientLight = new THREE.AmbientLight(0x789bad, 1.5);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-3, 2, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x00f2fe, 4, 12);
    rimLight.position.set(3, -1, 4);
    scene.add(rimLight);

    const starGroup = new THREE.Group();
    const starGeometry = new THREE.BufferGeometry();
    const baseStars: Array<{ x: number; y: number; z: number; size: number }> = [];
    const starPositions = new Float32Array(260 * 3);
    const starSizes = new Float32Array(260);
    for (let index = 0; index < 260; index += 1) {
      const angle = index * 2.39996;
      const radius = 2.8 + (index % 19) * 0.11;
      const x = Math.cos(angle) * (radius + (index % 7) * 0.08);
      const y = Math.sin(angle * 1.23) * (radius * 0.65);
      const z = -1.9 - (index % 23) * 0.11;
      baseStars.push({ x, y, z, size: 0.55 + (index % 4) * 0.28 });
      starPositions[index * 3] = x;
      starPositions[index * 3 + 1] = y;
      starPositions[index * 3 + 2] = z;
      starSizes[index] = 0.55 + (index % 4) * 0.28;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGroup.add(
      new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
          color: 0xb2e7ed,
          opacity: 0.62,
          size: 0.028,
          transparent: true,
          sizeAttenuation: true,
        }),
      ),
    );
    scene.add(starGroup);

    const nodes = [
      { lat: 51, lon: -0.1, color: 0x00f2fe },
      { lat: 19, lon: 73, color: 0xffd700 },
      { lat: 35, lon: 139, color: 0x00f2fe },
      { lat: 40, lon: -74, color: 0xffd700 },
      { lat: -33, lon: 151, color: 0x00f2fe },
      { lat: 1, lon: 103, color: 0x00f2fe },
      { lat: 25, lon: 55, color: 0xffd700 },
    ];
    const routes = [
      [0, 3],
      [0, 1],
      [1, 2],
      [1, 6],
      [2, 4],
      [3, 6],
      [6, 5],
      [5, 4],
      [0, 5],
    ] as const;

    const latLonToVector = (lat: number, lon: number, radius = 1.51) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    const routeCurve = (start: (typeof nodes)[number], end: (typeof nodes)[number]) => {
      const from = latLonToVector(start.lat, start.lon);
      const to = latLonToVector(end.lat, end.lon);
      const points = Array.from({ length: 33 }, (_, index) => {
        const progress = index / 32;
        return from
          .clone()
          .lerp(to, progress)
          .normalize()
          .multiplyScalar(1.51 + Math.sin(Math.PI * progress) * 0.2);
      });
      return new THREE.CatmullRomCurve3(points);
    };

    const movers: Array<{ mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number }> = [];
    routes.forEach(([fromIndex, toIndex], routeIndex) => {
      const color = routeIndex % 2 === 0 ? 0x00f2fe : 0xffd700;
      const curve = routeCurve(nodes[fromIndex], nodes[toIndex]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color,
        opacity: 0.47,
        transparent: true,
      });
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
        lineMaterial,
      );
      globe.add(line);

      const glowLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
        new THREE.LineBasicMaterial({ color, opacity: 0.1, transparent: true }),
      );
      glowLine.scale.setScalar(1.018);
      globe.add(glowLine);

      const movingDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 8),
        new THREE.MeshBasicMaterial({ color }),
      );
      globe.add(movingDot);
      movers.push({ mesh: movingDot, curve, offset: routeIndex * 0.11 });
    });

    nodes.forEach((node) => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.043, 14, 10),
        new THREE.MeshBasicMaterial({ color: node.color }),
      );
      marker.position.copy(latLonToVector(node.lat, node.lon, 1.54));
      globe.add(marker);
      const halo = new THREE.Mesh(
        new THREE.RingGeometry(0.065, 0.075, 24),
        new THREE.MeshBasicMaterial({
          color: node.color,
          opacity: 0.55,
          side: THREE.DoubleSide,
          transparent: true,
        }),
      );
      halo.position.copy(marker.position.clone().normalize().multiplyScalar(1.56));
      halo.lookAt(halo.position.clone().multiplyScalar(2));
      globe.add(halo);
    });

    let animationFrame = 0;
    let elapsed = 0;
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      elapsed += 0.012;
      if (!dragRef.current.active) globe.rotation.y += 0.0018;
      globe.rotation.x += (pointerRef.current.y * 0.03 - globe.rotation.x) * 0.025;
      globe.rotation.z += (-pointerRef.current.x * 0.012 - globe.rotation.z) * 0.02;

      movers.forEach(({ mesh, curve, offset }) => {
        mesh.position.copy(curve.getPoint((elapsed * 0.075 + offset) % 1));
      });

      const positions = starGeometry.getAttribute('position') as THREE.BufferAttribute;
      baseStars.forEach((star, index) => {
        const dx = star.x / 4.2 - pointerRef.current.x;
        const dy = star.y / 3.2 - pointerRef.current.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);
        const push = Math.max(0, 0.52 - distance) * 0.44;
        positions.setX(index, star.x + (dx / distance) * push);
        positions.setY(index, star.y + (dy / distance) * push);
      });
      positions.needsUpdate = true;
      starGroup.rotation.z = elapsed * 0.006;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    const canvas = renderer.domElement;
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
      };
      if (dragRef.current.active) {
        globe.rotation.y += (event.clientX - dragRef.current.lastX) * 0.006;
        globe.rotation.x += (event.clientY - dragRef.current.lastY) * 0.003;
        dragRef.current.lastX = event.clientX;
        dragRef.current.lastY = event.clientY;
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      dragRef.current = { active: true, lastX: event.clientX, lastY: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerUp = (event: PointerEvent) => {
      dragRef.current.active = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const onPointerLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      earthTexture.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  if (webglFailed) return <GlobeScene />;

  return (
    <div className="globe-wrap" data-testid="globe-interactive">
      <div ref={mountRef} className="three-globe-mount" />
      <div className="globe-readout"><span className="readout-dot" /> GLOBAL NETWORK / LIVE</div>
      <div className="globe-legend">
        <span className="legend-item"><i className="legend-dot" /> AI ROUTES</span>
        <span className="legend-item"><i className="legend-dot gold" /> CLOUD ROUTES</span>
      </div>
    </div>
  );
}

function PaymentModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const advance = Math.round(plan.price / 2);
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
      data-testid="payment-modal-backdrop"
    >
      <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title" data-testid="payment-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">RESERVE YOUR SLOT</span>
            <h2 id="payment-title">{plan.name}</h2>
          </div>
          <button className="modal-close" aria-label="Close payment modal" data-testid="button-close-payment" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="payment-summary" data-testid="payment-summary">
          <div className="summary-cell"><span>Total project price</span><strong>{formatINR(plan.price)}</strong></div>
          <div className="summary-cell"><span>50% advance today</span><strong className="gold">{formatINR(advance)}</strong></div>
          <div className="summary-cell"><span>Balance after kickoff</span><strong>{formatINR(advance)}</strong></div>
        </div>
        <div className="payment-options">
          <div className="payment-option primary-option">
            <div className="option-title"><CircleDollarSign size={18} /> Cashfree checkout</div>
            <p className="option-description">Secure online checkout. Choose the method that works for your finance team.</p>
            <button className="cashfree-btn" data-testid="button-cashfree-payment" onClick={() => window.alert(`Redirecting to Cashfree secure checkout for ${plan.name}`)}>
              Pay Now Rs {new Intl.NumberFormat('en-IN').format(advance)} via Cashfree
            </button>
            <div className="method-labels" aria-label="Available Cashfree methods">
              <span><Smartphone size={11} /> UPI</span>
              <span><Zap size={11} /> GPay</span>
              <span><Smartphone size={11} /> PhonePe</span>
              <span><CreditCard size={11} /> Paytm</span>
              <span><CreditCard size={11} /> Card</span>
              <span><Landmark size={11} /> Netbanking</span>
            </div>
          </div>
          <div className="payment-option">
            <div className="option-title"><Building2 size={18} /> ACH bank transfer</div>
            <p className="option-description">Prefer a direct transfer? Use these placeholder details and share your confirmation.</p>
            <div className="bank-details" aria-label="Bank transfer details">
              <div><b>Account name</b> ARB Global AI &amp; IT Services</div>
              <div><b>Bank</b> Partner bank — details on invoice</div>
              <div><b>Reference</b> {plan.name.toUpperCase().replaceAll(' ', '-')}</div>
              <div><b>Amount</b> {formatINR(advance)} / 50% advance</div>
            </div>
            <a className="whatsapp-btn" href="https://wa.me/918127968129" target="_blank" rel="noreferrer" data-testid="link-transfer-whatsapp">
              <MessageCircle size={15} /> I Transferred - Send on WhatsApp
            </a>
          </div>
        </div>
        <div className="modal-disclaimer"><ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Your project slot is confirmed after the advance is received and acknowledged by our team.</div>
      </div>
    </div>
  );
}

function Header({ onOpenMenu, menuOpen }: { onOpenMenu: () => void; menuOpen: boolean }) {
  const navigate = (id: string) => scrollToId(id);
  return (
    <header className="topbar">
      <div className="container-x" style={{ display: 'flex', alignItems: 'center', width: 'min(1180px, calc(100% - 40px))' }}>
        <button className="brand-lockup" onClick={() => navigate('top')} aria-label="ARB Global home" data-testid="button-brand-home">
          <span className="brand-mark">A</span>
          <span><span className="brand-name">ARB GLOBAL</span><span className="brand-sub">AI &amp; IT SERVICES</span></span>
        </button>
        <nav className="nav-links" aria-label="Main navigation">
          <button onClick={() => navigate('capabilities')} data-testid="link-capabilities">Capabilities</button>
          <button onClick={() => navigate('signal')} data-testid="link-approach">Approach</button>
          <button onClick={() => navigate('plans')} data-testid="link-plans">Investment</button>
          <button onClick={() => navigate('contact')} data-testid="link-contact">Contact</button>
        </nav>
        <button className="nav-cta" onClick={() => navigate('plans')} data-testid="button-header-cta">Start a conversation <ArrowUpRight size={13} /></button>
        <button className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={onOpenMenu} data-testid="button-mobile-menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </header>
  );
}

function Home() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openPlan = (plan: Plan) => setSelectedPlan(plan);
  const closeModal = () => setSelectedPlan(null);
  const nav = (id: string) => { scrollToId(id); setMenuOpen(false); };
  return (
    <div className="site-shell" id="top">
      <div className="noise" />
      <Header onOpenMenu={() => setMenuOpen((current) => !current)} menuOpen={menuOpen} />
      {menuOpen && (
        <div style={{ position: 'fixed', zIndex: 35, top: 66, left: 0, right: 0, padding: 22, borderBottom: '1px solid rgba(133,167,185,.15)', background: 'rgba(2,6,23,.97)' }}>
          {['capabilities', 'signal', 'plans', 'contact'].map((item) => (
            <button key={item} onClick={() => nav(item)} style={{ display: 'block', width: '100%', padding: '14px 0', textAlign: 'left', border: 0, borderBottom: '1px solid rgba(133,167,185,.11)', background: 'none', color: '#b4cbd2', font: '11px var(--app-font-mono)', textTransform: 'uppercase', letterSpacing: '.12em' }} data-testid={`mobile-link-${item}`}>{item}</button>
          ))}
        </div>
      )}
      <main>
        <section className="hero grid-fade" aria-labelledby="hero-heading">
          <div className="container-x">
            <div className="hero-copy">
              <span className="eyebrow">THE INTELLIGENCE ADVANTAGE / 01</span>
              <h1 id="hero-heading" className="display"><span className="gradient-text">Move faster</span><br />with intelligence.</h1>
              <p className="hero-lede">ARB Global builds the AI, cloud, and intelligent systems that turn ambitious businesses into faster, clearer, more resilient organisations.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => scrollToId('plans')} data-testid="button-hero-explore">Explore the partnership <ArrowRight size={15} /></button>
                <button className="secondary-btn" onClick={() => scrollToId('capabilities')} data-testid="button-hero-capabilities">See our capabilities</button>
              </div>
              <div className="hero-proof">
                <div><strong>24/7</strong>systems thinking</div>
                <div><strong>14+</strong>markets connected</div>
                <div><strong>60 sec</strong>response promise</div>
              </div>
            </div>
          </div>
          <ThreeGlobeScene />
          <div className="hero-bottomline" />
        </section>

        <section className="section services-section" id="capabilities" aria-labelledby="capabilities-heading">
          <div className="container-x">
            <div className="section-head">
              <div><span className="eyebrow">CAPABILITIES / 02</span><h2 id="capabilities-heading" className="section-title">The system behind<br /><span className="gold-text">your next move.</span></h2></div>
              <p className="section-note">We connect strategy to execution, pairing senior thinking with the technical muscle to ship what matters.</p>
            </div>
            <div className="service-grid">
              <article className="service-card"><span className="service-number">01 / 05</span><div className="service-icon"><BrainCircuit size={21} /></div><h3>Applied AI &amp; automation</h3><p>From private copilots to autonomous workflows, we make AI useful inside the way your business already works.</p></article>
              <article className="service-card"><span className="service-number">02 / 05</span><div className="service-icon"><Cloud size={21} /></div><h3>Cloud architecture</h3><p>Secure, observable foundations that scale with the decisions you make next.</p></article>
              <article className="service-card"><span className="service-number">03 / 05</span><div className="service-icon"><Network size={21} /></div><h3>Intelligent systems</h3><p>Bring data, people, and systems into one operating picture.</p></article>
              <article className="service-card"><span className="service-number">04 / 05</span><div className="service-icon"><Database size={21} /></div><h3>Data intelligence</h3><p>Find the signal in your data and put it where decisions happen.</p></article>
              <article className="service-card"><span className="service-number">05 / 05</span><div className="service-icon"><LockKeyhole size={21} /></div><h3>Trust &amp; resilience</h3><p>Security, governance, and reliability built in — never bolted on.</p></article>
            </div>
            <div className="service-ticker"><div className="ticker-panel"><span>OPERATING PRINCIPLE / 001</span><strong>Clarity before complexity.</strong></div><div className="ticker-panel"><span>DELIVERY SIGNAL / NOW</span><strong style={{ color: '#00f2fe' }}>Systems ready for lift-off <ArrowUpRight size={16} style={{ verticalAlign: 'middle', marginLeft: 6 }} /></strong></div></div>
          </div>
        </section>

        <section className="section signal-section" id="signal" aria-labelledby="signal-heading">
          <div className="container-x signal-layout">
            <div className="signal-copy"><span className="eyebrow">OUR APPROACH / 03</span><h2 id="signal-heading">No theatre.<br /><span className="gradient-text">Just signal.</span></h2><p>Good technology work changes what a business can see, decide, and deliver. We stay close to the outcome — and make every technical choice earn its place.</p><ul className="signal-list"><li><Check size={14} /> Senior operators, not layers of handoffs</li><li><Check size={14} /> Built around your reality, not a template</li><li><Check size={14} /> Measurable progress in weeks, not quarters</li></ul></div>
            <div className="system-panel" aria-label="ARB connected systems diagram"><div className="system-core"><Activity size={25} /></div><span className="system-label a">INTELLIGENCE LAYER</span><span className="system-label b">YOUR OPERATING DATA</span><span className="system-label c">DECISION VELOCITY</span><div className="system-caption"><span>ARB / SYSTEM MAP</span><span>STATUS: NOMINAL</span></div></div>
          </div>
        </section>

        <section className="section plans-section" id="plans" aria-labelledby="plans-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">PARTNERSHIP PLANS / 04</span><h2 id="plans-heading" className="section-title">Choose your<br /><span className="gold-text">starting altitude.</span></h2></div><p className="section-note">Every plan begins with a 50% advance. The balance is due after kickoff — when the first signal is clear.</p></div>
            <div className="plan-grid">{plans.map((plan) => <article className={`plan-card${plan.featured ? ' featured' : ''}`} key={plan.id} data-testid={`card-plan-${plan.id}`}><span className="plan-code">ARB / {plan.id}</span>{plan.featured && <span className="plan-ribbon">Most selected</span>}<h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-price">{formatINR(plan.price)} <span>approx. {formatUSD(plan.price)}</span></div><button className="plan-cta" onClick={() => openPlan(plan)} data-testid={`button-book-plan-${plan.id}`}>Book with 50% Advance <ChevronRight size={14} /></button></article>)}</div>
            <div className="pricing-foot"><span><ShieldCheck size={13} style={{ verticalAlign: 'middle', marginRight: 6, color: '#00f2fe' }} /> Transparent scope. Human support. No hidden line items.</span><strong>15 ways to start moving.</strong></div>
          </div>
        </section>

        <section className="section trust-section" aria-labelledby="trust-heading">
          <div className="container-x">
            <div className="section-head"><div><span className="eyebrow">TRUSTED IN MOTION / 05</span><h2 id="trust-heading" className="section-title">Built for people<br />who <span className="gradient-text">mean it.</span></h2></div><p className="section-note">Ambition deserves a technology partner with the range to see the whole board and the discipline to make the next move.</p></div>
            <div className="logo-rail" aria-label="Client sectors"><span>FINTECH</span><span>HEALTH</span><span>LOGISTICS</span><span>RETAIL</span><span>INDUSTRIAL</span></div>
            <div className="quote-grid"><div className="quote-card"><span className="quote-mark">“</span><blockquote>ARB gave us the confidence to stop talking about transformation and start operating differently.</blockquote><cite>— COO, GLOBAL OPERATIONS GROUP</cite></div><div className="response-card"><div><span className="eyebrow">WHEN IT MATTERS</span><strong>60 sec</strong><span>team response promise</span></div><p>Tell us what is slowing you down. We will call, listen, and map a credible first move.</p></div></div>
          </div>
        </section>
      </main>
      <footer className="footer" id="contact">
        <div className="container-x">
          <div className="footer-main"><div className="footer-copy"><span className="eyebrow">THE NEXT SIGNAL</span><h2>Ready when<br /><span className="gold-text">you are.</span></h2><p>Bring us the hard problem, the ambitious deadline, or the system you know should work better.</p></div><div className="footer-contact"><a className="contact-item" href="https://wa.me/918127968129" target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp"><MessageCircle size={16} /> WhatsApp support</a><a className="contact-item" href="tel:+918127968129" data-testid="link-footer-phone"><Phone size={16} /> +91 8127968129</a><a className="contact-item" href="mailto:hello@arbglobal.ai" data-testid="link-footer-email"><Mail size={16} /> hello@arbglobal.ai</a><span className="contact-item"><Sparkles size={16} /> Team will call in 60 sec</span></div></div>
          <div className="footer-bottom"><span>© 2025 ARB GLOBAL AI &amp; IT SERVICES</span><span>AI / CLOUD / INTELLIGENT SYSTEMS</span></div>
        </div>
      </footer>
      {selectedPlan && <PaymentModal plan={selectedPlan} onClose={closeModal} />}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;