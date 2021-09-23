import {
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  Material,
  Renderer,
} from "three";

// Helper for passes that need to fill the viewport with a single quad.
class FullScreenQuad<TMaterial extends Material = Material> {
  public camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  public geometry = new PlaneGeometry(2, 2); // <- has position, normal, uv attributes
  private mesh: Mesh<PlaneGeometry, TMaterial>;

  constructor(material: TMaterial) {
    this.mesh = new Mesh(this.geometry, material);
  }

  public get material(): TMaterial {
    return this.mesh.material;
  }

  public set material(value: TMaterial) {
    this.mesh.material = value;
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
  }

  public render(renderer: Renderer): void {
    renderer.render(this.mesh, this.camera);
  }
}

export { FullScreenQuad };
