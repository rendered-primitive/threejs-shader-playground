import React, {Suspense} from 'react';
import { Canvas } from '@react-three/fiber'
import { DepthEffect } from './depth-effect';
import { OrbitControls } from '@react-three/drei'
import { DepthFieldEffect } from './depth-effect-2';
import { FluidSimulation } from './fluid-simulation';
import './index.css'

// https://www.thefrontdev.co.uk/post-processing-in-react-three-fiber-depth-textures-and-world-coordinates-in-fragment-shaders
const Scene = () => {
  return (
		<div
		style={{
				height: '100vh',
				width: '100vw',
		}}	
		>
    <Canvas

				shadows
        onCreated={({ camera, gl, raycaster }) => {
          gl.localClippingEnabled = true;
          camera.position.set(6, 12, 6);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix()
        }}
      >
      <OrbitControls />

      <Suspense fallback={null}>
				<mesh castShadow receiveShadow>
					<meshStandardMaterial color={'red'}/>
					<torusBufferGeometry/>
				</mesh>
      </Suspense>

			<ambientLight/>
			<directionalLight/>

			{/* <DepthEffect/> */}
			<DepthFieldEffect/>
			{/* <FluidSimulation/> */}

    </Canvas>
		</div>

  );
};

const App = () => {
  return (
    <>
      <Scene />
    </>
  );
};


export default App;
