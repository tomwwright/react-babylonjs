import * as React from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import BabylonScene, { SceneEventArgs } from "./SceneComponent"; // import the component above linking to file we just created.
import { MeshAssetTask } from "babylonjs";

export class PageWithScene extends React.Component<{}, {}> {
  onSceneMount = (e: SceneEventArgs) => {
    const { canvas, scene, engine } = e;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 2, new BABYLON.Vector3(0, 0, 0), scene);

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // var hemiLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    // hemiLight.intensity = 0.7;

    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -1, 0).normalize(), scene);
    light.position = new BABYLON.Vector3(10, 10, 0);
    light.intensity = 0.7;

    var cube = BABYLON.Mesh.CreateBox("box", 1, scene);
    cube.position.z = 2;
    cube.receiveShadows = true;

    var cube2 = BABYLON.Mesh.CreateBox("box", 0.5, scene);
    cube2.position = new BABYLON.Vector3(2, 2, 2);
    cube2.receiveShadows = true;

    var assetsManager = new BABYLON.AssetsManager(scene);

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

    shadowGenerator.addShadowCaster(cube2);

    // hex coordinate math -- https://www.redblobgames.com/grids/hexagons/
    let width = 1;
    let radius = width / Math.sqrt(3);
    let height = 2 * radius;

    ["building_sheep", "grass_forest", "building_village", "building_tower"].forEach((name, i) => {
      assetsManager.addMeshTask(name, name, "assets/", `${name}.glb`);
    });

    assetsManager.onFinish = function (tasks) {
      tasks.forEach((task, i) => {
        let meshes = (task as MeshAssetTask).loadedMeshes;
        meshes[0].position.y = i;
        meshes[0].position.z = 2;

        meshes[0].position.x = i;

        shadowGenerator.addShadowCaster(meshes[0]);
        meshes[0].receiveShadows = true;
      });

      engine.runRenderLoop(function () {
        if (scene) {
          scene.render();
        }
      });
    };

    assetsManager.load();
  };

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <BabylonScene onSceneMount={this.onSceneMount} />
      </div>
    );
  }
}
