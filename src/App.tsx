import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
// import SpinningCube from './components/SpinningCube';
import HumanModel from './components/HumanModel';
import { TexturedGround } from './components/TexturedGround';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[0, 5, 0]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={10}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
      />

        {/* Ground plane (receives shadow) */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* Add coordinate axes (X-red, Y-green, Z-blue) */}
        {/* <axesHelper args={[50]} /> */}

        <TexturedGround />
        {/* Mesh */}
        {/* <SpinningCube /> */}

        <HumanModel />

        {/* Controls */}
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
