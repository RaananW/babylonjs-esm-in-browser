import {
  FreeCamera,
  RegisterFreeCamera,
} from "@babylonjs/core/Cameras/freeCamera.pure.js";
import { Engine } from "@babylonjs/core/Engines/engine.pure.js";
import { RegisterStandardEngineExtensions } from "@babylonjs/core/Engines/engineRegistration.pure.js";
import {
  HemisphericLight,
  RegisterHemisphericLight,
} from "@babylonjs/core/Lights/hemisphericLight.pure.js";
import { ImportMeshAsync } from "@babylonjs/core/Loading/sceneLoader.js";
import {
  RegisterStandardMaterial,
  StandardMaterial,
} from "@babylonjs/core/Materials/standardMaterial.pure.js";
import {
  RegisterMathVector,
  Vector3,
} from "@babylonjs/core/Maths/math.vector.pure.js";
import {
  CreateGround,
  RegisterGroundBuilder,
} from "@babylonjs/core/Meshes/Builders/groundBuilder.pure.js";
import { RegisterScene, Scene } from "@babylonjs/core/scene.pure.js";
import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic.js";

function registerBabylonFeatures() {
  RegisterStandardEngineExtensions();
  RegisterMathVector();
  RegisterScene();
  RegisterFreeCamera();
  RegisterHemisphericLight();
  RegisterStandardMaterial();
  RegisterGroundBuilder();
  registerBuiltInLoaders();
}

async function fetchSource(path: string) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function setupSourceViewer() {
  const showSource = document.querySelector<HTMLButtonElement>("#showSource");
  const sourceDialog = document.querySelector<HTMLDialogElement>("#sourceDialog");
  const htmlSource = document.querySelector<HTMLElement>("#htmlSource");
  const javascriptSource = document.querySelector<HTMLElement>("#javascriptSource");
  const mainScript = document.querySelector<HTMLScriptElement>('script[type="module"][src]');

  if (!showSource || !sourceDialog || !htmlSource || !javascriptSource || !mainScript) {
    throw new Error("The source viewer elements were not found.");
  }

  const mainScriptSource = mainScript.getAttribute("src");

  if (!mainScriptSource) {
    throw new Error("The main module source was not found.");
  }

  let sourcePromise: Promise<void> | undefined;

  const loadSource = async () => {
    try {
      const [html, javascript] = await Promise.all([
        fetchSource("./index.html"),
        fetchSource(mainScriptSource),
      ]);
      htmlSource.textContent = html;
      javascriptSource.textContent = javascript;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const errorText = `Unable to load the source code: ${message}`;
      htmlSource.textContent = errorText;
      javascriptSource.textContent = errorText;
      console.error(errorText, error);
    }
  };

  const openSource = () => {
    sourceDialog.showModal();
    sourcePromise ??= loadSource();
  };

  showSource.addEventListener("click", openSource);

  return () => {
    showSource.removeEventListener("click", openSource);
    sourceDialog.close();
  };
}

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");

  if (!canvas) {
    throw new Error("The render canvas was not found.");
  }

  const disposeSourceViewer = setupSourceViewer();
  registerBabylonFeatures();

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const camera = new FreeCamera("camera", new Vector3(0, 5, 10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", Vector3.Up(), scene);
  light.intensity = 0.7;

  const material = new StandardMaterial("ground-material", scene);
  const ground = CreateGround("ground", { width: 6, height: 6 }, scene);
  ground.material = material;

  const result = await ImportMeshAsync(
    "https://assets.babylonjs.com/meshes/BoomBox/BoomBox.gltf",
    scene,
  );
  const boomBox = result.meshes[0];

  if (!boomBox) {
    throw new Error("The BoomBox model did not contain any meshes.");
  }

  boomBox.position.y = 1;
  boomBox.scaling.scaleInPlace(50);

  engine.runRenderLoop(() => scene.render());
  document.documentElement.dataset.demoState = "ready";

  const resize = () => engine.resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "pagehide",
    () => {
      window.removeEventListener("resize", resize);
      disposeSourceViewer();
      scene.dispose();
      engine.dispose();
    },
    { once: true },
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Unable to start the Babylon.js demo.", error);
  document.documentElement.dataset.demoState = "error";
  document.documentElement.dataset.demoError = message;
  document.body.textContent = `Unable to start the Babylon.js demo: ${message}`;
});