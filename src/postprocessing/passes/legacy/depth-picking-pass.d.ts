import {
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
  Vector3,
  DepthPackingStrategies,
} from "three";

import { DepthSavePass, DepthCopyMode } from "postprocessing";

/**
 * A depth picking pass.
 */

export class DepthPickingPass extends DepthSavePass {
  /**
   * Constructs a new depth picking pass.
   *
   * @param {Object} [options] - The options.
   * @param {Number} [options.depthPacking=RGBADepthPacking] - The depth packing.
   * @param {Number} [options.mode=DepthCopyMode.SINGLE] - The depth copy mode.
   */

  constructor(depthPacking?: DepthPackingStrategies, mode?: DepthCopyMode);

  /**
   * The depth copy mode.
   *
   * @type {DepthCopyMode}
   * @private
   */

  mode(): DepthCopyMode;
  /**
   * A screen position.
   *
   * @type {Vector2}
   * @private
   */

  screenPosition(): Vector2;

  /**
   * Reads depth at a specific screen position.
   *
   * Only one depth value can be picked per frame. Calling this method multiple
   * times per frame will overwrite the picking coordinates. Unresolved promises
   * will be abandoned.
   *
   * @example
   * const ndc = new Vector3();
   *
   * ndc.x = (pointerEvent.clientX / window.innerWidth) * 2.0 - 1.0;
   * ndc.y = -(pointerEvent.clientY / window.innerHeight) * 2.0 + 1.0;
   *
   * const depth = await depthPickingPass.readDepth(ndc);
   * ndc.z = depth * 2.0 - 1.0;
   *
   * const worldPosition = ndc.unproject(camera);
   *
   * @param {Vector2|Vector3} ndc - Normalized device coordinates. Only X and Y are relevant.
   * @return {Promise<Number>} A promise that returns the depth on the next frame.
   */

  readDepth(ndc: Vector2 | Vector3): Promise<number>;

  /**
   * Copies depth and resolves depth picking promises.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
   * @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
   * @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
   * @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
   */

  render(
    renderer: WebGLRenderer,
    inputBuffer: WebGLRenderTarget,
    outputBuffer: WebGLRenderTarget,
    deltaTime: number,
    stencilTest: boolean
  ): void;

  /**
   * Updates the size of this pass.
   *
   * @param {Number} width - The width.
   * @param {Number} height - The height.
   */

  setSize(width: number, height: number): void;
}
