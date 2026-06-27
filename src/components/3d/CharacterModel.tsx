import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';

function LavaKingModel({ unit, position, isAttacking, activeSkillName }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/exalted_lava_king.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const attackStartTimeRef = useRef<number | null>(null);

  const auraRef1 = useRef<THREE.Mesh>(null);
  const auraRef2 = useRef<THREE.Mesh>(null);
  const auraRef3 = useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    if (names.length > 0) {
      let animName = names[0];
      const attackAnim = names.find(n => n.toLowerCase().includes('attack') || n.toLowerCase().includes('atk') || n.toLowerCase().includes('slash'));
      const idleAnim = names.find(n => n.toLowerCase().includes('idle') || n.toLowerCase().includes('stand'));

      if (isAttacking && attackAnim) {
         animName = attackAnim;
      } else if (!isAttacking && idleAnim) {
         animName = idleAnim;
      }

      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.2).play();
        return () => { action.fadeOut(0.2); }
      }
    }
  }, [actions, names, isAttacking]);

  const armsRef = useRef<any>({});
  
  const clone = React.useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
            const mat = child.material.clone();
            mat.emissive = new THREE.Color('#4c1d95');
            mat.emissiveIntensity = 0.2;
            child.material = mat;
        }
      }
      
      if (child.isBone) {
         const name = child.name.toLowerCase();
         if (name === 'upperarm_l_063_103' || name === 'upperarm_l') {
            armsRef.current.leftArm = child;
         } else if (name === 'upperarm_r_0107_164' || name === 'upperarm_r') {
            armsRef.current.rightArm = child;
         }
      }
    });
    
    if (armsRef.current.leftArm) armsRef.current.leftArm.rotation.z = -1;
    if (armsRef.current.rightArm) armsRef.current.rightArm.rotation.z = 1;
    
    return c;
  }, [scene]);

  useFrame((state, delta) => {
    if (auraRef1.current) {
      auraRef1.current.rotation.y = state.clock.elapsedTime * 2.5;
      auraRef1.current.rotation.x = state.clock.elapsedTime * 0.8;
    }
    if (auraRef2.current) {
      auraRef2.current.rotation.y = -state.clock.elapsedTime * 2.0;
      auraRef2.current.rotation.z = state.clock.elapsedTime * 1.2;
    }
    if (auraRef3.current) {
      const pulse = 2.0 + Math.sin(state.clock.elapsedTime * 6.0) * 0.3;
      auraRef3.current.scale.set(pulse, pulse, pulse);
    }

    if (groupRef.current) {
        const isEnemy = !unit.isPlayer;
        const scaleRaw = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
        groupRef.current.scale.setScalar(scaleRaw);
        
        if (armsRef.current.leftArm && armsRef.current.rightArm) {
             const time = state.clock.elapsedTime;
             if (isAttacking) {
                  const atkSwing = Math.sin(time * 15) * 0.5;
                  armsRef.current.leftArm.rotation.z = -0.5 + atkSwing;
                  armsRef.current.rightArm.rotation.z = 0.5 - atkSwing;
                  armsRef.current.leftArm.rotation.x = -1;
                  armsRef.current.rightArm.rotation.x = -1;
             } else {
                  const idleBreathingZ = Math.sin(time * 2) * 0.1;
                  const idleBreathingX = Math.cos(time * 2) * 0.1;
                  armsRef.current.leftArm.rotation.z = -1.2 + idleBreathingZ;
                  armsRef.current.rightArm.rotation.z = 1.2 - idleBreathingZ;
                  armsRef.current.leftArm.rotation.x = -0.2 + idleBreathingX;
                  armsRef.current.rightArm.rotation.x = -0.2 + idleBreathingX;
             }
        }
        
        if (unit.isDead) {
          groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -3, 2 * delta);
          groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 2 * delta);
        } else {
          const hoverY = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
          
          if (isAttacking && attackStartTimeRef.current === null) {
              attackStartTimeRef.current = state.clock.elapsedTime;
          } else if (!isAttacking) {
              attackStartTimeRef.current = null;
          }

          if (position !== undefined) {
             if (isAttacking && activeSkillName && activeSkillName.toLowerCase().includes('stomp')) {
                 const elapsed = attackStartTimeRef.current ? (state.clock.elapsedTime - attackStartTimeRef.current) : 0;
                 let targetX = position[0];
                 let targetZ = position[2];
                 let targetY = hoverY;

                 if (elapsed < 0.6) {
                    const t = elapsed / 0.6;
                     targetX = THREE.MathUtils.lerp(position[0], -4, t);
                     targetZ = THREE.MathUtils.lerp(position[2], -2.5, t);
                     targetY = Math.sin(t * Math.PI) * 3;
                 } else if (elapsed < 1.2) {
                     const t = (elapsed - 0.6) / 0.6;
                     targetX = -4;
                     targetZ = THREE.MathUtils.lerp(-2.5, 0, t);
                     targetY = Math.sin(t * Math.PI) * 3;
                 } else if (elapsed < 1.8) {
                     const t = (elapsed - 1.2) / 0.6;
                     targetX = -4;
                     targetZ = THREE.MathUtils.lerp(0, 2.5, t);
                     targetY = Math.sin(t * Math.PI) * 3;
                 } else if (elapsed < 2.4) {
                     const t = (elapsed - 1.8) / 0.6;
                     targetX = THREE.MathUtils.lerp(-4, position[0], t);
                     targetZ = THREE.MathUtils.lerp(2.5, position[2], t);
                     targetY = Math.sin(t * Math.PI) * 3;
                 } else {
                     targetX = position[0];
                     targetZ = position[2];
                     targetY = hoverY;
                 }

                 groupRef.current.position.x = targetX;
                 groupRef.current.position.y = targetY;
                 groupRef.current.position.z = targetZ;
             } else {
                 const targetOffset = isAttacking ? (isEnemy ? position[0]-2 : position[0]+2) : position[0];
                 groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
                 groupRef.current.position.y = hoverY;
                 groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
             }
          }

          if (isAttacking) {
             groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 25) * 0.2;
             const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
             groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 5 * delta);
          } else {
             groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 5 * delta);
             const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
             groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 5 * delta);
          }
        }
    }
  });

  return (
    <group ref={groupRef} position={position || [0, 0, 0]}>
       <primitive object={clone} scale={3.5} position={[0, -0.4, 0]} />
       
       <group position={[0, 1.2, 0]}>
          <mesh ref={auraRef1}>
             <torusGeometry args={[2.5, 0.15, 12, 48]} />
             <meshBasicMaterial color="#ff0000" transparent opacity={0.85} />
          </mesh>
          <mesh ref={auraRef2} rotation={[Math.PI / 2, 0, 0]}>
             <torusGeometry args={[3.0, 0.1, 12, 48]} />
             <meshBasicMaterial color="#ff2222" transparent opacity={0.65} />
          </mesh>
          <mesh ref={auraRef3}>
             <sphereGeometry args={[2.8, 32, 32]} />
             <meshBasicMaterial color="#ff0000" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <pointLight color="#ff0000" intensity={8} distance={15} />
       </group>
    </group>
  );
}

useGLTF.preload('/exalted_lava_king.glb');

function TitanModel({ color }: { color: string }) {
  const haloRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (haloRef.current) haloRef.current.rotation.z = state.clock.elapsedTime * 1.5;
  });
  return (
    <group scale={1.4}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.45, 1.4, 8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0.1]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color="#fef08a" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh ref={haloRef} position={[0, 0.4, -0.55]}>
        <torusGeometry args={[0.7, 0.05, 8, 32]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh position={[0, 0.3, 0.4]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function MinotaurModel() {
  return (
    <group scale={1.3}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 1.3, 0.7]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.95, 0.2]}>
        <boxGeometry args={[0.5, 0.5, 0.6]} />
        <meshStandardMaterial color="#3f1a04" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.35, 1.25, 0.1]} rotation={[0.2, 0, -0.5]}>
        <coneGeometry args={[0.12, 0.6, 8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.35, 1.25, 0.1]} rotation={[0.2, 0, 0.5]}>
        <coneGeometry args={[0.12, 0.6, 8]} />
        <meshStandardMaterial color="#fef08a" roughness={0.5} />
      </mesh>
      <group position={[-0.65, 0.1, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.2]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh castShadow position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.2, 0.5, 0.05]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function GoblinModel() {
  return (
    <group scale={0.7} position={[0, -0.1, 0.15]}>
      <mesh castShadow position={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.3, 0.35, 0.9, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.35, 0.65, 0]} rotation={[0, 0.2, -Math.PI / 4]}>
        <coneGeometry args={[0.06, 0.3, 4]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh castShadow position={[0.35, 0.65, 0]} rotation={[0, -0.2, Math.PI / 4]}>
        <coneGeometry args={[0.06, 0.3, 4]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
    </group>
  );
}

function SkeletonModel() {
  return (
    <group scale={0.95}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2]} />
        <meshStandardMaterial color="#eab308" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.2]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#fef08a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.06, 0.78, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.06, 0.78, 0.14]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function OrcModel() {
  return (
    <group scale={1.25}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.2, 16]} />
        <meshStandardMaterial color="#14532d" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0.15]}>
        <boxGeometry args={[0.48, 0.42, 0.45]} />
        <meshStandardMaterial color="#166534" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.15, 0.65, 0.36]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.05, 0.18, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh castShadow position={[0.15, 0.65, 0.36]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.05, 0.18, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function DragonModel({ color }: { color: string }) {
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const flap = Math.sin(time * 6) * 0.45;
    if (leftWingRef.current) leftWingRef.current.rotation.z = -0.3 + flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = 0.3 - flap;
  });
  return (
    <group scale={1.4} position={[0, 0.1, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.45, 0.4]} rotation={[-Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.8, 12]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.85, 0.65]} rotation={[-Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.55]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <group ref={leftWingRef} position={[-0.45, 0.2, -0.15]}>
        <mesh castShadow position={[-0.55, 0, 0]} rotation={[0.1, 0, -0.3]}>
          <boxGeometry args={[1.1, 0.28, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.45, 0.2, -0.15]}>
        <mesh castShadow position={[0.55, 0, 0]} rotation={[0.1, 0, 0.3]}>
          <boxGeometry args={[1.1, 0.28, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function DemonModel() {
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (leftWingRef.current) leftWingRef.current.rotation.y = -0.5 - Math.sin(time * 2.5) * 0.18;
    if (rightWingRef.current) rightWingRef.current.rotation.y = 0.5 + Math.sin(time * 2.5) * 0.18;
  });
  return (
    <group scale={1.35}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.45, 1.3, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#991b1b" roughness={0.3} />
      </mesh>
      <group ref={leftWingRef} position={[-0.25, 0.4, -0.2]}>
        <mesh castShadow position={[-0.45, 0.15, -0.15]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.9, 0.42, 0.05]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
        </mesh>
      </group>
      <group ref={rightWingRef} position={[0.25, 0.4, -0.2]}>
        <mesh castShadow position={[0.45, 0.15, -0.15]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.9, 0.42, 0.05]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function KrakenModel() {
  const tRefs = useRef<THREE.Group[]>([]);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    tRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.rotation.z = Math.sin(time * 3 + idx * 0.8) * 0.35;
      }
    });
  });
  return (
    <group scale={1.3} position={[0, 0.2, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.62, 32, 16]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.58]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 0.45;
        const z = Math.sin(angle) * 0.45;
        return (
          <group key={i} ref={(el) => { if (el) tRefs.current[i] = el; }} position={[x, -0.45, z]}>
            <mesh castShadow position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.07, 0.12, 0.7, 8]} />
              <meshStandardMaterial color="#6d28d9" roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function GolemModel({ color }: { color: string }) {
  const crystalRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });
  const isCrystal = color.includes('#38bdf8') || color.includes('cyan') || color.toLowerCase().includes('elemental');
  if (isCrystal) {
    return (
      <group scale={1.2} position={[0, 0.15, 0]}>
        <mesh ref={crystalRef} castShadow>
          <octahedronGeometry args={[0.42]} />
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} emissive={color} emissiveIntensity={0.4} />
        </mesh>
      </group>
    );
  }
  return (
    <group scale={1.3} position={[0, 0.1, 0]}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0.15]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
    </group>
  );
}

class GLTFErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function SaitamaGLB({ unit, position, isAttacking, isEnemy, activeSkillName }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/saitama.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const bonesRef = useRef<{
    leftArm?: THREE.Object3D;
    rightArm?: THREE.Object3D;
    leftForearm?: THREE.Object3D;
    rightForearm?: THREE.Object3D;
  }>({});

  React.useEffect(() => {
    if (isAttacking && activeSkillName) {
      const animationName = names.find((n: string) => n.toLowerCase().includes(activeSkillName.toLowerCase())) || names[0];
      const act = actions[animationName];
      if (act) act.reset().play();
    } else if (names.length > 0) {
      const act = actions[names[0]];
      if (act) act.reset().play();
    }
  }, [names, actions, isAttacking, activeSkillName]);

  const clone = React.useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    bonesRef.current = {};
    c.traverse((child: any) => {
      if (child.isBone || child.name) {
        if (child.name.includes('upper_arm.L')) {
          bonesRef.current.leftArm = child;
        } else if (child.name.includes('upper_arm.R')) {
          bonesRef.current.rightArm = child;
        } else if (child.name.includes('forearm.L')) {
          bonesRef.current.leftForearm = child;
        } else if (child.name.includes('forearm.R')) {
          bonesRef.current.rightForearm = child;
        }
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone();
          child.material = mat;
          const name = mat.name;
          if (name === 'skin') {
            mat.color.set('#fcd3bd');
            mat.roughness = 0.6;
          } else if (name === 'skin_shadow') {
            mat.color.set('#fca5a5');
            mat.roughness = 0.6;
          } else if (name === 'white_eye') {
            mat.color.set('#ffffff');
            mat.roughness = 0.3;
          } else if (name === 'black_eye') {
            mat.color.set('#374151');
            mat.roughness = 0.3;
          } else if (name === 'eyebrows') {
            mat.color.set('#111827');
          } else if (name === 'yellow_suit') {
            mat.color.set('#facc15');
            mat.roughness = 0.5;
          } else if (name === 'glove') {
            mat.color.set('#b91c1c');
            mat.roughness = 0.4;
          } else if (name === 'shoe' || name === 'shoe_sole') {
            mat.color.set('#991b1b');
            mat.roughness = 0.4;
          } else if (name === 'cape' || name === 'cape_shadow') {
            mat.color.set('#e2e8f0');
            mat.roughness = 0.6;
          } else if (name === 'cape_button') {
            mat.color.set('#f1f5f9');
            mat.roughness = 0.4;
          } else if (name === 'belt1') {
            mat.color.set('#0f172a');
          } else if (name === 'belt2') {
            mat.color.set('#ca8a04');
          } else if (name === 'zip1' || name === 'zip2') {
            mat.color.set('#94a3b8');
          } else if (name === 'OH_Outline_Material') {
            mat.color.set('#1e293b');
            mat.transparent = true;
            mat.opacity = 0.8;
          } else {
            child.geometry.computeBoundingBox();
            const bbox = child.geometry.boundingBox;
            if (bbox) {
              const center = new THREE.Vector3();
              bbox.getCenter(center);
              if (center.y > 0.6) {
                mat.color.set('#fcd3bd');
              } else {
                mat.color.set('#fca5a5');
              }
            }
          }
        }
      }
    });
    return c;
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        if (isAttacking) {
          groupRef.current.rotation.y = targetRot + Math.sin(state.clock.elapsedTime * 40) * 0.15;
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 20) * 0.1;
        } else {
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot, 10 * delta);
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2.5) * 0.02;
          groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 2.5) * 0.01;
        }
      }
    }

    if (bonesRef.current.leftArm && bonesRef.current.rightArm) {
      if (isAttacking) {
        const isSerious = activeSkillName?.toLowerCase().includes('serious');
        const speed = isSerious ? 80 : 40;
        const amplitude = isSerious ? 0.8 : 0.4;
        const punchCycle = Math.sin(state.clock.elapsedTime * speed);
        if (isEnemy) {
          bonesRef.current.leftArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.z, 0.1, 12 * delta);
          bonesRef.current.leftArm.rotation.y = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.y, -Math.PI / 2 + punchCycle * amplitude, 12 * delta);
          bonesRef.current.leftArm.rotation.x = 0;
          bonesRef.current.rightArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.z, -1.1, 12 * delta);
        } else {
          bonesRef.current.rightArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.z, -0.1, 12 * delta);
          bonesRef.current.rightArm.rotation.y = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.y, Math.PI / 2 + punchCycle * amplitude, 12 * delta);
          bonesRef.current.rightArm.rotation.x = 0;
          bonesRef.current.leftArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.z, 1.1, 12 * delta);
        }
      } else {
        const breathing = Math.sin(state.clock.elapsedTime * 2.5) * 0.03;
        bonesRef.current.leftArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.z, 1.25 + breathing, 8 * delta);
        bonesRef.current.rightArm.rotation.z = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.z, -1.25 - breathing, 8 * delta);
        bonesRef.current.leftArm.rotation.y = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.y, 0, 8 * delta);
        bonesRef.current.rightArm.rotation.y = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.y, 0, 8 * delta);
        bonesRef.current.leftArm.rotation.x = THREE.MathUtils.lerp(bonesRef.current.leftArm.rotation.x, 0.1, 8 * delta);
        bonesRef.current.rightArm.rotation.x = THREE.MathUtils.lerp(bonesRef.current.rightArm.rotation.x, 0.1, 8 * delta);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clone} scale={1.8} />
    </group>
  );
}

function SaitamaProcedural({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.6;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        if (isAttacking) {
          groupRef.current.position.y = 0.6 + Math.sin(state.clock.elapsedTime * 20) * 0.2;
          groupRef.current.rotation.y = targetRot + Math.sin(state.clock.elapsedTime * 40) * 0.15;
        } else {
          groupRef.current.position.y = hoverY;
          groupRef.current.rotation.y = targetRot;
        }
      }
    }

    if (capeRef.current) {
      capeRef.current.rotation.x = -Math.PI / 6 + Math.sin(state.clock.elapsedTime * 12) * 0.15;
      capeRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 8) * 0.08;
    }

    if (auraRef.current) {
      auraRef.current.rotation.y = state.clock.elapsedTime * 4;
      const size = isAttacking ? (1.5 + Math.sin(state.clock.elapsedTime * 30) * 0.15) : (1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      auraRef.current.scale.set(size, size * 1.5, size);
    }

    if (leftArmRef.current && rightArmRef.current) {
      if (isAttacking) {
        leftArmRef.current.position.z = 0.4 + Math.sin(state.clock.elapsedTime * 30) * 0.6;
        rightArmRef.current.position.z = 0.4 + Math.cos(state.clock.elapsedTime * 30) * 0.6;
      } else {
        leftArmRef.current.position.z = 0.4;
        rightArmRef.current.position.z = 0.4;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.25, 1.2, 16]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.36, 0.08, 0.36]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.72, 0.2]}>
          <boxGeometry args={[0.1, 0.03, 0.08]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh ref={capeRef} position={[0, 0.3, -0.28]}>
          <boxGeometry args={[0.7, 1.3, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <group ref={leftArmRef} position={[-0.45, 0.2, 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.45, 0.2, 0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>
      <mesh ref={auraRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  );
}

function SaitamaModel({ unit, position, isAttacking, isEnemy, activeSkillName }: any) {
  return (
    <React.Suspense fallback={<SaitamaProcedural unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />}>
      <GLTFErrorBoundary fallback={<SaitamaProcedural unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />}>
        <SaitamaGLB unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />
      </GLTFErrorBoundary>
    </React.Suspense>
  );
}

function ZenoGLB({ unit, position, isAttacking, isEnemy, activeSkillName }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<{
    leftArm?: THREE.Object3D;
    rightArm?: THREE.Object3D;
  }>({});
  const { scene, animations } = useGLTF('/anyconv_com__zeno.glb');
  const { actions, names } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    console.log("Zeno animations:", names);
    if (isAttacking && activeSkillName) {
      const animationName = names.find((n: string) => n.toLowerCase().includes(activeSkillName.toLowerCase())) || names[0];
      const act = actions[animationName];
      if (act) act.reset().play();
    } else if (names.length > 0) {
      const act = actions[names[0]];
      if (act) act.reset().play();
    }
  }, [names, actions, isAttacking, activeSkillName]);

  const clone = React.useMemo(() => {
    const c = SkeletonUtils.clone(scene);
    c.traverse((child: any) => {
      if (child.isBone) {
        if (child.name.toLowerCase().includes('arm.l')) bonesRef.current.leftArm = child;
        if (child.name.toLowerCase().includes('arm.r')) bonesRef.current.rightArm = child;
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = child.material.clone();
          child.material = mat;
          const name = mat.name;
          if (name === 'Zeno_Blue') {
            mat.color.set('#06b6d4');
            mat.roughness = 0.3;
          } else if (name === 'Zeno_Indigo') {
            mat.color.set('#4338ca');
            mat.roughness = 0.3;
          } else if (name === 'cloth_pink') {
            mat.color.set('#db2777');
            mat.roughness = 0.4;
          } else if (name === 'cloth_yellow') {
            mat.color.set('#eab308');
            mat.roughness = 0.4;
          } else if (name === 'cloth_white') {
            mat.color.set('#f1f5f9');
            mat.roughness = 0.5;
          } else if (name === 'eye_white') {
            mat.color.set('#ffffff');
          } else if (name === 'eye_black') {
            mat.color.set('#000000');
          } else if (name === 'Vanta_Black') {
            mat.color.set('#111827');
          } else if (name === 'Zeno_Grey' || name === 'cloth_grey') {
            mat.color.set('#4b5563');
          } else {
            mat.color.set('#db2777');
          }
        }
      }
    });
    return c;
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 1.5 : position[0] + 1.5) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        
        const wobble = Math.sin(state.clock.elapsedTime * 4) * 0.12;
        const breathScaleY = 1.0 + Math.sin(state.clock.elapsedTime * 5) * 0.04;
        const breathScaleXZ = 1.0 - Math.sin(state.clock.elapsedTime * 5) * 0.02;

        if (isAttacking) {
          groupRef.current.rotation.x = -0.15 + Math.sin(state.clock.elapsedTime * 25) * 0.1;
          groupRef.current.rotation.y = targetRot + Math.sin(state.clock.elapsedTime * 35) * 0.2;
          groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 30) * 0.15;
          const powerScale = 2.4 + Math.sin(state.clock.elapsedTime * 40) * 0.15;
          groupRef.current.scale.set(powerScale, powerScale, powerScale);
          
          if (bonesRef.current.leftArm) bonesRef.current.leftArm.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.5;
          if (bonesRef.current.rightArm) bonesRef.current.rightArm.rotation.z = -Math.sin(state.clock.elapsedTime * 10) * 0.5;
        } else {
          groupRef.current.scale.set(2.0 * breathScaleXZ, 2.0 * breathScaleY, 2.0 * breathScaleXZ);
          groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot + wobble, 10 * delta);
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
          groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 2) * 0.03 + wobble * 0.2;
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clone} />
    </group>
  );
}

function ZenoProcedural({ unit, position, isAttacking, isEnemy, activeSkillName }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const guardianOrbRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.9 + Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 1.5 : position[0] + 1.5) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
        if (isAttacking) {
          const isPowerful = activeSkillName?.toLowerCase().includes('erase') || activeSkillName?.toLowerCase().includes('destroy');
          const speed = isPowerful ? 60 : 30;
          const amplitude = isPowerful ? 0.3 : 0.15;
          groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * amplitude;
          groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed) * amplitude;
        }
      }
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z = state.clock.elapsedTime * 1.5;
      ringRef1.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -state.clock.elapsedTime * 1.8;
      ringRef2.current.rotation.x = state.clock.elapsedTime * 0.6;
    }

    if (guardianOrbRef.current) {
      guardianOrbRef.current.rotation.y = state.clock.elapsedTime * 3.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.52, 0.05]} castShadow>
          <sphereGeometry args={[0.3, 32, 16]} />
          <meshStandardMaterial color="#8b5cf6" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.52, 0.09]} scale={[1.05, 0.9, 1.05]}>
          <sphereGeometry args={[0.27, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.63, 16]} />
          <meshStandardMaterial color="#ec4899" roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.1, 0.01]} scale={[1.02, 1.0, 1.02]}>
          <cylinderGeometry args={[0.12, 0.16, 0.64, 16]} />
          <meshStandardMaterial color="#a855f7" />
        </mesh>
        <mesh position={[-0.25, -0.15, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
        <mesh position={[0.25, -0.15, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      </group>

      <group position={[0, 0.2, 0]}>
        <mesh ref={ringRef1}>
          <torusGeometry args={[1.1, 0.03, 8, 48]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 8, 48]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>

      <group ref={guardianOrbRef} position={[0, 0.3, 0]}>
        <group position={[1.4, 0.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
        </group>
        <group position={[-1.4, -0.1, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
function ZenoModel({ unit, position, isAttacking, isEnemy, activeSkillName }: any) {
  return (
    <React.Suspense fallback={<ZenoProcedural unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />}>
      <GLTFErrorBoundary fallback={<ZenoProcedural unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />}>
        <ZenoGLB unit={unit} position={position} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />
      </GLTFErrorBoundary>
    </React.Suspense>
  );
}

function NarutoProcedural({ unit, position }: any) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  return (
    <group ref={groupRef} position={position}>
        <mesh castShadow>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
    </group>
  );
}





function GokuModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
      }
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = state.clock.elapsedTime * 5;
      const scale = 1.3 + Math.sin(state.clock.elapsedTime * 15) * 0.1;
      auraRef.current.scale.set(scale, scale * 1.6, scale);
    }
    if (leftArmRef.current && rightArmRef.current) {
      if (isAttacking) {
        leftArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(state.clock.elapsedTime * 30) * 0.5;
        rightArmRef.current.rotation.x = -Math.PI / 3 - Math.cos(state.clock.elapsedTime * 30) * 0.5;
      } else {
        leftArmRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        rightArmRef.current.rotation.x = -Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.24, 0.4, 16]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.23, 0.23, 0.08, 16]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        <group ref={headRef} position={[0, 0.95, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#ffedd5" roughness={0.6} />
          </mesh>
          <group position={[0, 0.12, 0]}>
            <mesh position={[0, 0.1, 0.05]} rotation={[0.4, 0, 0]}>
              <coneGeometry args={[0.1, 0.35, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0.12, 0.06, -0.05]} rotation={[0.2, 0, -0.3]}>
              <coneGeometry args={[0.08, 0.3, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.2} />
            </mesh>
            <mesh position={[-0.12, 0.06, -0.05]} rotation={[0.2, 0, 0.3]}>
              <coneGeometry args={[0.08, 0.3, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.2} />
            </mesh>
            <mesh position={[0.06, 0.15, -0.1]} rotation={[0.1, 0, -0.1]}>
              <coneGeometry args={[0.09, 0.32, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.2} />
            </mesh>
            <mesh position={[-0.06, 0.15, -0.1]} rotation={[0.1, 0, 0.1]}>
              <coneGeometry args={[0.09, 0.32, 4]} />
              <meshStandardMaterial color="#facc15" roughness={0.2} />
            </mesh>
          </group>
          <mesh position={[0, 0.03, 0.2]}>
            <boxGeometry args={[0.14, 0.04, 0.02]} />
            <meshBasicMaterial color="#22d3ee" />
          </mesh>
        </group>
        <group ref={leftArmRef} position={[-0.4, 0.55, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 8]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.4, 0.55, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 8]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
        </group>
        <mesh position={[-0.15, -0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.4, 8]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        <mesh position={[0.15, -0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.4, 8]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
      </group>
      <mesh ref={auraRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.95, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.16} wireframe />
      </mesh>
    </group>
  );
}

function IchigoModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const weaponRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 2.8) * 0.04;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
      }
    }
    if (weaponRef.current) {
      if (isAttacking) {
        weaponRef.current.rotation.x = -Math.PI / 2 + Math.sin(state.clock.elapsedTime * 40) * 1.2;
      } else {
        weaponRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = state.clock.elapsedTime * 3;
      const sc = 1.2 + Math.sin(state.clock.elapsedTime * 12) * 0.08;
      auraRef.current.scale.set(sc, sc * 1.7, sc);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.8, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 0.5, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <group position={[0, 0.92, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ffedd5" roughness={0.6} />
          </mesh>
          <group position={[0, 0.1, 0]}>
            <mesh position={[0, 0.06, 0.04]} rotation={[0.4, 0, 0]}>
              <coneGeometry args={[0.09, 0.22, 4]} />
              <meshStandardMaterial color="#f97316" roughness={0.4} />
            </mesh>
            <mesh position={[0.1, 0.04, -0.04]} rotation={[0.2, 0, -0.3]}>
              <coneGeometry args={[0.07, 0.2, 4]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
            <mesh position={[-0.1, 0.04, -0.04]} rotation={[0.2, 0, 0.3]}>
              <coneGeometry args={[0.07, 0.2, 4]} />
              <meshStandardMaterial color="#f97316" />
            </mesh>
          </group>
        </group>
        <group ref={weaponRef} position={[0.38, 0.45, 0.2]}>
          <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 1.4, 0.14]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.03, 0.1, 0.15]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
      <mesh ref={auraRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.12} wireframe />
      </mesh>
    </group>
  );
}

function NarutoModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/naruto_six_path_advance_colors.glb');
  const { actions } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    if (actions) {
       const attackAnim = Object.keys(actions).find(n => n.toLowerCase().includes('attack'));
       const idleAnim = Object.keys(actions).find(n => n.toLowerCase().includes('idle') || n.toLowerCase().includes('stand'));

       const action = isAttacking && attackAnim ? actions[attackAnim] : (idleAnim ? actions[idleAnim] : Object.values(actions)[0]);
       if (action) {
         action.reset().fadeIn(0.2).play();
       }
       return () => { action?.fadeOut(0.2); };
    }
  }, [actions, isAttacking]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={2.0} />
    </group>
  );
}

function LuffyModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const gearCloudRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2.1 : position[0] + 2.1) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
      }
    }
    if (gearCloudRef.current) {
      gearCloudRef.current.rotation.y = state.clock.elapsedTime * 3;
      gearCloudRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (leftArmRef.current && rightArmRef.current) {
      if (isAttacking) {
        leftArmRef.current.scale.set(1, 1, 3.5);
        rightArmRef.current.scale.set(1, 1, 3.5);
        leftArmRef.current.position.z = 0.8 + Math.sin(state.clock.elapsedTime * 35) * 0.4;
        rightArmRef.current.position.z = 0.8 + Math.cos(state.clock.elapsedTime * 35) * 0.4;
      } else {
        leftArmRef.current.scale.set(1, 1, 1);
        rightArmRef.current.scale.set(1, 1, 1);
        leftArmRef.current.position.z = 0.2;
        rightArmRef.current.position.z = 0.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.19, 0.8, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.52, 0.01]} scale={[1.02, 1.0, 1.02]}>
          <cylinderGeometry args={[0.25, 0.2, 0.35, 16]} />
          <meshStandardMaterial color="#ffedd5" />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.24, 0.4, 16]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <group position={[0, 0.94, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ffedd5" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.18, 0.26, 0.06, 16]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 16]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
        <group ref={leftArmRef} position={[-0.4, 0.48, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.4, 0.48, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color="#ffedd5" />
          </mesh>
        </group>
      </group>
      <mesh ref={gearCloudRef} position={[0, 0.6, -0.2]}>
        <torusGeometry args={[0.65, 0.07, 8, 32]} />
        <meshBasicMaterial color="#fce7f3" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function ZoroModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const leftSwordRef = useRef<THREE.Group>(null);
  const rightSwordRef = useRef<THREE.Group>(null);
  const mouthSwordRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/roronoa_zoro.glb');
  const { actions } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    if (actions) {
       const attackAnim = Object.keys(actions).find(n => n.toLowerCase().includes('attack'));
       const idleAnim = Object.keys(actions).find(n => n.toLowerCase().includes('idle') || n.toLowerCase().includes('stand'));

       const action = isAttacking && attackAnim ? actions[attackAnim] : (idleAnim ? actions[idleAnim] : Object.values(actions)[0]);
       if (action) {
         action.reset().fadeIn(0.2).play();
       }
       return () => { action?.fadeOut(0.2); };
    }
  }, [actions, isAttacking]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 2.7) * 0.04;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      }
    }
    if (leftSwordRef.current && rightSwordRef.current && mouthSwordRef.current) {
      if (isAttacking) {
        leftSwordRef.current.rotation.set(-Math.PI / 3 + Math.sin(state.clock.elapsedTime * 35) * 0.8, 0, 0);
        rightSwordRef.current.rotation.set(-Math.PI / 3 - Math.cos(state.clock.elapsedTime * 35) * 0.8, 0, 0);
        mouthSwordRef.current.rotation.set(0, 0, Math.sin(state.clock.elapsedTime * 35) * 0.2);
      } else {
        leftSwordRef.current.rotation.set(Math.PI / 6, 0, 0.2);
        rightSwordRef.current.rotation.set(Math.PI / 6, 0, -0.2);
        mouthSwordRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={2.0} position={[0, -0.5, 0]} />
      <group ref={leftSwordRef} position={[-0.4, 0.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>
      <group ref={rightSwordRef} position={[0.4, 0.6, 0]}>
        <mesh rotation={[Math.PI / 2, 0, -0.5]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
      </group>
      <group ref={mouthSwordRef} position={[0, 0.9, 0.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function SasukeModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const chidoriRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (unit.isDead) {
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, 10 * delta);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 10 * delta);
      } else {
        const hoverY = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        const targetRot = isEnemy ? -Math.PI / 6 : Math.PI / 6;
        const targetOffset = isAttacking ? (isEnemy ? position[0] - 2 : position[0] + 2) : position[0];
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetOffset, 15 * delta);
        groupRef.current.position.y = hoverY;
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], 15 * delta);
        groupRef.current.rotation.y = targetRot;
      }
    }
    if (chidoriRef.current) {
      chidoriRef.current.rotation.y = state.clock.elapsedTime * 15;
      chidoriRef.current.rotation.x = state.clock.elapsedTime * 8;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = state.clock.elapsedTime * 3.5;
      const size = 1.25 + Math.sin(state.clock.elapsedTime * 8) * 0.08;
      auraRef.current.scale.set(size, size * 1.5, size);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.22, 0.8, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.24, 0.4, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.12, 16]} />
          <meshStandardMaterial color="#6b21a8" />
        </mesh>
        <group position={[0, 0.94, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.21, 16, 16]} />
            <meshStandardMaterial color="#ffedd5" roughness={0.6} />
          </mesh>
          <group position={[0, 0.1, 0]}>
            <mesh position={[0, 0.04, 0.04]} rotation={[0.4, 0, 0]}>
              <coneGeometry args={[0.08, 0.2, 4]} />
              <meshStandardMaterial color="#1e1b4b" roughness={0.3} />
            </mesh>
            <mesh position={[0.08, 0.02, -0.04]} rotation={[0.2, 0, -0.3]}>
              <coneGeometry args={[0.07, 0.18, 4]} />
              <meshStandardMaterial color="#1e1b4b" />
            </mesh>
            <mesh position={[-0.08, 0.02, -0.04]} rotation={[0.2, 0, 0.3]}>
              <coneGeometry args={[0.07, 0.18, 4]} />
              <meshStandardMaterial color="#1e1b4b" />
            </mesh>
          </group>
          <mesh position={[0.06, 0.01, 0.19]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-0.06, 0.01, 0.19]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
        </group>
        <group position={[-0.45, 0.4, 0.2]}>
          <mesh ref={chidoriRef}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color="#93c5fd" transparent opacity={0.7} wireframe />
          </mesh>
          <pointLight color="#3b82f6" intensity={4} distance={6} />
        </group>
      </group>
      <mesh ref={auraRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.14} wireframe />
      </mesh>
    </group>
  );
}

function MadaraModel({ unit, position, isAttacking, isEnemy }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/freefire_new_3d_character_madara_uchiha..glb');
  const { actions } = useAnimations(animations, groupRef);

  React.useEffect(() => {
    if (actions) {
       const attackAnim = Object.keys(actions).find(n => n.toLowerCase().includes('attack'));
       const idleAnim = Object.keys(actions).find(n => n.toLowerCase().includes('idle') || n.toLowerCase().includes('stand'));

       const action = isAttacking && attackAnim ? actions[attackAnim] : (idleAnim ? actions[idleAnim] : Object.values(actions)[0]);
       if (action) {
         action.reset().fadeIn(0.2).play();
       }
       return () => { action?.fadeOut(0.2); };
    }
  }, [actions, isAttacking]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={scene} scale={2.0} position={[0, -0.5, 0]} />
    </group>
  );
}

export function CharacterModel({ unit, isEnemy, position, isAttacking, activeSkillName }: { unit: any, isEnemy?: boolean, position?: [number, number, number], isAttacking?: boolean, activeSkillName?: string | null }) {
  const meshRef = useRef<THREE.Group>(null);
  
  const isHero = unit.isPlayer !== undefined ? unit.isPlayer : !isEnemy;
  const color = unit.isDead ? '#333333' : (unit.base.modelColor || (isHero ? '#cbd5e1' : '#ef4444'));
  const modelType = unit.base.modelType || 'sphere';

  const idName = (unit.base.id + ' ' + unit.base.name + ' ' + (unit.base.job || '')).toLowerCase();

  const isZeno = idName.includes('zeno');
  const isSaitama = idName.includes('saitama');
  const isGoku = idName.includes('goku');
  const isIchigo = idName.includes('ichigo');
  
  const isNaruto = idName.includes('naruto') && !idName.includes('new');
  const isNarutoNew = idName.includes('naruto_six_path_new');
  
  const isLuffy = idName.includes('luffy');
  
  const isZoro = idName.includes('zoro') && !idName.includes('new');
  const isZoroNew = idName.includes('roronoa_zoro_new');
  
  const isSasuke = idName.includes('sasuke');
  
  const isMadara = idName.includes('madara') && !idName.includes('new');
  const isMadaraNew = idName.includes('madara_uchiha_new');

  const safePosition = position || [0, 0, 0];

  if (isZeno) {
    return <ZenoModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />;
  }

  if (isSaitama) {
    return <SaitamaModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} activeSkillName={activeSkillName} />;
  }

  if (isGoku) {
    return <GokuModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />;
  }

  if (isIchigo) {
    return <IchigoModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />;
  }

  if (isNaruto || isNarutoNew) {
    return (
      <Suspense fallback={null}>
        <NarutoModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />
      </Suspense>
    );
  }

  if (isLuffy) {
    return <LuffyModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />;
  }

  if (isZoro || isZoroNew) {
    return (
      <Suspense fallback={null}>
        <ZoroModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />
      </Suspense>
    );
  }

  if (isSasuke) {
    return <SasukeModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />;
  }

  if (isMadara || isMadaraNew) {
    return (
      <Suspense fallback={null}>
        <MadaraModel unit={unit} position={safePosition} isAttacking={isAttacking} isEnemy={isEnemy} />
      </Suspense>
    );
  }

  const isGlobalBoss = idName.includes('global_boss') || idName.includes('lava_king');

  if (isGlobalBoss) {
    return <LavaKingModel unit={unit} position={safePosition} isAttacking={isAttacking} activeSkillName={activeSkillName} />;
  }

  const isSlime = idName.includes('slime');
  const isWolf = idName.includes('wolf') || idName.includes('dog');
  const isTitan = idName.includes('titan');
  const isMinotaur = idName.includes('minotaur');
  const isGoblin = idName.includes('goblin');
  const isSkeleton = idName.includes('skeleton');
  const isOrc = idName.includes('orc');
  const isDragon = idName.includes('dragon');
  const isDemon = idName.includes('demon') || idName.includes('devil') || idName.includes('diablo') || idName.includes('overlord') || idName.includes('specter') || idName.includes('horror') || idName.includes('watcher') || idName.includes('wraith') || idName.includes('gargoyle');
  const isGolem = idName.includes('golem') || idName.includes('elemental');
  const isKraken = idName.includes('kraken');

  const isCaster = ['mage', 'cleric', 'nymph', 'healer', 'priest', 'magic'].some(n => idName.includes(n));
  const isArcher = ['archer', 'hunter', 'ranger'].some(n => idName.includes(n));
  const isRogue = ['rogue', 'thief', 'assassin'].some(n => idName.includes(n));

  const isHumanoid = !isSlime && !isWolf && !isDragon && !isTitan && !isMinotaur && !isGoblin && !isSkeleton && !isOrc && !isDemon && !isGolem && !isKraken;

  useFrame((state, delta) => {
    if (meshRef.current) {
       const scaleRaw = 1 + Math.sin((state.clock.elapsedTime * 2)) * 0.02;
       meshRef.current.scale.set(scaleRaw, scaleRaw, scaleRaw);
       
       if (unit.isDead) {
         meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -0.5, 0.1);
         meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.PI/2, 0.1);
       } else if (position !== undefined) {
         const targetOffset = isAttacking ? (isEnemy ? position[0]-2 : position[0]+2) : position[0];
         meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetOffset, 15 * delta);
         
         if (isAttacking) {
             meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.5 + 0.6;
         } else {
             meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.6, 10 * delta);
         }
       }
    }
  });

  if (isSlime) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
         <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
         </mesh>
         {!unit.isDead && (
           <mesh position={[0.2, 0.2, 0.4]}>
             <sphereGeometry args={[0.1, 8, 8]} />
             <meshBasicMaterial color="#000000" />
           </mesh>
         )}
      </group>
    );
  }

  if (isWolf) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
         <mesh castShadow position={[0, -0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 1.2, 8]} />
            <meshStandardMaterial color={color} roughness={0.9} />
         </mesh>
         {!unit.isDead && (
            <mesh castShadow position={[isEnemy ? -0.5 : 0.5, 0.2, 0]}>
               <boxGeometry args={[0.4, 0.4, 0.5]} />
               <meshStandardMaterial color={color} />
            </mesh>
         )}
      </group>
    );
  }

  if (isTitan) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <TitanModel color={color} />
      </group>
    );
  }

  if (isMinotaur) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <MinotaurModel />
      </group>
    );
  }

  if (isGoblin) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <GoblinModel />
      </group>
    );
  }

  if (isSkeleton) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <SkeletonModel />
      </group>
    );
  }

  if (isOrc) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <OrcModel />
      </group>
    );
  }

  if (isDragon) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <DragonModel color={color} />
      </group>
    );
  }

  if (isDemon) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <DemonModel />
      </group>
    );
  }

  if (isGolem) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <GolemModel color={color} />
      </group>
    );
  }

  if (isKraken) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <KrakenModel />
      </group>
    );
  }

  if (isHumanoid) {
    return (
      <group ref={meshRef} position={position || [0, 0, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={unit.isDead ? color : (isEnemy ? "#ef4444" : "#fcd34d")} roughness={0.5} />
        </mesh>
        <mesh castShadow position={[-0.5, 0.2, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh castShadow position={[0.5, 0.2, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.8} />
        </mesh>
        {!unit.isDead && (
           <group position={[0.6, 0.2, 0.4]} rotation={[Math.PI/4, 0, 0]}>
              <mesh castShadow position={[0, -0.4, 0]}>
                 <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                 <meshStandardMaterial color="#8b4513" />
              </mesh>
              {isCaster ? (
                 <mesh castShadow position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 1.5]} />
                    <meshStandardMaterial color="#b45309" />
                 </mesh>
              ) : isArcher ? (
                 <group position={[0, 0.4, 0]}>
                    <mesh castShadow>
                       <torusGeometry args={[0.3, 0.02, 8, 16, Math.PI]} />
                       <meshStandardMaterial color="#8b4513" />
                    </mesh>
                    <mesh castShadow position={[0, 0, 0.15]} rotation={[Math.PI/2, 0, 0]}>
                       <cylinderGeometry args={[0.01, 0.01, 0.6]} />
                       <meshStandardMaterial color="#e2e8f0" />
                    </mesh>
                 </group>
              ) : isRogue ? (
                 <mesh castShadow position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.05, 0.4, 0.02]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
                 </mesh>
              ) : isHero ? (
                 <mesh castShadow position={[0, 0.3, 0]}>
                    <boxGeometry args={[0.1, 1, 0.02]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                 </mesh>
              ) : (
                 <mesh castShadow position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
                    <meshStandardMaterial color="#554433" roughness={0.8} />
                 </mesh>
              )}
           </group>
        )}
      </group>
    );
  }

  return (
    <group ref={meshRef} position={position || [0, 0, 0]}>
       <mesh castShadow>
          {modelType === "box" && <boxGeometry args={[1, 1, 1]} />}
          {modelType === "sphere" && <sphereGeometry args={[0.6, 16, 16]} />}
          {modelType === "cone" && <coneGeometry args={[0.6, 1.2, 16]} />}
          {modelType === "cylinder" && <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />}
          <meshStandardMaterial color={color} roughness={0.7} />
       </mesh>
       {!unit.isDead && (
         <mesh castShadow position={[isEnemy ? -0.4 : 0.4, 0.2, 0]}>
           <sphereGeometry args={[0.2, 8, 8]} />
           <meshBasicMaterial color="#ef4444" />
         </mesh>
       )}
    </group>
  );
}
