import { spawn } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const projectDirectory = new URL("../", import.meta.url);
export const distDirectory = new URL("../dist/", import.meta.url);
export const publicDirectory = new URL("../public/", import.meta.url);
export const sourceDirectory = new URL("../src/", import.meta.url);

const babylonPackages = ["core", "loaders"];
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
