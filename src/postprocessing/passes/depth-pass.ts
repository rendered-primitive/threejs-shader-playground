import {
  Mesh,
  Scene,
  Texture,
  Uniform, 
	PlaneGeometry,
	ShaderMaterial
} from "three";
import glsl from 'babel-plugin-glsl/macro';


type tDiffuse = {tDiffuse: Texture}
type tDepth = {tDepth: Texture}
type CameraNear = {cameraNear: number}
type CameraFar = {cameraFar: number}

type DepthPassUniform = tDiffuse | tDepth | CameraNear | CameraFar;




export class DepthPass {
  public readonly scene: Scene;

  private material: ShaderMaterial;
  private mesh: Mesh;

  constructor(
		initialCameraNear: number,
		initialCameraFar: number
	) {
    this.scene = new Scene();

   	const geometry = new PlaneGeometry(2, 2); // <- has position, normal, uv attributes
    this.material = new ShaderMaterial({
      uniforms: {
        tDiffuse: new Uniform(Texture.DEFAULT_IMAGE),
        tDepth: new Uniform(Texture.DEFAULT_IMAGE),
				cameraNear: new Uniform(initialCameraNear),
				cameraFar: new Uniform(initialCameraFar)
      },
      defines: {
        DEPTH_PACKING_MODE: 0
      },
      vertexShader: glsl`
				varying vec2 vUv;

				void main() {
						vUv = uv;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}`,
      fragmentShader: glsl`
				// #pragma glslify: perspectiveDepthToViewZ = require('../partials/packing.glsl')
				// #pragma glslify: viewZToOrthographicDepth = require('../partials/packing.glsl')
				
				// NOTE: viewZ/eyeZ is < 0 when in front of the camera per OpenGL conventions
				float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
					return ( viewZ + near ) / ( near - far );
				}
								
				float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
					return ( near * far ) / ( ( far - near ) * invClipZ - far );
				}

				
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
					//vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
					float depth = readDepth( tDepth, vUv );
					gl_FragColor.rgb = 1.0 - vec3( depth );
					gl_FragColor.a = 1.0;
				}`,
      depthTest: false,
      depthWrite: true,
      transparent: false
    });
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.frustumCulled = false; // Just here to silence a console error.
    this.scene.add(this.mesh);
  }

  public update(uniform: DepthPassUniform	): void {

    if ((uniform as tDiffuse).tDiffuse !== undefined) {
      this.material.uniforms.tDiffuse.value = (uniform as tDiffuse).tDiffuse;
    }
		if ((uniform as tDepth).tDepth !== undefined) {
      this.material.uniforms.tDiffuse.value = (uniform as tDepth).tDepth;
    }
		if ((uniform as CameraFar).cameraFar !== undefined) {
      this.material.uniforms.tDiffuse.value = (uniform as CameraFar).cameraFar;
    }
		if ((uniform as CameraNear).cameraNear !== undefined) {
      this.material.uniforms.tDiffuse.value = (uniform as CameraNear).cameraNear;
    }

	
  }
}
