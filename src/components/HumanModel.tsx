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
    if (walking) {
      actions[HumanModelAnimations.run]?.stop();
    }

    const jumpAction = walking == 0 ? actions[HumanModelAnimations.jump] : actions[HumanModelAnimations.runningJump];
    console.log(`[${walking}] Jump Action:`, jumpAction);
    if (jumpAction) {
      // Set loop mode to play only once
      jumpAction.setLoop(THREE.LoopOnce, 1);
      jumpAction.clampWhenFinished = true;
      jumpAction.reset().play();

      // Listen for animation end to reset jump state
      jumpAction.getMixer().addEventListener('finished', () => {
        console.log(`Jumping finished with walking ${walking}`);
        setIsJumping(false);
        if (walking) {
          updateCurrentAnimation(HumanModelAnimations.run);
        }
      });
    }
  }

  // function playAnimation(name: string) {
  //   if (currentAnimation === name) return;

  //   const nextAction = actions[name];
  //   if (!nextAction) return;

  //   if (currentAnimation) {
  //     const current = actions[currentAnimation];
  //     current?.fadeOut(0.2);
  //   }

  //   nextAction.reset().fadeIn(0.2).play();
  //   setCurrentAnimation(name);

  //   // Handle jump completion
  //   if (name == HumanModelAnimations.jump || name == HumanModelAnimations.runningJump) {
  //     nextAction.setLoop(THREE.LoopOnce, 1);
  //     nextAction.clampWhenFinished = true;
  
  //     mixer.addEventListener('finished', (e) => {
  //       if (e.action === nextAction) {
  //         setIsJumping(false);
  //         setCurrentAction(isMoving ? 'Run' : 'Idle');
  //         actions[isMoving ? 'Run' : 'Idle']?.reset().fadeIn(0.2).play();
  //       }
  //     });
  //   } else {
  //     nextAction.setLoop(THREE.LoopRepeat, );
  //   }
  // };


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

    // if ()

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

  useEffect(() => {
    console.log(`Position: (${position.x}, ${position.y}, ${position.z})`);
  }, [position]);

  useFrame(() => {
    setPosition(pos => new THREE.Vector3(Math.sin(rotation), 0, Math.cos(rotation))
          .multiplyScalar(walking * delta)
          .add(pos));

          if (group.current) {
      const targetPosition = new THREE.Vector3();
      group.current.getWorldPosition(targetPosition);

      // Set camera offset behind and above the character
      const cameraOffset = new THREE.Vector3(0, 5, -5)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
      const desiredPosition = targetPosition.clone().add(cameraOffset);

      console.log('Desired Position for camera: ', desiredPosition);
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
