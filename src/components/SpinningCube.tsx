import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, type Mesh } from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

export default function SpinningCube() {
  const ref = React.useRef<Mesh>(null);
  const [position, setPosition] = React.useState<Vector3>(new Vector3(0, 3, 0));
  const onKeyPress = (key: string) => {
    const delta = 0.1;
    switch(key) {
      case 'q':
        return setPosition(pos => new Vector3(pos.x, pos.y, pos.z - delta));
      case 'e':
        return setPosition(pos => new Vector3(pos.x, pos.y, pos.z + delta));
      case 'w':
        return setPosition(pos => new Vector3(pos.x, pos.y + delta, pos.z));
      case 's':
        return setPosition(pos => new Vector3(pos.x, pos.y - delta, pos.z));
      case 'a':
        return setPosition(pos => new Vector3(pos.x - delta, pos.y, pos.z));
      case 'd':
        return setPosition(pos => new Vector3(pos.x + delta, pos.y, pos.z));
    }
  }

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  useKeyboardControls({ onKeyPress });

  return (
    <mesh castShadow ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}
