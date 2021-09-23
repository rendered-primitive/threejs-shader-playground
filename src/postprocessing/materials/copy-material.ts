/**
 * Full-screen textured quad shader
 */
import { NoBlending, ShaderMaterial, Uniform } from "three";
import glsl from "glslify";
const copyFrag = glsl("../shaders/copy/copy.frag");
const copyVert = glsl("../shaders/copy/copy.vert");

export class CopyShaderMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        inputBuffer: new Uniform(null),
        opacity: new Uniform(1.0),
      },

      fragmentShader: copyFrag,
      vertexShader: copyVert,

      blending: NoBlending,
      depthWrite: false,
      depthTest: false,
    });

    this.type = "CopyMaterial";
    this.toneMapped = false;
  }
}
