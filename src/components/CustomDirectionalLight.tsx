
import React, { useEffect } from 'react';
import { DirectionalLight, Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useDirectionalLightHelper } from '../hooks/useDirectionalLightHelper';

interface DirectionalLightProps {
  targetPosition: Vector3;
}

export function CustomDirectionalLight({ targetPosition }: DirectionalLightProps) {

  const dirLightRef = React.useRef<DirectionalLight>(null);
  const { position } = useDirectionalLightHelper(dirLightRef);
  const { scene } = useThree();

  

  useEffect(() => {
    if (dirLightRef.current) {
      const target = dirLightRef.current.target;
      target.position.set(targetPosition.x, targetPosition.y, targetPosition.z); // 👈 Change direction
      scene.add(target); // 👈 Important!
    }
  }, [scene, targetPosition]);

  useEffect(() => {
    console.log('Light Ref:', dirLightRef.current);
  }, []);

  return (<directionalLight
            ref={dirLightRef}
            castShadow
            position={position}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={100}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
        />);
}