"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Quality = "high" | "low";

function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (narrow || cores <= 4 || memory <= 4) return "low";
  return "high";
}

function Sculpture({ quality, mobile }: { quality: Quality; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tubular = quality === "high" ? 140 : 72;
  const radial = quality === "high" ? 24 : 10;

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.rotation.y += delta * (mobile ? 0.22 : 0.18);
    node.rotation.x = Math.sin(node.rotation.y * 0.65) * 0.14;
  });

  return (
    <group
      ref={group}
      position={mobile ? [0.15, 0.12, 0] : [0.72, 0.02, 0]}
      scale={mobile ? 1.18 : 1.36}
    >
      <mesh>
        <torusKnotGeometry args={[1.05, 0.3, tubular, radial, 2, 3]} />
        {quality === "high" ? (
          <meshPhysicalMaterial
            color="#f7fbfc"
            metalness={1}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.04}
            iridescence={1}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[180, 520]}
            envMapIntensity={2.4}
          />
        ) : (
          <meshPhysicalMaterial
            color="#e4ebef"
            metalness={0.92}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.16}
            iridescence={0.45}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[80, 240]}
            envMapIntensity={1.2}
          />
        )}
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.2, 0.15]}>
        <torusGeometry args={[1.72, 0.012, 12, quality === "high" ? 140 : 64]} />
        <meshStandardMaterial color="#e6d3a4" metalness={1} roughness={0.28} />
      </mesh>
    </group>
  );
}

function unit(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
}

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 1.8 + unit(index + 1) * 3.2;
      const theta = unit(index + 19) * Math.PI * 2;
      const y = (unit(index + 47) - 0.5) * 4.2;
      data[index * 3] = Math.cos(theta) * radius + 0.8;
      data[index * 3 + 1] = y;
      data[index * 3 + 2] = Math.sin(theta) * radius * 0.65;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data, 3));
    return geo;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.035;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#f4f7f8"
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

const AURORA_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAG = `
  varying vec2 vUv;
  uniform float uTime;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  void main() {
    vec2 uv = vUv;
    float n = noise(uv * 2.2 + vec2(uTime * 0.035, uTime * 0.02));
    float n2 = noise(uv * 3.4 - vec2(uTime * 0.025, 0.15));
    vec3 deep = vec3(0.008, 0.098, 0.125);
    vec3 teal = vec3(0.0, 0.28, 0.36);
    vec3 silver = vec3(0.91, 0.93, 0.95);
    vec3 gold = vec3(0.78, 0.62, 0.35);
    vec3 color = mix(deep, teal, smoothstep(0.2, 0.82, n));
    color = mix(color, silver, smoothstep(0.66, 0.98, n2) * 0.28);
    color += gold * smoothstep(0.82, 1.0, n) * 0.16;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function Aurora() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0, -6]} scale={[22, 12, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        depthWrite={false}
      />
    </mesh>
  );
}

function CameraDrift() {
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const camera = state.camera;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      Math.sin(t * 0.17) * 0.22,
      1.5,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.12 + Math.cos(t * 0.13) * 0.1,
      1.5,
      delta,
    );
    camera.lookAt(0.28, 0, 0);
  });

  return null;
}

function ScrollShift({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      progress.current = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.position.y = THREE.MathUtils.damp(node.position.y, progress.current * 0.85, 2.2, delta);
    node.rotation.z = THREE.MathUtils.damp(node.rotation.z, progress.current * -0.18, 2.2, delta);
  });

  return <group ref={group}>{children}</group>;
}

function PointerParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.current.x = event.clientX / window.innerWidth - 0.5;
      target.current.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    node.position.x = THREE.MathUtils.damp(node.position.x, target.current.x * 0.55, 2.6, delta);
    node.position.y = THREE.MathUtils.damp(node.position.y, -target.current.y * 0.32, 2.6, delta);
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, target.current.x * 0.32, 2.6, delta);
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, target.current.y * 0.16, 2.6, delta);
  });

  return <group ref={group}>{children}</group>;
}

function FpsWatch({ onLow }: { onLow: () => void }) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  const done = useRef(false);

  useFrame((_, delta) => {
    if (done.current) return;
    if (elapsed.current < 0.7) {
      elapsed.current += delta;
      return;
    }
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current < 2.2) return;
    done.current = true;
    const fps = frames.current / (elapsed.current - 0.7);
    if (fps < 5) onLow();
  });

  return null;
}

function Scene({
  quality,
  mobile,
  onLow,
}: {
  quality: Quality;
  mobile: boolean;
  onLow: () => void;
}) {
  return (
    <>
      <color attach="background" args={["#021920"]} />
      <fog attach="fog" args={["#021920", 7, 16]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.85} color="#f4f7f8" groundColor="#0c5168" />
      <directionalLight position={[4, 5, 5]} intensity={3.4} color="#ffffff" />
      <directionalLight position={[-3, -1, 3]} intensity={1.3} color="#e6d3a4" />
      <pointLight position={[1.2, 0.6, 2.2]} intensity={12} color="#ffffff" distance={9} />
      <Aurora />
      <CameraDrift />
      <ScrollShift>
        <PointerParallax>
          <Sculpture quality={quality} mobile={mobile} />
          <Particles count={quality === "high" ? 160 : 48} />
        </PointerParallax>
      </ScrollShift>
      <Environment resolution={128} environmentIntensity={1.6} frames={1}>
        <Lightformer form="circle" intensity={8} color="#ffffff" position={[0, 2, 4]} scale={6} />
        <Lightformer form="ring" intensity={3} color="#e6d3a4" position={[-4, -1, 2]} scale={3} />
        <Lightformer
          form="circle"
          intensity={2.2}
          color="#d5dee4"
          position={[4, 1, -1]}
          scale={4}
        />
      </Environment>
      <FpsWatch onLow={onLow} />
    </>
  );
}

export function HeroScene({ onLow }: { onLow: () => void }) {
  const [quality] = useState(detectQuality);
  const [mobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return (
    <Canvas
      className="h-full w-full touch-pan-y"
      dpr={quality === "high" ? [1, 1.5] : [1, 1.15]}
      camera={{ position: [0.15, 0.12, mobile ? 4.7 : 4.55], fov: mobile ? 38 : 32 }}
      frameloop={hidden ? "demand" : "always"}
      gl={{
        antialias: quality === "high",
        alpha: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#021920");
        gl.toneMappingExposure = 1.35;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onLow();
          },
          { once: true },
        );
      }}
    >
      <Scene quality={quality} mobile={mobile} onLow={onLow} />
    </Canvas>
  );
}
