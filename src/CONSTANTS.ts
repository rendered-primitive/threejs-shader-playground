// Layer :

export enum CameraLayer {
  visible = 0,
  invisible = 1,
}

export enum RaycasterLayer {
  clickable = 3,
  non_clickable = 4,
}

/**
 * There is a default rendering order of scene graph objects
 *
 * This rendering order can be overriddenm although opaque and transparent objects remain sorted independently.
 */
export enum PostProcessingEffectRenderPriority {
  OutlineEffect = 3,
  ClippingCapEffect = 4,
  DepthPicking = 1,
  DepthPickingCursor = 2,
}
