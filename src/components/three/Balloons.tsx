"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";

type BalloonSpec = { x: number; y: number; z: number; color: string; scale: number; phase: number };

/** Bóng bay xếp hai bên mép để không che ảnh bé ở giữa. */
const BALLOONS: BalloonSpec[] = [
  { x: -2.3, y: 1.6, z: -0.5, color: "#f1e4cf", scale: 1.0, phase: 0 },
  { x: -1.7, y: 0.6, z: 0.2, color: "#c9a27e", scale: 0.8, phase: 1.3 },
  { x: -2.6, y: -0.4, z: -1, color: "#b8c4cf", scale: 0.9, phase: 2.1 },
  { x: 2.3, y: 1.3, z: -0.4, color: "#ffffff", scale: 1.0, phase: 0.7 },
  { x: 1.8, y: 0.2, z: 0.3, color: "#e2cfb3", scale: 0.85, phase: 1.9 },
  { x: 2.7, y: -0.8, z: -1, color: "#9fadba", scale: 0.75, phase: 2.8 },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function Balloon({ spec, still }: { spec: BalloonSpec; still: boolean }) {
  const ref = useRef<Group>(null);

  // Dây bóng — dùng THREE.Line qua <primitive> vì thẻ <line> trùng với SVG trong JSX.
  const string = useMemo(() => {
    const pts = Array.from({ length: 12 }, (_, i) => new THREE.Vector3(Math.sin(i * 0.9) * 0.05, -1.15 - i * 0.12, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#a88b70" }));
  }, []);

  // Màn hẹp (điện thoại dọc): kéo bóng ra sát mép và thu nhỏ để không dồn vào giữa che ảnh.
  const vw = useThree((s) => s.viewport.width);
  const narrow = vw < 5;
  const side = Math.sign(spec.x);
  const x = narrow ? side * (vw / 2) + (spec.x - side * 2.3) * 0.8 : spec.x;
  const scale = narrow ? spec.scale * 0.7 : spec.scale;

  useFrame(({ clock }) => {
    if (still || !ref.current) return;
    const t = clock.elapsedTime + spec.phase;
    ref.current.position.y = spec.y + Math.sin(t * 0.8) * 0.15;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.08;
  });

  return (
    <group ref={ref} position={[x, spec.y, spec.z]} scale={scale}>
      <mesh scale={[0.9, 1.08, 0.9]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshStandardMaterial color={spec.color} roughness={0.28} metalness={0.05} />
      </mesh>
      <mesh position={[0, -1.02, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.1, 0.16, 16]} />
        <meshStandardMaterial color={spec.color} roughness={0.4} />
      </mesh>
      <primitive object={string} />
    </group>
  );
}

/** Cảnh 3D bóng bay lơ lửng — nền trang trí phía sau ảnh bé. */
export default function Balloons() {
  const still = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={null}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.8} />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#ffe9d2" />
      {BALLOONS.map((b, i) => (
        <Balloon key={i} spec={b} still={still} />
      ))}
    </Canvas>
  );
}
