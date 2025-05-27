import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useEffect, useRef, useState, type SetStateAction } from 'react';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getPublicPath } from '../helper';

interface HumanModelProps {
  startPosition?: THREE.Vector3;
  position: THREE.Vector3;
  setPosition: React.Dispatch<SetStateAction<THREE.Vector3>>;
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

const CORNERS = {
  minX: -49.5,
  minZ: -49.5,
  maxX: 49.5,
  maxZ: 49.5
}

export default function HumanModel({position, setPosition}: HumanModelProps) {
  const delta = 0.1;
  const deltaTheta = Math.PI / 360 * 15;

  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const { actions } = useAnimations(animations, group);
  const { camera } = useThree();
  const [rotation, setRotation] = useState<number>(0);
  const [currentAnimation, setCurrentAnimation] = useState<string>(HumanModelAnimations.idle);
  const [isJumping, setIsJumping] = useState(false);
  const [walking, setWalking] = useState<0|1|-1>(0);

  function updateCurrentAnimation(animation: string) {
    if (!isJumping) {
      setCurrentAnimation(animation);
    }
  }

  const playJumpAnimation = () => {
    const jumpAction = walking == 0 ? actions[HumanModelAnimations.jump] : actions[HumanModelAnimations.runningJump];
    if (jumpAction) {
      // Set loop mode to play only once
      jumpAction.setLoop(THREE.LoopOnce, 1);
      jumpAction.clampWhenFinished = true;
      jumpAction.reset().play();

      const intervalId = setInterval(() => {
        setPosition(pos => pos.add(new THREE.Vector3(0, 0.05, 0)));
      }, 50);

      setTimeout(() => {
        clearInterval(intervalId);
        const newIntervalId = setInterval(() => {
          setPosition(pos => pos.add(new THREE.Vector3(0, -0.05, 0)));
        }, 50);

        setTimeout(() => {
          clearInterval(newIntervalId);
        }, 500);
      }, 500)

      // Listen for animation end to reset jump state
      const closeJump = () => {
        setIsJumping(false);
        jumpAction.stop();
        jumpAction.getMixer().removeEventListener('finished', closeJump);
      }
      jumpAction.getMixer().addEventListener('finished', closeJump);
    }
  }


  const onKeyDown = (key: string) => {
    switch(key) {
      case 'w':
        setWalking(1);
        updateCurrentAnimation(HumanModelAnimations.run);
        break;
      case 's':
        updateCurrentAnimation(HumanModelAnimations.run);
        setWalking(-1);
        break;
      case 'a':
        updateCurrentAnimation(HumanModelAnimations.run);
        setRotation(rot => rot + deltaTheta);
        break;
      case 'd':
        updateCurrentAnimation(HumanModelAnimations.run);
        setRotation(rot => rot - deltaTheta);
        break;
      case ' ':
        if (!isJumping) {
          setIsJumping(true);
          playJumpAnimation();
        }
    }
  }

  const onKeyUp = (key: string) => {
    switch(key) {
      case 'w':
      case 's':
        setWalking(0);
        updateCurrentAnimation(HumanModelAnimations.idle);
        break;
      case 'a':
      case 'd':
        if (walking == 0)  {
          updateCurrentAnimation(HumanModelAnimations.idle);
        }
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

  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((obj) => {
      obj.castShadow = true;
      obj.receiveShadow = true;
    });
  }, []);

  useKeyboardControls({ onKeyDown, onKeyUp });

  useFrame(() => {
    setPosition(pos => {
      const newPos = new THREE.Vector3(Math.sin(rotation), 0, Math.cos(rotation))
        .multiplyScalar(walking * delta)
        .add(pos);
      console.log(newPos);
      if (newPos.x > CORNERS.maxX || newPos.x < CORNERS.minX || 
          newPos.z > CORNERS.maxZ || newPos.z < CORNERS.minZ ) {
          return pos;
      }
      return newPos;
    });

    if (group.current) {
      const targetPosition = new THREE.Vector3();
      group.current.getWorldPosition(targetPosition);

      // Set camera offset behind and above the character
      const cameraOffset = new THREE.Vector3(0, 5, -5)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      const desiredPosition = targetPosition.clone().add(cameraOffset);

      // Smooth camera motion
      camera.position.lerp(desiredPosition, 0.1);

      // Look at the character
      camera.lookAt(targetPosition);
    }
  });

  return <primitive 
      ref={group} 
      object={scene} 
      position={position}
      rotation={[0, rotation, 0]}
      scale={0.5} />;
}
