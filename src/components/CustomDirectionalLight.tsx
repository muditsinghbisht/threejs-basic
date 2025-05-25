
import React, { useEffect } from 'react';
// import { useHelper } from '@react-three/drei';
import { CameraHelper, DirectionalLight, DirectionalLightHelper, Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useHelper } from '@react-three/drei';

interface DirectionalLightProps {
  targetPosition: Vector3;
}

export function CustomDirectionalLight({ targetPosition }: DirectionalLightProps) {

  const dirLightRef = React.useRef<DirectionalLight>(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useHelper(dirLightRef, DirectionalLightHelper, 1);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useHelper(dirLightRef.current?.shadow?.camera, CameraHelper);

  const { scene } = useThree();
  const { lightPositionX, lightPositionY, lightPositionZ } = useControls({
    lightPositionX: { value: 0, min: -30, max: 30 },
    lightPositionY: { value: 10, min: 0, max: 100 },
    lightPositionZ: { value: 0, min: -30, max: 30 }
  });

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
            position={[lightPositionX, lightPositionY, lightPositionZ]}
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