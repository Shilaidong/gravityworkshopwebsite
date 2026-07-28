"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Suspense,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { Halo } from "@/components/ring/Halo";
import { sampleHaloPose, type Keyframe } from "@/lib/scroll-story";
import { useExperience } from "@/lib/experience-store";

function CameraRig({
  progress,
  frames,
  reducedMotion,
}: {
  progress: number;
  frames: Keyframe[];
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  // r3f drives the camera by direct mutation inside useFrame — that is the
  // library's idiom, not an accidental render-phase write.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    const pose = sampleHaloPose(frames, progress);
    const k = reducedMotion ? 1 : 1 - Math.exp(-delta * 4);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pose.camX, k);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pose.camY, k);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, pose.camZ, k);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, pose.camFov, k);
      camera.updateProjectionMatrix();
    }
    // Only a hint of follow — a stronger coupling re-centres the Halo and
    // cancels the composition authored in each act's pose.
    target.current.set(pose.x * 0.1, pose.y * 0.25, 0);
    camera.lookAt(target.current);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

function SceneFX({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.15} darkness={0.55} />
    </EffectComposer>
  );
}

/**
 * Static stand-in when WebGL is unavailable or the context is lost.
 * The Halo is the protagonist — the site must not degrade to bare type.
 */
function HaloFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] flex items-center justify-center">
      <div className="relative h-[46vmin] w-[46vmin]">
        <div className="absolute inset-0 rounded-full border border-cream/25 shadow-[0_0_80px_-20px_rgba(255,240,225,0.45)]" />
        <div className="absolute inset-[6%] rounded-full border border-teal/45" />
        <div className="absolute inset-[-8%] rounded-full border border-cream/8" />
        <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,246,238,0.10),transparent_65%)]" />
      </div>
    </div>
  );
}

/** probed once per session; snapshot must be stable for useSyncExternalStore */
let webglSupport: boolean | null = null;

function clientWebGLSnapshot() {
  if (webglSupport === null) {
    try {
      const c = document.createElement("canvas");
      webglSupport = Boolean(
        c.getContext("webgl2") ||
          c.getContext("webgl") ||
          c.getContext("experimental-webgl"),
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

function useWebGLSupported() {
  // assume supported on the server so SSR markup matches the common case
  return useSyncExternalStore(noopSubscribe, clientWebGLSnapshot, () => true);
}

export function RingCanvas() {
  const { progress, frames, reducedMotion, isMobile, ready } = useExperience();
  const supported = useWebGLSupported();
  const [lost, setLost] = useState(false);

  const onCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    const el = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      setLost(true);
    };
    const onRestored = () => setLost(false);
    el.addEventListener("webglcontextlost", onLost);
    el.addEventListener("webglcontextrestored", onRestored);
  }, []);

  if (!supported || lost) return <HaloFallback />;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[2] transition-opacity duration-1000 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden
    >
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [0, 0.1, 4.6], fov: 38, near: 0.1, far: 50 }}
        onCreated={onCreated}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        {/* no scene.background — the canvas stays transparent so photo
            stages read through; setting a colour here paints over them */}
        <ambientLight intensity={0.18} />
        <directionalLight
          position={[3.5, 4, 5]}
          intensity={1.1}
          color="#fff6ee"
        />
        <directionalLight
          position={[-4, -1, 2]}
          intensity={0.35}
          color="#7ecfc4"
        />
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.55} />
          <Halo
            progress={progress}
            frames={frames}
            reducedMotion={reducedMotion || isMobile}
            mobile={isMobile}
          />
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={12}
            blur={2.8}
            far={4}
            color="#000000"
          />
          <CameraRig
            progress={progress}
            frames={frames}
            reducedMotion={reducedMotion}
          />
          <SceneFX reducedMotion={reducedMotion || isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
