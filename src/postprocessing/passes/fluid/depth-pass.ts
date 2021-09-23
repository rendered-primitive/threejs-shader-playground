import {
  PlaneBufferGeometry,
  Mesh,
  RawShaderMaterial,
  Scene,
  Texture,
  Uniform
} from "three";
import glsl from "babel-plugin-glsl/macro";

export class DepthPass {
  public readonly scene: Scene;

  private material: RawShaderMaterial;
  private mesh: Mesh;

  constructor() {
    this.scene = new Scene();

		const geometry = new PlaneBufferGeometry();

    this.material = new RawShaderMaterial({
      uniforms: {
				tDiffuse: new Uniform(Texture.DEFAULT_IMAGE),
				tDepth: new Uniform(Texture.DEFAULT_IMAGE),
				projectionMatrixInverse: {value: null},
				viewMatrixInverse: {value: null},
      },
      defines: {
        MODE: 0
      },
      vertexShader: glsl`
			varying vec2 vUv;
			void main () {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}`,
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
	
			}`,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.frustumCulled = false; // Just here to silence a console error.
    this.scene.add(this.mesh);
  }

  public update(uniforms: any): void {
    if (uniforms.tDepth !== undefined) {
      this.material.uniforms.tDepth.value = uniforms.tDepth;
    }
		if (uniforms.tDiffuse !== undefined) {
      this.material.uniforms.tDepth.value = uniforms.tDiffuse;
    }
		if (uniforms.projectionMatrixInverse !== undefined) {
      this.material.uniforms.projectionMatrixInverse.value = uniforms.projectionMatrixInverse;
    }
		if (uniforms.viewMatrixInverse !== undefined) {
      this.material.uniforms.viewMatrixInverse.value = uniforms.viewMatrixInverse;
    }
		
  }
}
