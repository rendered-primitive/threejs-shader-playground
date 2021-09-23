/**
 * The Resizable contract.
 *
 * Implemented by objects that can be resized.
 *
 * @interface
 */

export interface Resizable {
  /**
   * Sets the size of this object.
   *
   * @param {Number} width - The new width.
   * @param {Number} height - The new height.
   */

  setSize(width: number, height: number): void;
}
