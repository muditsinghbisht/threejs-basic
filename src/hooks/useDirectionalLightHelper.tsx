
import { CameraHelper, DirectionalLight, DirectionalLightHelper, Vector3 } from 'three';
import { useControls } from 'leva';
import { useHelper } from '@react-three/drei';
import type React from 'react';
import { useDebugFlag } from './useDebugFlag';

interface DirectionalLightHelperRes {
  position: Vector3;
};


export function useDirectionalLightHelper(
  dirLightRef: React.RefObject<DirectionalLight | null>
) : DirectionalLightHelperRes  {
  const debug = useDebugFlag();
  if (!debug) {
    return {
      position: new Vector3(0, 10, 0)
    }
  }

  const { lightPositionX, lightPositionY, lightPositionZ } = useControls({
      lightPositionX: { value: 0, min: -30, max: 30 },
      lightPositionY: { value: 10, min: 0, max: 100 },
      lightPositionZ: { value: 0, min: -30, max: 30 }
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useHelper(dirLightRef, DirectionalLightHelper, 1);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  useHelper(dirLightRef.current?.shadow?.camera, CameraHelper);

  return {
    position: new Vector3(lightPositionX, lightPositionY, lightPositionZ)
  }
}