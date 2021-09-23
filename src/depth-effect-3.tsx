export const x = '';
// import {
//   HalfFloatType,
//   OrthographicCamera,
//   RGBFormat,
//   Texture,
//   UnsignedByteType,
//   Vector2,
//   Camera,
// 	TextureLoader,
// 	Vector4
// } from "three";
// import { AdvectionPass } from "./postprocessing/passes/fluid/advection-pass";
// import { BoundaryPass } from "./postprocessing/passes/fluid/boundary-pass";
// import { ColorInitPass } from "./postprocessing/passes/fluid/color-init-pass";
// import { CompositionPass } from "./postprocessing/passes/fluid/composition-pass";
// import { DivergencePass } from "./postprocessing/passes/fluid/divergence-pass";
// import { GradientSubstractionPass } from "./postprocessing/passes/fluid/gradient-subtraction-pass";
// import { JacobiIterationsPass } from "./postprocessing/passes/fluid/jacob-iteration-pass";
// import { TouchColorPass } from "./postprocessing/passes/fluid/touch-color-pass";
// import { TouchForcePass } from "./postprocessing/passes/fluid/touch-force-pass";
// import { VelocityInitPass } from "./postprocessing/passes/fluid/velocity-init-pass";
// import { RenderTarget } from "./postprocessing/core/render-target";
// import { useFrame, useThree } from "@react-three/fiber";
// import { useFBO } from '@react-three/drei'
// import { PostProcessingEffectRenderPriority } from './CONSTANTS';
// import React, {useState, useEffect, useMemo} from 'react';
// import { RenderPass} from './postprocessing/passes/fluid/render-pass';
// import { DepthPass } from './postprocessing/passes/fluid/depth-pass';
// function loadGradient() {
// 	let outputTexture: Texture = new Texture(); 
//   const textureLoader = new TextureLoader().setPath("./resources/");
//   textureLoader.load("gradient.jpg", (texture: Texture) => {outputTexture = texture});
// 	return outputTexture; 
// }




// export const FluidSimulation = () => {

// 	const gradientTexture = loadGradient();

// 		// App configuration options.
// 	const configuration = {
// 		Simulate: true,
// 		Iterations: 32,
// 		Radius: 0.25,
// 		Scale: 0.5,
// 		ColorDecay: 0.01,
// 		Boundaries: true,
// 		AddColor: true,
// 		Visualize: "Color",
// 		Mode: "Spectral",
// 		Timestep: "1/60",
// 		Reset: () => {
// 			velocityAdvectionPass.update({
// 				inputTexture: velocityInitTexture,
// 				velocity: velocityInitTexture
// 			});
// 			colorAdvectionPass.update({
// 				inputTexture: colorInitTexture,
// 				velocity: velocityInitTexture
// 			});
// 			v = new Texture();
// 			c = new Texture();
// 		},
// 	};


// 	const renderPriority: number = PostProcessingEffectRenderPriority.DepthPicking;

// 	const { gl, size, mouse, scene, camera } = useThree();

// 	const orthographicCamera: Camera = new OrthographicCamera(0, 0, 0, 0, 0, 0);
// 	let dt: number = 1 / 60;

// 	useEffect(() => {
// 		gl.autoClear = false; 
// 		gl.setSize(size.width, size.height);
// 		gl.setPixelRatio(window.devicePixelRatio);
//   }, [size, gl]);


// 	const resolution = new Vector2(
// 		configuration.Scale * window.innerWidth,
// 		configuration.Scale * window.innerHeight
// 	);
// 	// RenderTargets initialization.
// 	const depthRT = new RenderTarget(resolution, 2, RGBFormat, HalfFloatType);
// 	const colorRT = new RenderTarget(resolution, 2, RGBFormat, UnsignedByteType);
	
// 	// These variables are used to store the result the result of the different
// 	// render passes. Not needed but nice for convenience.
// 	let colorTexture: Texture;
// 	let depthTexture: Texture;

	
// 	// Render passes initialization.
// 	const sceneInitPass = new RenderPass(gl, scene, camera, resolution);
// 	const sceneInitTexture = sceneInitPass.render(); 
// 	const depthPass = new DepthPass();
// 	const depthInitTexture = depthPass.
	

//   useFrame(({gl}) => {
// 		const sceneRenderPass = new RenderPass(gl, scene, camera, resolution);

// 		depthPass.update({ timeDelta: dt });
// 		depthTexture = depthRT.set(gl);
// 		gl.render(depthPass.scene, camera);
	

//   }, renderPriority);

// 	return (<></>)

// }


