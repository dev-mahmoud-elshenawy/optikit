import fs from "fs";
import path from "path";
import { capitalize } from "./string.js";

export { createDirectories, writeFile, getClassName };

function createDirectories(modulePath: string, directories: string[]) {
  directories.forEach((dir) => {
    const dirPath = path.join(modulePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
}

function getClassName(moduleName: string, type: string): string {
  // Split module name by underscores and capitalize each part
  const defineItems = moduleName.split("_").filter(item => item.length > 0);
  let className = "";
  defineItems.forEach((item) => {
    className += capitalize(item);
  });
  return className;
}
