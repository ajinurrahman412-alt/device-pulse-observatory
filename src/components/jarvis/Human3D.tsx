import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

const MODEL = "/models/human.glb";

function Person({ walking, facingLeft, color, working }: { walking: boolean; facingLeft: boolean; color: string; working: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL);
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.frustumCulled = false;
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.emissive = new THREE.Color(color);
        mat.emissiveIntensity = 0.12;
        m.material = mat;
      }
    });
    return c;
  }, [scene, color]);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const name = walking ? "Walk" : "Idle";
    const a = actions[name];
    a?.reset().fadeIn(0.3).play();
    if (a) a.timeScale = walking ? 1.1 : working ? 1.6 : 1;
    return () => {
      a?.fadeOut(0.3);
    };
  }, [walking, working, actions]);

  const target = walking ? (facingLeft ? -Math.PI / 2 : Math.PI / 2) : Math.PI;
  useFrame((_, d) => {
    const g = group.current;
    if (!g) return;
    const diff = Math.atan2(Math.sin(target - g.rotation.y), Math.cos(target - g.rotation.y));
    g.rotation.y += diff * (1 - Math.exp(-8 * Math.min(d, 0.05)));
  });

  return (
    <group ref={group} rotation-y={Math.PI}>
      <primitive object={clone} />
    </group>
  );
}

export default function Human3D(props: { walking: boolean; facingLeft: boolean; color: string; working: boolean }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 1.6, 3.2], fov: 32 }} onCreated={({ camera }) => camera.lookAt(0, 0.9, 0)}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 3]} intensity={2.2} />
      <pointLight position={[-2, 1.5, 1]} intensity={6} color={props.color} />
      <Suspense fallback={null}>
        <Person {...props} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL);
