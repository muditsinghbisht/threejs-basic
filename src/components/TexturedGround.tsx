import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getPublicPath } from '../helper';

const TEXTURE_PATH = getPublicPath() + '/textures/floor.jpg';

export function TexturedGround() {
  const texture = useTexture(TEXTURE_PATH);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10); // repeat pattern

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1, 0]}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
