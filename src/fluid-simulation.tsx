import {
  HalfFloatType,
  OrthographicCamera,
  RGBFormat,
  Texture,
  UnsignedByteType,
  Vector2,
  Camera,
	TextureLoader,
	Vector4
} from "three";
import { AdvectionPass } from "./postprocessing/passes/fluid/advection-pass";
import { BoundaryPass } from "./postprocessing/passes/fluid/boundary-pass";
import { ColorInitPass } from "./postprocessing/passes/fluid/color-init-pass";
import { CompositionPass } from "./postprocessing/passes/fluid/composition-pass";
import { DivergencePass } from "./postprocessing/passes/fluid/divergence-pass";
import { GradientSubstractionPass } from "./postprocessing/passes/fluid/gradient-subtraction-pass";
import { JacobiIterationsPass } from "./postprocessing/passes/fluid/jacob-iteration-pass";
import { TouchColorPass } from "./postprocessing/passes/fluid/touch-color-pass";
import { TouchForcePass } from "./postprocessing/passes/fluid/touch-force-pass";
import { VelocityInitPass } from "./postprocessing/passes/fluid/velocity-init-pass";
import { RenderTarget } from "./postprocessing/core/render-target";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from '@react-three/drei'
import { PostProcessingEffectRenderPriority } from './CONSTANTS';
import React, {useState, useEffect, useMemo} from 'react';


function loadGradient() {
	let outputTexture: Texture = new Texture(); 
  const textureLoader = new TextureLoader().setPath("./resources/");
  textureLoader.load("gradient.jpg", (texture: Texture) => {outputTexture = texture});
	return outputTexture; 
}




export const FluidSimulation = () => {

	const gradientTexture = loadGradient();

		// App configuration options.
	const configuration = {
		Simulate: true,
		Iterations: 32,
		Radius: 0.25,
		Scale: 0.5,
		ColorDecay: 0.01,
		Boundaries: true,
		AddColor: true,
		Visualize: "Color",
		Mode: "Spectral",
		Timestep: "1/60",
		Reset: () => {
			velocityAdvectionPass.update({
				inputTexture: velocityInitTexture,
				velocity: velocityInitTexture
			});
			colorAdvectionPass.update({
				inputTexture: colorInitTexture,
				velocity: velocityInitTexture
			});
			v = new Texture();
			c = new Texture();
		},
	};


	const renderPriority: number = PostProcessingEffectRenderPriority.DepthPicking;

	const { gl, size, mouse } = useThree();

	const camera: Camera = new OrthographicCamera(0, 0, 0, 0, 0, 0);
	let dt: number = 1 / 60;

	useEffect(() => {
		gl.autoClear = false; 
		gl.setSize(size.width, size.height);
		gl.setPixelRatio(window.devicePixelRatio);
  }, [size, gl]);


	const resolution = new Vector2(
		configuration.Scale * window.innerWidth,
		configuration.Scale * window.innerHeight
	);
	// RenderTargets initialization.
	const velocityRT = new RenderTarget(resolution, 2, RGBFormat, HalfFloatType);
	const divergenceRT = new RenderTarget(resolution, 1, RGBFormat, HalfFloatType);
	const pressureRT = new RenderTarget(resolution, 2, RGBFormat, HalfFloatType);
	const colorRT = new RenderTarget(resolution, 2, RGBFormat, UnsignedByteType);
	
	// These variables are used to store the result the result of the different
	// render passes. Not needed but nice for convenience.
	let c: Texture;
	let v: Texture;
	let d: Texture;
	let p: Texture;
	
	// Render passes initialization.
	const velocityInitPass = new VelocityInitPass(gl, resolution);
	const velocityInitTexture = velocityInitPass.render();
	const colorInitPass = new ColorInitPass(gl, resolution);
	const colorInitTexture = colorInitPass.render();
	const velocityAdvectionPass = new AdvectionPass(
		velocityInitTexture,
		velocityInitTexture,
		0
	);
	const colorAdvectionPass = new AdvectionPass(
		velocityInitTexture,
		colorInitTexture,
		configuration.ColorDecay
	);
	const touchForceAdditionPass = new TouchForcePass(
		resolution,
		configuration.Radius
	);
	const touchColorAdditionPass = new TouchColorPass(
		resolution,
		configuration.Radius
	);
	const velocityBoundary = new BoundaryPass();
	const velocityDivergencePass = new DivergencePass();
	const pressurePass = new JacobiIterationsPass();
	const pressureSubstractionPass = new GradientSubstractionPass();
	const compositionPass = new CompositionPass();

	interface ITouchInput {
		id: string | number;
		input: Vector4;
	}

	let inputTouches: ITouchInput[] = [];

	
	useEffect(() => {

		const mouseDown = (event: MouseEvent) => {
				inputTouches.push({
					id: "mouse",
					input: new Vector4(mouse.x, mouse.y, 0, 0)
			})}

		const mouseUp = (event: MouseEvent) => {
				if (event.button === 0) {
					inputTouches.pop();
				}
	}
			


		const mouseMove = (event: MouseEvent) => {
			if (inputTouches.length > 0) {
			
				inputTouches[0].input
					.setZ(mouse.x - inputTouches[0].input.x)
					.setW(mouse.y - inputTouches[0].input.y);
				inputTouches[0].input.setX(mouse.x).setY(mouse.y);
			}
		}; 

		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mousedown", mouseDown);
		document.addEventListener("mouseup", mouseUp);


		return () => {
			document.addEventListener("mousemove", mouseMove);
			document.addEventListener("mousedown", mouseDown);
			document.addEventListener("mouseup", mouseUp);
		}
	}, [])

	

	

  useFrame(({gl}) => {
		if (configuration.Simulate) {
			// Advect the velocity vector field.
			velocityAdvectionPass.update({ timeDelta: dt });
			v = velocityRT.set(gl);
			gl.render(velocityAdvectionPass.scene, camera);
	
			// // Add external forces/colors according to input.
			// if (inputTouches.length > 0) {
			//   touchForceAdditionPass.update({
			//     touches: inputTouches,
			//     radius: configuration.Radius,
			//     velocity: v
			//   });
			//   v = velocityRT.set(gl);
			//   gl.render(touchForceAdditionPass.scene, camera);
	
			//   if (configuration.AddColor) {
			//     touchColorAdditionPass.update({
			//       touches: inputTouches,
			//       radius: configuration.Radius,
			//       color: c
			//     });
			//     c = colorRT.set(gl);
			//     gl.render(touchColorAdditionPass.scene, camera);
			//   }
			// }
	
			// Add velocity boundaries (simulation walls).
			if (configuration.Boundaries) {
				velocityBoundary.update({ velocity: v });
				v = velocityRT.set(gl);
				gl.render(velocityBoundary.scene, camera);
			}
	
			// Compute the divergence of the advected velocity vector field.
			velocityDivergencePass.update({
				timeDelta: dt,
				velocity: v
			});
			d = divergenceRT.set(gl);
			gl.render(velocityDivergencePass.scene, camera);
	
			// Compute the pressure gradient of the advected velocity vector field (using
			// jacobi iterations).
			pressurePass.update({ divergence: d });
			for (let i = 0; i < configuration.Iterations; ++i) {
				p = pressureRT.set(gl);
				gl.render(pressurePass.scene, camera);
				pressurePass.update({ previousIteration: p });
			}
	
			// Substract the pressure gradient from to obtain a velocity vector field with
			// zero divergence.
			pressureSubstractionPass.update({
				timeDelta: dt,
				velocity: v,
				pressure: p
			});
			v = velocityRT.set(gl);
			gl.render(pressureSubstractionPass.scene, camera);
	
			// Advect the color buffer with the divergence-free velocity vector field.
			colorAdvectionPass.update({
				timeDelta: dt,
				inputTexture: c,
				velocity: v,
				decay: configuration.ColorDecay
			});
			c = colorRT.set(gl);
			gl.render(colorAdvectionPass.scene, camera);
	
			// Feed the input of the advection passes with the last advected results.
			velocityAdvectionPass.update({
				inputTexture: v,
				velocity: v
			});
			colorAdvectionPass.update({
				inputTexture: c
			});
		}
	
		// Render to the main framebuffer the desired visualization.
		gl.setRenderTarget(null);
		let visualization;
		switch (configuration.Visualize) {
			case "Color":
				visualization = c;
				break;
			case "Velocity":
				visualization = v;
				break;
			case "Divergence":
				visualization = d;
				break;
			case "Pressure":
				visualization = p;
				break;
		}
		compositionPass.update({
			colorBuffer: visualization,
			mode: configuration.Mode,
			gradient: gradientTexture
		});
		gl.render(compositionPass.scene, camera);
    

  }, renderPriority);

	return (<></>)

}


