"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleHaloPose, type Keyframe } from "@/lib/scroll-story";

/**
 * Single premium Halo: dual thin rings, physical materials.
 * No gadgets — just silence and precision.
 */
export function Halo({
  progress,
  frames,
  reducedMotion,
  mobile = false,
}: {
  progress: number;
  frames: Keyframe[];
  reducedMotion: boolean;
  mobile?: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const matOuter = useRef<THREE.MeshPhysicalMaterial>(null);
  const matInner = useRef<THREE.MeshPhysicalMaterial>(null);

  const metal = useMemo(() => new THREE.Color("#c5cdd6"), []);
  const rim = useMemo(() => new THREE.Color("#5ec4b6"), []);

  useFrame((state, delta) => {
    const pose = sampleHaloPose(frames, progress);
    const g = root.current;
    if (!g) return;

    // Single-column mobile layouts leave no room beside the type, so the
    // Halo shrinks and drops out of the reading path.
    const mScale = mobile ? 0.6 : 1;
    const mDrop = mobile ? -1.7 : 0;

    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 5);
    const spin = reducedMotion ? 0 : state.clock.elapsedTime * 0.12;

    g.position.x = THREE.MathUtils.lerp(g.position.x, pose.x, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, pose.y + mDrop, k);
    g.position.z = THREE.MathUtils.lerp(g.position.z, pose.z, k);

    const s = THREE.MathUtils.lerp(g.scale.x, pose.scale * mScale, k);
    g.scale.setScalar(s);

    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pose.rotX, k);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pose.rotY + spin, k);

    const tube = 0.028 + pose.weight * 0.035;
    // outer/inner radius offset via scale of child groups
    if (outer.current) {
      outer.current.scale.set(1, 1, 1);
    }
    if (inner.current) {
      const spread = 1 - pose.spread * 0.12;
      inner.current.scale.setScalar(spread);
      inner.current.rotation.z = pose.spread * 0.8;
    }

    if (matOuter.current) {
      matOuter.current.emissiveIntensity = 0.05 + pose.rim * 0.15;
      matOuter.current.thickness = 0.4 + pose.weight;
    }
    if (matInner.current) {
      matInner.current.emissiveIntensity = 0.2 + pose.rim * 0.55;
      matInner.current.opacity = 0.55 + pose.rim * 0.35;
    }

    // subtle breathing
    if (!reducedMotion && outer.current) {
      const b = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.008;
      outer.current.scale.setScalar(b);
    }

    void tube;
  });

  return (
    <group ref={root}>
      {/* Outer halo — brushed metal */}
      <mesh ref={outer} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.038, 48, 192]} />
        <meshPhysicalMaterial
          ref={matOuter}
          color={metal}
          metalness={0.92}
          roughness={0.28}
          envMapIntensity={1.4}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          emissive={rim}
          emissiveIntensity={0.08}
          reflectivity={1}
        />
      </mesh>

      {/* Inner halo — thinner teal-lit edge */}
      <mesh ref={inner} rotation={[Math.PI / 2, 0.08, 0]}>
        <torusGeometry args={[1.02, 0.014, 32, 160]} />
        <meshPhysicalMaterial
          ref={matInner}
          color="#8fd9cf"
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={1.2}
          emissive={rim}
          emissiveIntensity={0.35}
          transparent
          opacity={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Hairline guide ring — almost invisible */}
      <mesh rotation={[Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[1.32, 0.004, 16, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>

      <pointLight
        color="#9ee8de"
        intensity={0.55}
        distance={6}
        decay={2}
        position={[0.4, 0.6, 1.2]}
      />
      <pointLight
        color="#fff5e8"
        intensity={0.35}
        distance={5}
        decay={2}
        position={[-0.8, -0.3, 0.8]}
      />
    </group>
  );
}
