import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import { EffectComposer } from './postprocessing/effects/effect-composer';
import { ShaderPass } from './postprocessing/passes/shader-pass';
import { RenderPass } from './postprocessing/passes/render-pass';
import { WebGLRenderTarget, LinearFilter, RGBAFormat, DepthTexture, Texture, Vector2, FloatType, UnsignedByteType, Scene, Mesh, PlaneBufferGeometry, MeshStandardMaterial, Color} from 'three';
import glsl from "babel-plugin-glsl/macro";

/*
Unfortunately there is no direct way to read the depth buffer.

To read the depth values you need 2 render targets. Render to the first target -> gives you both a color texture with the 
rendered image and a depth texture with the depth values. You cannot read a depth texture directly but you can draw it 
to another color texture and then read the color texture. 

you can only read UNSIGNED_BYTE values from the texture so your depth values only go from 0 to 255 which is not really enough resolution to do much.

To solve that issue you have to encode the depth values across channels when drawing the depth texture to the 2nd render target 
which means you need to make your own shader. three.js has some shader snippets for packing the values 
*/

extend({ EffectComposer, ShaderPass, RenderPass })

const shaderPass ={
  uniforms: {
      time: { value: 0 },
      tDiffuse: { value: null },
      depthTexture: { value: null},
      projectionMatrixInverse: {value: null},
      viewMatrixInverse: {value: null},
  },
  vertexShader: glsl`
    varying vec2 vUv;
    void main () {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }        
  `,
  fragmentShader: glsl`
    uniform float time;
    uniform sampler2D tDiffuse;
    uniform sampler2D depthTexture;
    varying vec2 vUv;

    uniform mat4 projectionMatrixInverse;
    uniform mat4 viewMatrixInverse;

		#pragma glslify: packDepthToRGBA = require('./postprocessing/shaders/partials/packing.glsl');

    vec3 worldCoordinatesFromDepth(float depth) {
      float z = depth * 2.0 - 1.0;
  
      vec4 clipSpaceCoordinate = vec4(vUv * 2.0 - 1.0, z, 1.0);
      vec4 viewSpaceCoordinate = projectionMatrixInverse * clipSpaceCoordinate;
  
      viewSpaceCoordinate /= viewSpaceCoordinate.w;
  
      vec4 worldSpaceCoordinates = viewMatrixInverse * viewSpaceCoordinate;
  
      return worldSpaceCoordinates.xyz;
    }

    
    void main() {


			float depth = texture2D(depthTexture, vUv).r;
			// gl_FragColor = packDepthToRGBA(depth);
			vec3 worldPosition = worldCoordinatesFromDepth(depth);
			gl_FragColor = vec4(worldPosition, 1.0);

    }
		
  `
}

export const DepthFieldEffect = () => {
  const { gl, size, scene, camera, mouse } = useThree();

	const windowHalfX = window.innerWidth / 2;
	const windowHalfY = window.innerHeight / 2;

	const [mousePos, setMousePos] = useState<Vector2>(new Vector2())

	// render target initialisation : 
	const [ sceneRT ] = React.useMemo(() => {
    const _renderTarget = new WebGLRenderTarget(
        size.width,
        size.height,
        {
						type: UnsignedByteType,
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
            stencilBuffer: false,
            depthBuffer: true,
            depthTexture: new DepthTexture(size.width, size.height)
        },
    );
    return [ _renderTarget ];
  }, [size]);

	const [ depthRT ] = React.useMemo(() => {
    const _renderTarget = new WebGLRenderTarget(
        size.width,
        size.height,
        {
						type: UnsignedByteType,
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            format: RGBAFormat,
            stencilBuffer: false,
        },
    );
    return [ _renderTarget ];
  }, [size]);

		// These variables are used to store the result the result of the different
	// render passes. Not needed but nice for convenience.
	let depthTexture: Texture = Texture.DEFAULT_IMAGE;



	const [effectComposer] = useState(()=> new EffectComposer(gl, depthRT)); 
  const effectComposerRef = useRef<EffectComposer>(effectComposer);

	const shaderPassRef = useRef<ShaderPass>(new ShaderPass(shaderPass)); 


  useEffect(() => {
    effectComposerRef.current.setSize(size.width, size.height)
  }, [size])

	useEffect(() => {
		function onDocumentMouseMove( event: MouseEvent ) {
			setMousePos(new Vector2( (event.clientX - windowHalfX), ( event.clientY - windowHalfY ) )); 
		}

		window.addEventListener('mousemove', onDocumentMouseMove); 

		return () => window.addEventListener('mousemove', onDocumentMouseMove); 
	}, [mouse, windowHalfX, windowHalfY]); 

  useFrame((state) => {

		// Render first scene into texture
    state.gl.setRenderTarget(sceneRT);
    state.gl.render(scene, camera);

		//update the shader pass to have the correct uniforms
    shaderPassRef.current.uniforms['depthTexture'].value = sceneRT.depthTexture;
    shaderPassRef.current.uniforms['projectionMatrixInverse'].value = camera.projectionMatrixInverse;
    shaderPassRef.current.uniforms['viewMatrixInverse'].value = camera.matrixWorld;
    shaderPassRef.current.uniforms['time'].value = state.clock.elapsedTime;


		state.gl.clear();
		// state.gl.setRenderTarget(depthRT);
		state.gl.setRenderTarget(null);
		effectComposerRef.current.render()

		// console.log(depthRT.texture)

// INVALID_OPERATION: readPixels: type UNSIGNED_BYTE but ArrayBufferView not Uint8Array or Uint8ClampedArray
		// const readBuffer = new Uint8Array( 4 );
  	// state.gl.readRenderTargetPixels( depthRT, 0, 0, 1, 1, readBuffer );
		// const id = ( readBuffer[ 0 ] << 16 ) | ( readBuffer[ 1 ] << 8 ) | ( readBuffer[ 2 ] );


		// state.gl.setRenderTarget( null );
		// state.gl.render( scene, camera );



		// depthTexture = effectComposerRef.current.renderTarget2.texture;
		// console.log(depthTexture)
		// const pixelBuffer = new Uint8Array(4);
		// // state.gl.readRenderTargetPixels(renderTarget, mouse.width, mouse.height, 1, 1, pixelBuffer);
		// state.gl.readRenderTargetPixels(
		// 	effectComposerRef.current.renderTarget2,
		// 	0,
		// 	0,
		// 	renderTarget.width,
		// 	renderTarget.height,
		// 	pixelBuffer
		// );

		// const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);

  }, 1);
  
  return (
	
    <effectComposer ref={effectComposerRef} args={[gl, sceneRT]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" ref={shaderPassRef} args={[shaderPass]} needsSwap={false} renderToScreen={false} />
    </effectComposer>
		
	
  )
}


