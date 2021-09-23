import React, { useEffect, useMemo} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import {
  UnsignedShortType,
  RGBFormat,
  NearestFilter,
  DepthTexture,
  FloatType,
  Uniform,
	RGBAFormat,
} from "three";
import { PostProcessingEffectRenderPriority } from "./CONSTANTS";
import { EffectComposer } from "./postprocessing/effects";
import { RenderPass, ShaderPass } from "./postprocessing/passes";
import { DepthCopyMaterial } from "./postprocessing/materials";



export const DepthEffect = () => {
  const renderPriority: number =
    PostProcessingEffectRenderPriority.DepthPicking;

  const { gl, scene, camera, size } = useThree();

  const renderTarget = useFBO(
    // width and height are optional and defaulted to the viewport size
    // multiplied by the renderer pixel ratio, and recalculated whenever the
    // viewport size changes.
    {
      // type: FloatType,
      format: RGBFormat,
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      generateMipmaps: false,
			stencilBuffer: false,
      depthBuffer: true,
      depthTexture: new DepthTexture(
        size.width,
        size.height,
        FloatType
      ),
    }
  );

  const effectComposer = useMemo(() => {
    const _effectComposer = new EffectComposer(gl, renderTarget);


    const renderPass = new RenderPass(scene, camera);
    _effectComposer.addPass(renderPass);

		console.log(_effectComposer.renderTarget2.texture)
		console.log(_effectComposer.renderTarget2.depthTexture)


    const depthCopyMaterial = new DepthCopyMaterial();
    const depthCopyShaderPass = new ShaderPass(depthCopyMaterial);
		depthCopyShaderPass.uniforms.cameraNear.value = camera.near;
		depthCopyShaderPass.uniforms.cameraFar.value = camera.far;
		depthCopyShaderPass.uniforms.tDiffuse.value = _effectComposer.renderTarget2.texture;
		depthCopyShaderPass.uniforms.tDepth.value = _effectComposer.renderTarget2.depthTexture;

    _effectComposer.addPass(depthCopyShaderPass);
    return _effectComposer;
  }, [camera, gl, renderTarget, scene]);

  useEffect(() => {
    effectComposer.setSize(size.width, size.height);
  }, [size, effectComposer]);

  useFrame((state) => {
    effectComposer.render();

  }, renderPriority);

	return (<></>)
};
