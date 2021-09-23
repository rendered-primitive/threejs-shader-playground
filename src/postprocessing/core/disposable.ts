/**
 * The Disposable contract.
 *
 * Implemented by objects that can free internal resources.
 *
 * @interface
 */

export interface Disposable {
  /**
   * Frees internal resources.
   */

  dispose(): void;
}
