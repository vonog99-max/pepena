import { Document, NodeIO, Accessor } from '@gltf-transform/core';
import fs from 'fs';
import path from 'path';

const io = new NodeIO();

const heroes = [
  { id: 'flame_knight', color: [0.93, 0.26, 0.26, 1], type: 'box' },
  { id: 'ice_mage', color: [0.23, 0.51, 0.96, 1], type: 'cone' },
  { id: 'shadow_assassin', color: [0.54, 0.36, 0.96, 1], type: 'cylinder' },
  { id: 'light_cleric', color: [0.91, 0.70, 0.03, 1], type: 'sphere' },
  { id: 'earth_golem', color: [0.57, 0.25, 0.04, 1], type: 'box' },
  { id: 'wind_ranger', color: [0.13, 0.77, 0.36, 1], type: 'cylinder' },
  { id: 'water_nymph', color: [0.05, 0.64, 0.91, 1], type: 'sphere' },
  { id: 'thunder_brawler', color: [0.91, 0.70, 0.03, 1], type: 'box' },
  { id: 'blood_vampire', color: [0.72, 0.11, 0.11, 1], type: 'cone' },
  { id: 'iron_paladin', color: [0.58, 0.63, 0.72, 1], type: 'box' },
];

const enemies = [
  { id: 'slime', color: [0.13, 0.77, 0.36, 1], type: 'sphere' },
  { id: 'goblin', color: [0.39, 0.63, 0.05, 1], type: 'box' },
  { id: 'wolf', color: [0.44, 0.44, 0.47, 1], type: 'cylinder' },
  { id: 'skeleton', color: [0.94, 0.96, 0.97, 1], type: 'box' },
  { id: 'orc', color: [0.30, 0.48, 0.05, 1], type: 'cylinder' },
  { id: 'dark_mage', color: [0.34, 0.11, 0.52, 1], type: 'cone' },
  { id: 'gargoyle', color: [0.32, 0.32, 0.35, 1], type: 'box' },
  { id: 'fire_elemental', color: [0.91, 0.34, 0.04, 1], type: 'sphere' },
  { id: 'minotaur', color: [0.47, 0.20, 0.05, 1], type: 'box' },
  { id: 'dragon_boss', color: [0.86, 0.14, 0.14, 1], type: 'cone' },
];

async function generateGLBs() {
  const dirHeroes = path.join(process.cwd(), 'public/assets/heroes');
  const dirEnemies = path.join(process.cwd(), 'public/assets/enemies');
  fs.mkdirSync(dirHeroes, { recursive: true });
  fs.mkdirSync(dirEnemies, { recursive: true });

  const processEntity = async (entity: any, dir: string) => {
    const doc = new Document();
    const buffer = doc.createBuffer();
    
    // Create a simple box geometry
    const positionArray = new Float32Array([
      -0.5, -0.5, 0.5,   0.5, -0.5, 0.5,   -0.5, 0.5, 0.5,   0.5, 0.5, 0.5,  // Front
      -0.5, -0.5, -0.5,  -0.5, 0.5, -0.5,  0.5, -0.5, -0.5,  0.5, 0.5, -0.5  // Back
    ]);
    const indicesArray = new Uint16Array([
      0, 1, 2,  2, 1, 3,  // Front
      1, 6, 3,  3, 6, 7,  // Right
      6, 4, 7,  7, 4, 5,  // Back
      4, 0, 5,  5, 0, 2,  // Left
      2, 3, 5,  5, 3, 7,  // Top
      4, 6, 0,  0, 6, 1   // Bottom
    ]);

    const position = doc.createAccessor().setBuffer(buffer).setType(Accessor.Type.VEC3).setArray(positionArray);
    const indices = doc.createAccessor().setBuffer(buffer).setType(Accessor.Type.SCALAR).setArray(indicesArray);

    const prim = doc.createPrimitive().setAttribute('POSITION', position).setIndices(indices);
    
    const mat = doc.createMaterial()
      .setBaseColorFactor(entity.color)
      .setRoughnessFactor(0.5)
      .setMetallicFactor(0.2);
    
    prim.setMaterial(mat);

    const mesh = doc.createMesh().addPrimitive(prim);
    const node = doc.createNode().setMesh(mesh);
    doc.createScene().addChild(node);

    const glb = await io.writeBinary(doc);
    fs.writeFileSync(path.join(dir, `${entity.id}.glb`), glb);
  };

  for (const h of heroes) {
    await processEntity(h, dirHeroes);
  }
  for (const e of enemies) {
    await processEntity(e, dirEnemies);
  }
}

generateGLBs().catch(console.error);
