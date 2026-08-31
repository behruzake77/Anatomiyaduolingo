"use client";

/**
 * Haqiqiy WebGL 3D maskot — RobotExpressive (MIT litsenziya, three.js rasmiy modeli).
 * Faqat React Three Fiber bilan ishlaydi; bu fayl katta (three.js) chunk sifatida
 * ajratiladi (dynamic import) va Mascot3D tomonidan faqat kerak bo'lganda yuklanadi.
 *
 * Animatsiyalar: Idle, Wave, Dance, Yes, No, ThumbsUp, Jump, Sitting, Punch, ...
 *
 * Model skinned bo'lgani uchun haqiqiy o'lcham runtime'da Box3 bilan o'lchanadi
 * va avtomatik ravishda markazga + mos balandlikka keladi — kamera har doim to'g'ri.
 */

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/3d/mascot.glb";
// CORPUS brend rangi — robotning asosiy materiali shunga bo'yaladi.
const BRAND_COLOR = "#6C5CE7";
// Maqsadli balandlik (canvas balandligiga nisbatan) — model qancha joy egallaydi.
const TARGET_HEIGHT = 1.7;

type Clip = "Idle" | "Wave" | "Dance" | "Yes" | "No" | "ThumbsUp" | "Jump" | "Sitting";

function Robot({ clip, autoSpin }: { clip: Clip; autoSpin: boolean }) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);
  const { camera } = useThree();

  // Modelni avtomatik masshtablash va pastdan yerga qo'yish (Box3 bilan o'lchab).
  const { scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const height = Math.max(size.y, 1e-4);
    const s = TARGET_HEIGHT / height;
    // Markaz gorizontalga, pastki nuqta y=0 ga.
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { scale: s, yOffset: -box.min.y * s };
  }, [scene]);

  useEffect(() => {
    const action = actions[clip];
    if (!action) return;
    action.reset().fadeIn(0.25).play();
    return () => {
      action.fadeOut(0.25);
    };
  }, [clip, actions]);

  // Robotning asosiy materialini CORPUS binafshasiga bo'yash.
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mat = (o as THREE.Mesh).material;
        const mats = Array.isArray(mat) ? mat : [mat];
        mats.forEach((m) => {
          if (m && m.name === "Main" && "color" in m) {
            (m as THREE.MeshStandardMaterial).color.set(BRAND_COLOR);
          }
        });
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (autoSpin && inner.current) {
      inner.current.rotation.y += delta * 0.35;
    }
  });

  // Kamerani model hajmiga moslash.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const dist = Math.max(2.2, (TARGET_HEIGHT * 0.75) / Math.tan((cam.fov * Math.PI) / 360));
    cam.position.set(0, TARGET_HEIGHT * 0.5, dist);
    cam.lookAt(0, TARGET_HEIGHT * 0.45, 0);
    cam.updateProjectionMatrix();
  }, [camera, scale]);

  return (
    <group ref={group}>
      <group ref={inner} scale={scale} position={[0, yOffset, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export function MascotCanvas({ clip = "Idle", autoSpin = true }: { clip?: Clip; autoSpin?: boolean }) {
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(2, window.devicePixelRatio || 1);
  }, []);
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.9, 2.6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 2]} intensity={1.3} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#A29BFE" />
      <Suspense fallback={null}>
        <Robot clip={clip} autoSpin={autoSpin} />
      </Suspense>
      <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={3} blur={2.5} far={1.4} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);

export type { Clip as MascotClip };
