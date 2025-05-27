
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getPublicPath } from '../helper';

const TEXTURE_PATH = getPublicPath() + '/textures/wall.jpg';

interface TextureSingleWallProps {
  rotation: number;
  position: [number, number, number];
}
function TextureSingleWall({rotation, position}: TextureSingleWallProps) {
  const texture = useTexture(TEXTURE_PATH);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  return <>
    <mesh
      rotation={[0, rotation, 0]}
      position={position}
      receiveShadow
    >
      <planeGeometry args={[100, 5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
    <mesh
      rotation={[0, rotation + Math.PI, 0]}
      position={position}
    >
      <planeGeometry args={[100, 5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  </>
}

export function TexturedWall() {
  


  return (
    <>
      <TextureSingleWall rotation={Math.PI / 2} position={[50, 1, 0]}/>
      <TextureSingleWall rotation={Math.PI / 2} position={[-50, 1, 0]}/>
      <TextureSingleWall rotation={0} position={[0, 1, 50]}/>
      <TextureSingleWall rotation={0} position={[0, 1, -50]}/>
    </>
  );
}
