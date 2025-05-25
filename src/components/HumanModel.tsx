import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getPublicPath } from '../helper';

interface HumanModelProps {
  startPosition?: THREE.Vector3;
}

const HumanModelAnimations  = {
  clapping: 'HumanArmature|Man_Clapping',
  death: 'HumanArmature|Man_Death',
  idle: 'HumanArmature|Man_Idle',
  jump: 'HumanArmature|Man_Jump',
  punch: 'HumanArmature|Man_Punch',
  run: 'HumanArmature|Man_Run',
  runningJump: 'HumanArmature|Man_RunningJump',
  sit: 'HumanArmature|Man_Sitting',
  stand: 'HumanArmature|Man_Standing',
  swordSlash: 'HumanArmature|Man_SwordSlash',
  walk: 'HumanArmature|Man_Walk'
} as const;

const MODEL_PATH = getPublicPath() + '/models/human.glb';

export default function HumanModel({startPosition = new THREE.Vector3(0, -1, 0)}: HumanModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions } = useAnimations(animations, group);
  const { camera } = useThree();
  const [position, setPosition] = useState<THREE.Vector3>(startPosition);
  const [rotation, setRotation] = useState<number>(0);
  const [currentAnimation, setCurrentAnimation] = useState<string>(HumanModelAnimations.idle);
  const [isJumping, setIsJumping] = useState(false);

  function updateCurrentAnimation(animation: string) {
    if (!isJumping) {
      setCurrentAnimation(animation);
    }
  }

  const playJumpAnimation = () => {
    const jumpAction = actions[HumanModelAnimations.jump];

    if (jumpAction) {
      // Set loop mode to play only once
      jumpAction.setLoop(THREE.LoopOnce, 1);
      jumpAction.clampWhenFinished = true;
      jumpAction.reset().play();

      // Listen for animation end to reset jump state
      jumpAction.getMixer().addEventListener('finished', () => {
        console.log('Jumping finished!');
        setIsJumping(false);
      });
    }
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (!isJumping) {
          setIsJumping(true);
          playJumpAnimation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping]);

  const onKeyPress = (key: string) => {
    const delta = 0.2;
    const deltaTheta = Math.PI / 360 * 15;
    
    console.log(`Key Press: "${key}"`);
    switch(key) {
      case 'w':
        updateCurrentAnimation(HumanModelAnimations.walk);
        return setPosition(pos => new THREE.Vector3(Math.sin(rotation), 0, Math.cos(rotation))
          .multiplyScalar(delta)
          .add(pos));
      case 's':
        updateCurrentAnimation(HumanModelAnimations.walk);
        // setRotation(rot => rot + deltaTheta);
        return setPosition(pos => new THREE.Vector3(Math.sin(rotation), 0, Math.cos(rotation))
          .multiplyScalar(-1 * delta)
          .add(pos));
      case 'a':
        updateCurrentAnimation(HumanModelAnimations.walk);
        return setRotation(rot => rot + deltaTheta);
        // return setPosition(pos => [pos[0] - delta, pos[1], pos[2]]);
      case 'd':
        updateCurrentAnimation(HumanModelAnimations.walk);
        return setRotation(rot => rot - deltaTheta);
        // return setPosition(pos => [pos[0] + delta, pos[1], pos[2]]);
      case ' ':
        updateCurrentAnimation(HumanModelAnimations.jump);
        return;
    }
  }

  const onKeyUp = (key: string) => {
    console.log('Key Up: ', key);
    switch(key) {
      case 'w':
      case 's':
      case 'a':
      case 'd':
        updateCurrentAnimation(HumanModelAnimations.idle);
    }
  }

  useEffect(() => {
    if (!currentAnimation && !actions) {
      return;
    }
    Object.values(actions).forEach((a) => a?.stop()); // stop all animations
    const next = actions[currentAnimation] || actions[HumanModelAnimations.idle]
    if (next) {
      next.reset().fadeIn(0.3).play();
    }
  }, [actions, currentAnimation]);

  useKeyboardControls({ onKeyPress, onKeyUp });

  useFrame(() => {
    if (group.current) {
      const targetPosition = new THREE.Vector3();
      group.current.getWorldPosition(targetPosition);

      // Set camera offset behind and above the character
      const cameraOffset = new THREE.Vector3(0, 5, -5)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      const desiredPosition = targetPosition.clone().add(cameraOffset);

      // console.log('Desired Position for camera: ', desiredPosition);
      // Smooth camera motion
      camera.position.lerp(desiredPosition, 0.1);

      // Look at the character
      camera.lookAt(targetPosition);
    }
  });

  return <mesh castShadow >
    <primitive 
      ref={group} 
      object={scene} 
      position={position}
      rotation={[0, rotation, 0]}
      scale={0.5} />
    </mesh>;
}
