import { WebGLRenderer } from "three";
/**
 * The initializable contract.
 *
 * Implemented by objects that can be initialized.
 *
 * @interface
 */

export interface Initializable {
  /**
   * Performs initialization tasks.
   *
   * @param {WebGLRenderer} renderer - A renderer.
   * @param {Boolean} alpha - Whether the renderer uses the alpha channel.
   * @param {Number} frameBufferType - The type of the main frame buffers.
   */

  initialize(
    renderer: WebGLRenderer,
    alpha: boolean,
    frameBufferType: number
  ): void;
}
