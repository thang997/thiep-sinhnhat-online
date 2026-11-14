"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh, PointLight } from "three";

/** Ngọn lửa: lập loè khi đang cháy, thu nhỏ dần về 0 khi bị thổi tắt. */
function Flame({ lit }: { lit: boolean }) {
  const flame = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const scale = useRef(lit ? 1 : 0);

  useFrame(({ clock }, dt) => {
    const target = lit ? 1 : 0;
    scale.current += (target - scale.current) * Math.min(1, dt * (lit ? 4 : 9));
    const t = clock.elapsedTime;
    const flicker = lit ? 1 + Math.sin(t * 18) * 0.06 + Math.sin(t * 7.3) * 0.05 : 1;
    if (flame.current) {
      const s = scale.current * flicker;
      flame.current.scale.set(s * 0.9, s * 1.15, s * 0.9);
      flame.current.position.x = lit ? Math.sin(t * 5) * 0.012 : 0;
    }
    if (light.current) light.current.intensity = scale.current * 3.2 * flicker;
  });

  return (
    <group position={[0, 1.62, 0]}>
      <mesh ref={flame}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshBasicMaterial color="#ffb54d" />
      </mesh>
      <pointLight ref={light} color="#ffb070" distance={3} decay={2} />
    </group>
  );
}

/** Bánh kem 2 tầng tông kem — caramel, nến số 1, quay chậm. */
function CakeModel({ lit }: { lit: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });

  // Viền kem chấm bi quanh mép tầng dưới
  const dots = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    return [Math.cos(a) * 1.02, 0.5, Math.sin(a) * 1.02] as const;
  });

  return (
    <group ref={group} position={[0, -0.9, 0]}>
      {/* Đĩa */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.06, 48]} />
        <meshStandardMaterial color="#fffaf3" roughness={0.3} />
      </mesh>
      {/* Tầng dưới */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 48]} />
        <meshStandardMaterial color="#f1e2cc" roughness={0.6} />
      </mesh>
      {dots.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#fffaf3" roughness={0.5} />
        </mesh>
      ))}
      {/* Tầng trên */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.56, 48]} />
        <meshStandardMaterial color="#c9a27e" roughness={0.55} />
      </mesh>
      {/* Lớp kem phủ tầng trên */}
      <mesh position={[0, 1.07, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.04, 48]} />
        <meshStandardMaterial color="#fffaf3" roughness={0.4} />
      </mesh>
      {/* Nến */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.42, 16]} />
        <meshStandardMaterial color="#9fadba" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.53, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.06, 6]} />
        <meshBasicMaterial color="#3d2f25" />
      </mesh>
      <Flame lit={lit} />
    </group>
  );
}

export default function Cake({ lit }: { lit: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.3, 4.8], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => camera.lookAt(0, -0.2, 0)}
      fallback={<div className="grid h-full place-items-center text-6xl">🎂</div>}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <CakeModel lit={lit} />
    </Canvas>
  );
}
