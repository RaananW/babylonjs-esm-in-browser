import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  build,
  compileTypeScript,
  copyPublicFiles,
  distDirectory,
  publicDirectory,
  sourceDirectory,
} from "./build.mjs";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".wasm", "application/wasm"],
]);
const distPath = resolve(fileURLToPath(distDirectory));
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

await build();

const server = createServer(async (request, response) => {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  const relativePath = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
  const filePath = resolve(distPath, `.${relativePath}`);

  if (filePath !== distPath && !filePath.startsWith(`${distPath}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
    });
    response.end(body);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      response.writeHead(404).end("Not found");
      return;
    }

    console.error(`Unable to serve ${filePath}.`, error);
    response.writeHead(500).end("Internal server error");
  }
});

let rebuilding = false;
let rebuildRequested = false;
let rebuildTimer;

async function rebuild() {
  if (rebuilding) {
    rebuildRequested = true;
    return;
  }

  rebuilding = true;

  do {
    rebuildRequested = false;

    try {
      await Promise.all([compileTypeScript(), copyPublicFiles()]);
      console.log("Rebuilt successfully.");
    } catch (error) {
      console.error("Rebuild failed.", error);
    }
  } while (rebuildRequested);

  rebuilding = false;
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuild, 100);
}

const watchers = [sourceDirectory, publicDirectory].map((directory) => {
  const watcher = watch(directory, { recursive: true }, scheduleRebuild);
  watcher.on("error", (error) => console.error(`Unable to watch ${fileURLToPath(directory)}.`, error));
  return watcher;
});

server.listen(port, "localhost", () => {
  console.log(`Serving http://localhost:${port}`);
});

function shutDown() {
  clearTimeout(rebuildTimer);
  watchers.forEach((watcher) => watcher.close());
  server.close();
}

process.once("SIGINT", shutDown);
process.once("SIGTERM", shutDown);
