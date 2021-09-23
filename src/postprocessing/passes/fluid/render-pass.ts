import { Camera } from "@react-three/fiber";
import {
  BufferGeometry,
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  RawShaderMaterial,
  RGBFormat,
  Scene,
  Texture,
  Uniform,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget
} from "three";

export class RenderPass {
  public readonly scene: Scene;
  public readonly camera: Camera;

  // private geometry: BufferGeometry;
  // private material: RawShaderMaterial;
  // private mesh: Mesh;

  private renderTarget: WebGLRenderTarget;

  constructor(readonly renderer: WebGLRenderer, readonly _scene: Scene, readonly _camera: Camera, readonly resolution: Vector2) {
    this.scene = _scene; 
    this.camera = _camera; 

    this.renderTarget = new WebGLRenderTarget(resolution.x, resolution.y, {
      format: RGBFormat,
      type: HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false
    });

    // this.geometry = new PlaneBufferGeometry();

    // this.material = new RawShaderMaterial({
    //   uniforms: {
		// 		colorBuffer: new Uniform(Texture.DEFAULT_IMAGE),
    //   },
		// 	vertexShader: `
		// 	attribute vec2 position;
		// 	varying vec2 vUV;
			
		// 	void main() {
		// 		vUV = position * 0.5 + 0.5;
		// 		gl_Position = vec4(position, 0.0, 1.0);
		// 	}`,
		// 	fragmentShader: `
		// 	varying vec2 vUV;
		// 	uniform sampler2D colorBuffer;

		// 	void main() {
		// 		vec4 color = texture2D(colorBuffer, vUV);
		// 		gl_FragColor = color;
		// 	}`,
    //   depthTest: false,
    //   depthWrite: false
    // });
    // this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.frustumCulled = false; // Just here to silence a console error.
    // this.scene.add(this.mesh);
  }

  // public update(uniforms: any): void {
	// 	if (uniforms.colorBuffer !== undefined) {
  //     this.material.uniforms.colorBuffer.value = uniforms.colorBuffer;
  //   }
  // }

  public render(): Texture {
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    return this.renderTarget.texture;
  }
}
