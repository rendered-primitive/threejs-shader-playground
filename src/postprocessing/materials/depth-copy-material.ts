import { ShaderMaterial, Vector2, Texture, Uniform } from "three";
import glsl from "babel-plugin-glsl/macro";


const vertexShader = glsl`
	varying vec2 vUv;

	void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const fragmentShader = glsl`
#pragma glslify: perspectiveDepthToViewZ = require('../shaders/partials/packing.glsl');
#pragma glslify: viewZToOrthographicDepth = require('../shaders/partials/packing.glsl');


varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;


float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
	vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
	
	float depth = readDepth( tDepth, vUv );
	gl_FragColor.rgb = 1.0 - vec3( depth );
	gl_FragColor.a = 1.0;
	gl_FragColor = texture2D( tDiffuse, vUv );

	// gl_FragColor = vec4(depth, 0.0, 0.0, 1.0);
}
`


export class DepthCopyMaterial extends ShaderMaterial {
  constructor(
    // cameraNear: number,
    // cameraFar: number,
    // tDiffuse: Uniform,
    // tDepth: Uniform
  ) {
    super({
      uniforms: {
        // tDiffuse: tDiffuse,
        // tDepth: tDepth,
        // cameraNear: { value: cameraNear },
        // cameraFar: { value: cameraFar },
				cameraNear: { value: 0 },
        cameraFar: { value: 0 },
        tDiffuse: { value: null },
        tDepth: { value: null }
      },

      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    });
  }
}

//  /**
//  * An enumeration of depth copy modes.
//  *
//  * @type {Object}
//  * @property {Number} FULL - Copies the full depth texture every frame.
//  * @property {Number} SINGLE - Copies a single texel from the depth texture on demand.
//  */

// export enum DepthCopyMode{

// 	FULL = 0,
// 	SINGLE = 1

// };

//  export class DepthCopyMaterial extends ShaderMaterial {

// 	mode: DepthCopyMode;

// 	constructor() {

// 		super({

// 			defines: {
// 				INPUT_DEPTH_PACKING: "0",
// 				OUTPUT_DEPTH_PACKING: "0",
// 				DEPTH_COPY_MODE: "0"
// 			},

// 			uniforms: {
// 				depthBuffer: new Uniform(null),
// 				screenPosition: new Uniform(new Vector2())

// 			},

// 			fragmentShader: depthCopyFrag,
// 			vertexShader: depthCopyVert,

// 			toneMapped: false,
// 			depthWrite: false,
// 			depthTest: false

// 		});
// 		this.type = "DepthCopyMaterial";

// 		this.mode = DepthCopyMode.FULL;

// 	}
// 	/**
// 	 * Returns the current input depth packing.
// 	 *
// 	 * @return {Number} The input depth packing.
// 	 */

// 	 getInputDepthPacking(): number {

// 		return Number(this.defines.INPUT_DEPTH_PACKING);

// 	}

// 	/**
// 	 * Sets the input depth packing.
// 	 *
// 	 * @param {Number} value - The new input depth packing.
// 	 */

// 	setInputDepthPacking(value: number) {

// 		this.defines.INPUT_DEPTH_PACKING = value.toFixed(0);
// 		this.needsUpdate = true;

// 	}

// 	/**
// 	 * Returns the current output depth packing.
// 	 *
// 	 * @return {Number} The output depth packing.
// 	 */

// 	getOutputDepthPacking(): number {

// 		return Number(this.defines.OUTPUT_DEPTH_PACKING);

// 	}

// 	/**
// 	 * Sets the output depth packing.
// 	 *
// 	 * @param {Number} value - The new output depth packing.
// 	 */

// 	setOutputDepthPacking(value: number) {

// 		this.defines.OUTPUT_DEPTH_PACKING = value.toFixed(0);
// 		this.needsUpdate = true;

// 	}

// 	/**
// 	 * Returns the depth copy mode.
// 	 *
// 	 * @return {DepthCopyMode} The depth copy mode.
// 	 */

// 	getMode(): DepthCopyMode  {

// 		return this.mode;

// 	}

// 	/**
// 	 * Sets the depth copy mode.
// 	 *
// 	 * @param {DepthCopyMode} value - The new mode.
// 	 */

// 	setMode(value: DepthCopyMode) {

// 		this.mode = value;
// 		this.defines.DEPTH_COPY_MODE = value.toFixed(0);
// 		this.needsUpdate = true;

// 	}

// }
