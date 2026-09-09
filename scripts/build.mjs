import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectDirectory = new URL("../", import.meta.url);
export const distDirectory = new URL("../dist/", import.meta.url);
export const publicDirectory = new URL("../public/", import.meta.url);
export const sourceDirectory = new URL("../src/", import.meta.url);

const babylonPackages = ["core", "loaders"];
const babylonVersionPlaceholder = "__BABYLON_VERSION__";
const versionedHtmlFiles = [
  new URL("./index.html", distDirectory),
  new URL("./self-hosted/index.html", distDirectory),
  new URL("./jsdelivr/index.html", distDirectory),
  new URL("./unpkg/index.html", distDirectory),
];
const typescriptBin = fileURLToPath(
  new URL("../node_modules/typescript/bin/tsc", import.meta.url),
);

export function compileTypeScript() {
  return new Promise((resolve, reject) => {
    const compiler = spawn(
      process.execPath,
      [typescriptBin, "--project", fileURLToPath(new URL("../tsconfig.json", import.meta.url))],
      {
        cwd: fileURLToPath(projectDirectory),
        stdio: "inherit",
      },
    );

    compiler.once("error", reject);
    compiler.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `TypeScript was terminated by ${signal}.`
            : `TypeScript exited with code ${code ?? "unknown"}.`,
        ),
      );
    });
  });
}

export async function copyPublicFiles() {
  await cp(publicDirectory, distDirectory, { recursive: true });

  const versions = await Promise.all(
    babylonPackages.map(async (packageName) => {
      const packageJson = JSON.parse(
        await readFile(
          new URL(`../node_modules/@babylonjs/${packageName}/package.json`, import.meta.url),
          "utf8",
        ),
      );
      return packageJson.version;
    }),
  );
  const [babylonVersion] = versions;

  if (
    typeof babylonVersion !== "string" ||
    versions.some((version) => version !== babylonVersion)
  ) {
    throw new Error(`Babylon.js package versions must match: ${versions.join(", ")}.`);
  }

  await Promise.all(
    versionedHtmlFiles.map(async (file) => {
      const html = await readFile(file, "utf8");

      if (!html.includes(babylonVersionPlaceholder)) {
        throw new Error(`${fileURLToPath(file)} does not contain the version placeholder.`);
      }

      await writeFile(
        file,
        html.replaceAll(babylonVersionPlaceholder, babylonVersion),
      );
    }),
  );
}

async function copyBabylonPackages() {
  const destination = new URL("./@babylonjs/", distDirectory);
  await mkdir(destination, { recursive: true });
  await Promise.all(
    babylonPackages.map((packageName) =>
      cp(
        new URL(`../node_modules/@babylonjs/${packageName}/`, import.meta.url),
        new URL(`./${packageName}/`, destination),
        { recursive: true },
      ),
    ),
  );
}

export async function build() {
  await rm(distDirectory, { force: true, recursive: true });
  await mkdir(distDirectory, { recursive: true });
  await Promise.all([compileTypeScript(), copyPublicFiles(), copyBabylonPackages()]);
}

const invokedScript = process.argv[1] ? resolve(process.argv[1]) : undefined;

if (invokedScript === fileURLToPath(import.meta.url)) {
  await build();
  console.log(`Built ${fileURLToPath(distDirectory)}.`);
}
