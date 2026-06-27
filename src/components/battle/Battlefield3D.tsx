import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterModel } from '../3d/CharacterModel';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { formatNumber } from '../../utils';

function UnitMesh({ unit, position, isEnemy, isAttacking, activeSkillName }: { unit: any, position: [number, number, number], isEnemy: boolean, isAttacking: boolean, activeSkillName?: string | null }) {
  return (
    <group>
      <group position={[0, 0, 0]}>
         <CharacterModel unit={unit} isEnemy={isEnemy} position={position} isAttacking={isAttacking} activeSkillName={activeSkillName} />
      </group>
      
      {!unit.isDead && (
        <group position={[position[0], position[1] + 2.2, position[2]]}>
          <Text fontSize={0.2} color="white" anchorY="bottom">
            {unit.base.name}
          </Text>
          <Text fontSize={0.15} color={(unit.currentHp === Infinity || unit.currentHp > (unit.maxHp || 0) / 2) ? "green" : "red"} position={[0, -0.3, 0]} anchorY="bottom">
            {formatNumber(unit.currentHp)} / {formatNumber(unit.maxHp)}
          </Text>
        </group>
      )}
      
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[position[0], 0.01, position[2]]} receiveShadow>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="#000000" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

function BankaiTriangles({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 6;
    }
  });
  return (
    <group ref={groupRef} position={position}>
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 1.2 + Math.sin(6 + i) * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 0.8 + Math.cos(4 + i) * 0.4;
        return (
          <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 4, 0, angle]}>
            <coneGeometry args={[0.3, 0.9, 3]} />
            <meshBasicMaterial color="#0c0d12" transparent opacity={0.95} />
            <mesh scale={[1.15, 1.15, 1.15]}>
              <coneGeometry args={[0.31, 0.91, 3]} />
              <meshBasicMaterial color="#d946ef" wireframe transparent opacity={0.5} />
            </mesh>
          </mesh>
        );
      })}
    </group>
  );
}

function DebrisBox({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startDelay = index * 0.05;
  useFrame((state) => {
    if (meshRef.current) {
      const localTime = state.clock.elapsedTime - startDelay;
      if (localTime > 0) {
        meshRef.current.visible = true;
        const y = 0.05 + Math.min(10, localTime * 15);
        meshRef.current.position.y = y;
        meshRef.current.scale.setScalar(Math.max(0.01, 1 - localTime * 0.5));
        meshRef.current.rotation.x = localTime * 4 + index;
        meshRef.current.rotation.z = localTime * 6;
      } else {
        meshRef.current.visible = false;
      }
    }
  });
  const spreadX = (index % 3 - 1) * 1.5;
  const spreadZ = (Math.floor(index / 3) - 1) * 1.5;
  return (
    <mesh ref={meshRef} position={[spreadX, 0.05, spreadZ]} visible={false}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#64748b" roughness={0.9} />
    </mesh>
  );
}

function TableFlipDebris({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[...Array(8)].map((_, i) => (
        <DebrisBox key={i} index={i} />
      ))}
    </group>
  );
}

function PunchOrb({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startDelay = index * 0.06;
  useFrame((state) => {
    if (meshRef.current) {
      const localTime = state.clock.elapsedTime - startDelay;
      if (localTime > 0 && localTime < 0.6) {
        meshRef.current.visible = true;
        meshRef.current.scale.setScalar(localTime * 4);
      } else {
        meshRef.current.visible = false;
      }
    }
  });
  const offX = (index % 3 - 1) * 0.6;
  const offY = 0.5 + Math.random() * 1.2;
  const offZ = (index % 2 - 0.5) * 0.6;
  return (
    <mesh ref={meshRef} position={[offX, offY, offZ]} visible={false}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
    </mesh>
  );
}

function ConsecutivePunches({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[...Array(12)].map((_, i) => (
        <PunchOrb key={i} index={i} />
      ))}
    </group>
  );
}

function SneezeWave({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.addScalar(0.18);
    }
  });
  return (
    <mesh ref={meshRef} position={[position[0], 1.2, position[2]]}>
      <sphereGeometry args={[0.8, 32, 16]} />
      <meshBasicMaterial color="#e2e8f0" transparent opacity={0.6} wireframe />
    </mesh>
  );
}

function ZenoBlastSpheres({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 15;
    }
  });
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[1, 1, 0]}>
         <sphereGeometry args={[0.4, 8, 8]} />
         <meshBasicMaterial color="#ec4899" />
      </mesh>
      <mesh position={[-1, 1, 0]}>
         <sphereGeometry args={[0.4, 8, 8]} />
         <meshBasicMaterial color="#06b6d4" />
      </mesh>
    </group>
  );
}

function EffectVisual({ type, position }: { type: string, position: [number, number, number] }) {
  const effectRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = React.useState(0);
   
  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (effectRef.current) {
       if (type === 'fire') {
           if (!effectRef.current.userData.init) {
               effectRef.current.position.y = 10;
               effectRef.current.userData.init = true;
           }
           if (effectRef.current.position.y > 0.5) {
               effectRef.current.position.y -= delta * 25;
           } else {
               effectRef.current.scale.multiplyScalar(0.9);
           }
       } else if (type === 'slash') {
           if (!effectRef.current.userData.init) {
               effectRef.current.rotation.y = Math.random() * Math.PI;
               effectRef.current.userData.init = true;
           }
           effectRef.current.rotation.y += delta * 10;
           effectRef.current.scale.multiplyScalar(0.95);
       } else if (type === 'ice') {
           effectRef.current.rotation.y += delta * 2;
           effectRef.current.scale.multiplyScalar(0.98);
       } else if (type === 'dark') {
           effectRef.current.rotation.z -= delta * 3;
           effectRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.1);
       } else if (type === 'kamehameha' || type === 'red_kamehameha') {
           effectRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 40) * 0.15;
           effectRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 40) * 0.15;
       } else if (type === 'fire_breath') {
           effectRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.15;
           effectRef.current.scale.z = 1 + Math.cos(state.clock.elapsedTime * 25) * 0.15;
       } else if (type === 'punch') {
           effectRef.current.scale.addScalar(delta * 12);
       } else if (type === 'serious_punch') {
           effectRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 50) * 0.2;
           effectRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 50) * 0.2;
       } else if (type === 'headbutt') {
           effectRef.current.scale.addScalar(delta * 10);
       } else if (type === 'squirt_gun') {
           effectRef.current.rotation.x += delta * 4;
       } else if (type === 'zeno_disintegrate') {
           effectRef.current.scale.multiplyScalar(0.95);
       } else if (type === 'zeno_judgment') {
           effectRef.current.rotation.y += delta * 2;
       } else if (type === 'zeno_erase') {
           effectRef.current.scale.addScalar(delta * 25);
       }
    }
  });

  if (type === 'fire') {
    return (
      <group position={position}>
        <mesh ref={effectRef}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial color="#ff4500" emissive="#ef4444" emissiveIntensity={1.5} transparent opacity={0.9} />
        </mesh>
      </group>
    );
  }

  if (type === 'kamehameha') {
    return (
      <group position={[0, 1.2, position[2]]}>
        <mesh rotation={[0, 0, Math.PI/2]} ref={effectRef}>
          <cylinderGeometry args={[0.7, 0.7, 14, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI/2]} scale={[1.3, 1.0, 1.3]}>
          <cylinderGeometry args={[0.5, 0.5, 14.2, 12]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.6} wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'red_kamehameha') {
    return (
      <group position={[0, 1.2, position[2]]}>
        <mesh rotation={[0, 0, Math.PI/2]} ref={effectRef}>
          <cylinderGeometry args={[0.8, 0.8, 14, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI/2]} scale={[1.35, 1.0, 1.35]}>
          <cylinderGeometry args={[0.6, 0.6, 14.2, 12]} />
          <meshBasicMaterial color="#fca5a5" transparent opacity={0.7} wireframe />
        </mesh>
        <pointLight color="#ef4444" intensity={8} distance={15} />
      </group>
    );
  }

  if (type === 'bankai') {
    return <BankaiTriangles position={position} />;
  }

  if (type === 'table_flip') {
    return <TableFlipDebris position={position} />;
  }

  if (type === 'consecutive_punches') {
    return <ConsecutivePunches position={position} />;
  }

  if (type === 'sneeze') {
    return <SneezeWave position={position} />;
  }

  if (type === 'zeno_blast') {
    return <ZenoBlastSpheres position={position} />;
  }

  if (type === 'punch') {
    return (
      <group position={[position[0], 1.2, position[2]]}>
        <mesh ref={effectRef}>
          <ringGeometry args={[0.2, 1.8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#ffffff" intensity={5} distance={10} />
      </group>
    );
  }

  if (type === 'serious_punch') {
    return (
      <group position={[0, 1.2, position[2]]}>
        <mesh rotation={[0, 0, Math.PI/2]} ref={effectRef}>
          <cylinderGeometry args={[1.8, 1.8, 14, 16]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.88} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI/2]} scale={[1.2, 1.0, 1.2]}>
          <cylinderGeometry args={[1.5, 1.5, 14.1, 8]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.5} wireframe />
        </mesh>
        <pointLight color="#fbbf24" intensity={15} distance={20} />
      </group>
    );
  }

  if (type === 'headbutt') {
    return (
      <group position={[position[0], 1.2, position[2]]}>
        <mesh ref={effectRef}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.7} wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'squirt_gun') {
    return (
      <group position={[0, 1.2, position[2]]}>
        <mesh rotation={[0, 0, Math.PI/2]} ref={effectRef}>
          <cylinderGeometry args={[0.3, 0.3, 14, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    );
  }

  if (type === 'zeno_spark') {
    return (
      <group position={position}>
        {[...Array(6)].map((_, i) => (
           <mesh key={i} position={[(i % 2 === 0 ? 1 : -1) * 0.8, 0.5 + i * 0.4, (i % 3 === 0 ? 1 : -1) * 0.8]} rotation={[i, i * 2, 0]} scale={[0.22, 0.22, 0.22]}>
              <boxGeometry />
              <meshBasicMaterial color="#facc15" />
           </mesh>
        ))}
      </group>
    );
  }

  if (type === 'zeno_disintegrate') {
    return (
      <group position={position} ref={effectRef as any}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color="#4c1d95" transparent opacity={0.8} />
        </mesh>
      </group>
    );
  }

  if (type === 'zeno_judgment') {
    return (
      <group position={position} ref={effectRef as any}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[2.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} wireframe />
        </mesh>
        <mesh position={[0, 0.5, 0]} scale={[0.95, 0.95, 0.95]}>
          <sphereGeometry args={[2.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#ec4899" transparent opacity={0.2} />
        </mesh>
      </group>
    );
  }

  if (type === 'zeno_erase') {
    return (
      <group position={position} ref={effectRef as any}>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
        </mesh>
        <mesh position={[0, 1.2, 0]} scale={[1.1, 1.1, 1.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'fire_breath') {
    return (
      <group position={[position[0] + 1.8, 1.2, position[2]]}>
        <mesh rotation={[0, 0, Math.PI/2]} ref={effectRef}>
          <coneGeometry args={[1.4, 4.5, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI/2]} scale={[1.15, 1.0, 1.15]} position={[0, 0.1, 0]}>
          <coneGeometry args={[1.2, 4.6, 12]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.6} wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'ice') {
    return (
      <group position={position} ref={effectRef as any}>
        <mesh position={[0, 1.5, 0]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'dark') {
    return (
      <group position={position} ref={effectRef as any}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial color="#581c87" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 1, 0]} scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[1.2, 8, 8]} />
          <meshBasicMaterial color="#000000" wireframe />
        </mesh>
      </group>
    );
  }

  if (type === 'slash' || type === 'heal') {
    return (
      <group position={[position[0], position[1] + 1, position[2]]}>
        <mesh ref={effectRef} rotation={[Math.PI/2, 0, 0]}>
          <planeGeometry args={[type === 'slash' ? 3 : 2, type === 'slash' ? 0.3 : 2]} />
          <meshBasicMaterial color={type === 'slash' ? "#ffffff" : "#4ade80"} transparent opacity={0.8} />
        </mesh>
      </group>
    );
  }

  if (type === 'meteor') {
    return (
      <group position={position}>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[1.6, 2.0, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.06, 0]}>
          <circleGeometry args={[1.6, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
        {[...Array(8)].map((_, i) => (
           <MeteorDrop key={i} delay={i * 0.4} />
        ))}
      </group>
    );
  }

  if (type === 'saitama_300_punches') {
    return <Saitama300Punches position={position} />;
  }

  if (type === 'zeno_300_erasures') {
    return <Zeno300Erasures position={position} />;
  }

  if (type === 'supernova_collapse') {
    return <SupernovaCollapse position={position} />;
  }

  return null;
}

function PunchFall({ delay }: { delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = React.useState(0);
  const offset = React.useMemo(() => [
    (Math.random() - 0.5) * 3.5,
    (Math.random() - 0.5) * 3.5
  ], []);

  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (meshRef.current) {
      if (time > delay) {
        const activeTime = time - delay;
        const y = Math.max(0.5, 12 - (activeTime * 40));
        meshRef.current.position.y = y;
        meshRef.current.visible = true;
        if (y <= 0.5) {
          meshRef.current.scale.multiplyScalar(0.7);
          if (ringRef.current) {
            ringRef.current.visible = true;
            ringRef.current.scale.addScalar(delta * 8);
          }
        }
      } else {
        meshRef.current.visible = false;
        if (ringRef.current) ringRef.current.visible = false;
      }
    }
  });

  return (
    <group position={[offset[0], 0, offset[1]]}>
      <mesh ref={meshRef} position={[0, 12, 0]} visible={false}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} visible={false}>
        <ringGeometry args={[0.1, 0.6, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Saitama300Punches({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.8, 2.5, 32]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.9} />
      </mesh>
      {[...Array(40)].map((_, i) => (
        <PunchFall key={i} delay={i * 0.06} />
      ))}
    </group>
  );
}

function ErasedUniverse({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / 30) * Math.PI * 2 + Math.random() * 0.5;
  const radius = 0.5 + Math.random() * 2.5;
  const speed = 2 + Math.random() * 4;
  const y = 0.3 + Math.random() * 2.5;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + index;
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.scale.setScalar(0.4 + Math.sin(state.clock.elapsedTime * 15 + index) * 0.2);
    }
  });

  const colors = ["#c084fc", "#22d3ee", "#e879f9", "#ffffff"];
  const color = colors[index % colors.length];

  return (
    <mesh ref={meshRef} position={[0, y, 0]}>
      <octahedronGeometry args={[0.25, 0]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function Zeno300Erasures({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} wireframe />
      </mesh>
      <mesh position={[0, 1.2, 0]} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2.2, 8, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.08} />
      </mesh>
      {[...Array(30)].map((_, i) => (
        <ErasedUniverse key={i} index={i} />
      ))}
    </group>
  );
}

function SupernovaCollapse({ position }: { position: [number, number, number] }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = React.useState(0);

  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (coreRef.current) {
      if (time < 1.0) {
        const sc = 4 * (1 - time);
        coreRef.current.scale.setScalar(Math.max(0.1, sc));
      } else if (time < 1.1) {
        coreRef.current.scale.setScalar(0.05);
      } else {
        const burstTime = time - 1.1;
        const sc = burstTime * 12;
        coreRef.current.scale.setScalar(sc);
        if (coreRef.current.material) {
          (coreRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - burstTime * 0.8);
        }
      }
    }
  });

  return (
    <group position={[position[0], 1.2, position[2]]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
      </mesh>
      <pointLight color="#ef4444" intensity={15} distance={20} />
    </group>
  );
}

function MeteorDrop({ delay }: { delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = React.useState(0);
  
  useFrame((state, delta) => {
    setTime(prev => prev + delta);
    if (meshRef.current) {
      if (time > delay) {
        const activeTime = time - delay;

        const y = Math.max(0.5, 15 - (activeTime * 30));
        meshRef.current.position.y = y;
        meshRef.current.visible = true;
        
        if (y <= 0.5) {
          meshRef.current.scale.multiplyScalar(0.8);
        }
      } else {
        meshRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[(Math.random() - 0.5) * 2, 15, (Math.random() - 0.5) * 2]} visible={false}>
       <sphereGeometry args={[0.8, 16, 16]} />
       <meshBasicMaterial color="#f97316" />
    </mesh>
  );
}

function FloatingDamage({ text, position, styleType }: { text: string; position: [number, number, number]; styleType: string }) {
  const [yOffset, setYOffset] = React.useState(0);
  const [opacity, setOpacity] = React.useState(1);

  useFrame((state, delta) => {
    setYOffset(prev => prev + delta * 1.5);
    setOpacity(prev => Math.max(0, prev - delta * 0.75));
  });

  if (opacity <= 0) return null;

  let color = "white";
  let fontSize = 0.55;
  let strokeColor = "black";
  let strokeWidth = 0.05;

  if (styleType === 'crit') {
    color = "#facc15";
    fontSize = 0.75;
  } else if (styleType === 'dark') {
    color = "#c084fc";
    fontSize = 0.65;
  } else if (styleType === 'light') {
    color = "#38bdf8";
    fontSize = 0.65;
  } else if (styleType === 'cosmic') {
    color = "#f472b6";
    fontSize = 0.85;
  } else if (styleType === 'infinite') {
    color = "#f87171";
    fontSize = 1.15;
  } else if (styleType === 'heal') {
    color = "#4ade80";
    fontSize = 0.55;
  }

  return (
    <Billboard position={[position[0], position[1] + 1.8 + yOffset, position[2]]}>
      <Text
        fontSize={fontSize}
        color={color}
        outlineWidth={strokeWidth}
        outlineColor={strokeColor}
        fillOpacity={opacity}
        outlineOpacity={opacity}
      >
        {text}
      </Text>
    </Billboard>
  );
}

export function Battlefield3D({ units, effects = [], attackingUid, activeSkillName = null, damagePopups = [] }: { units: any[], effects?: { id: string, type: string, targetUids: string[] }[], attackingUid?: string | null, activeSkillName?: string | null, damagePopups?: { id: string, unitUid: string, text: string, styleType: string }[] }) {
  const controlsRef = useRef<any>(null);
  const players = units.filter(u => u.isPlayer);
  const enemies = units.filter(u => !u.isPlayer);

  const getPosition = (uid: string): [number, number, number] => {
    const pIdx = players.findIndex(u => u.uid === uid);
    if (pIdx !== -1) {
       const offsetZ = (pIdx - (players.length-1)/2) * 2;
       return [-4, 0, offsetZ];
    }
    const eIdx = enemies.findIndex(u => u.uid === uid);
    if (eIdx !== -1) {
       const offsetZ = (eIdx - (enemies.length-1)/2) * 2.5;
       return [4, 0, offsetZ];
    }
    return [0, 0, 0];
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (factor: number) => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const target = controls.target;
      const dir = new THREE.Vector3().subVectors(camera.position, target);
      dir.multiplyScalar(factor);
      camera.position.copy(target).add(dir);
      controls.update();
    }
  };

  return (
    <div className="relative w-full h-full">
      <Canvas shadows camera={{ position: [0, 21, 0.1], fov: 38 }}>
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 35, 80]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2} 
          castShadow 
          shadow-mapSize={1024}
        />
        
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        <gridHelper args={[50, 50, '#334155', '#1e293b']} position={[0, 0.01, 0]} />

        {players.map((unit, idx) => {
          const offsetZ = (idx - (players.length-1)/2) * 2;
          return <UnitMesh key={unit.uid} unit={unit} position={[-4, 0, offsetZ]} isEnemy={false} isAttacking={attackingUid === unit.uid} activeSkillName={activeSkillName} />
        })}

        {enemies.map((unit, idx) => {
          const offsetZ = (idx - (enemies.length-1)/2) * 2.5;
          return <UnitMesh key={unit.uid} unit={unit} position={[4, 0, offsetZ]} isEnemy={true} isAttacking={attackingUid === unit.uid} activeSkillName={activeSkillName} />
        })}

        {effects.map(effect => (
          <group key={effect.id}>
            {effect.targetUids.map((uid, i) => (
               <EffectVisual key={uid + i} type={effect.type} position={getPosition(uid)} />
            ))}
          </group>
        ))}

        {damagePopups.map(popup => {
          const pos = getPosition(popup.unitUid);
          return (
            <FloatingDamage 
              key={popup.id} 
              text={popup.text} 
              position={pos} 
              styleType={popup.styleType} 
            />
          );
        })}

        <OrbitControls 
          ref={controlsRef}
          enablePan={false} 
          enableZoom={true} 
          maxPolarAngle={Math.PI/3.2}
          minPolarAngle={Math.PI/12}
          target={[0, 0.4, 0]}
        />
        <Environment preset="city" />
      </Canvas>

      <div className="absolute bottom-4 right-4 z-45 bg-slate-900/90 border border-slate-800 p-2 rounded-xl flex items-center gap-1 shadow-2xl backdrop-blur-md">
         <button 
           onClick={() => handleZoom(0.85)}
           className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer"
           title="Zoom In"
         >
           <ZoomIn size={16} />
         </button>
         <button 
           onClick={() => handleZoom(1.15)}
           className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer"
           title="Zoom Out"
         >
           <ZoomOut size={16} />
         </button>
         <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>
         <button 
           onClick={resetCamera}
           className="h-8 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-500 hover:border-blue-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
           title="Reset View"
         >
           <RotateCcw size={14} />
           Reset
         </button>
      </div>
    </div>
  );
}
