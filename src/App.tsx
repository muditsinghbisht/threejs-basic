import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import HumanModel from './components/HumanModel';
import { TexturedGround } from './components/TexturedGround';
import { CustomDirectionalLight } from './components/CustomDirectionalLight';
import { Vector3 } from 'three';
import { useState } from 'react';

function App() {
  const [position, setPosition] = useState(new Vector3(0, -1, 0));
  const debug = false;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Lights */}
        <ambientLight intensity={0.75} />
        <CustomDirectionalLight targetPosition={position} />

        {/* Add coordinate axes (X-red, Y-green, Z-blue) */}
        {debug && <axesHelper args={[50]} />}
        <TexturedGround />

        <HumanModel position={position} setPosition={setPosition}/>

        {/* Controls */}
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
