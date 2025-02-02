import { exec, spawn } from "child_process";
import { promisify } from "util";
import path from "path";
import { LoggerHelpers } from "../utils/loggerHelpers.js";

export const iosDirectory = path.join(process.cwd(), "ios");

const execAsync = promisify(exec);

export function handleExecResult(
  err: Error | null,
  stdout: string,
  stderr: string
) {
  if (err) {
    LoggerHelpers.error(`Error: ${err.message}`);
    return;
  }
  if (stderr) {
    LoggerHelpers.warning(`stderr: ${stderr}`);
  }
  if (stdout) {
    LoggerHelpers.success(`stdout: ${stdout}`);
  }
}

export async function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fullCommand = `${command}`;
    const process = spawn(fullCommand, { shell: true });

    let output = "";
    let lastLogLine = "";

    process.stdout.on("data", (data) => {
      const dataString = data.toString().trim();
      output += dataString;

      if (dataString) {
        if (
          (dataString.endsWith("ms") || dataString.endsWith("s")) &&
          lastLogLine
        ) {
          lastLogLine += ` ${dataString}`;
        } else {
          if (lastLogLine) {
            LoggerHelpers.success(lastLogLine);
          }
          lastLogLine = dataString;
        }
      }
    });

    process.stderr.on("data", (data) => {
      LoggerHelpers.error(data.toString());
    });

    process.on("close", (code) => {
      if (lastLogLine) {
        LoggerHelpers.success(lastLogLine);
      }

      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve(output);
      }
    });

    process.on("error", (err) => {
      reject(new Error(`Failed to start subprocess: ${err.message}`));
    });
  });
}

export async function execInIos(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fullCommand = `cd "${iosDirectory}" && ${command}`;
    const process = spawn(fullCommand, { shell: true, timeout: 600000 });
    let output = "";
    let lastLogLine = "";

    process.stdout.on("data", (data) => {
      const dataString = data.toString().trim();
      output += dataString;

      if (dataString) {
        if (
          (dataString.endsWith("ms") || dataString.endsWith("s")) &&
          lastLogLine
        ) {
          lastLogLine += ` ${dataString}`;
        } else {
          if (lastLogLine) {
            LoggerHelpers.success(lastLogLine);
          }
          lastLogLine = dataString;
        }
      }
    });

    process.stderr.on("data", (data) => {
      LoggerHelpers.error(data.toString());
    });

    process.on("close", (code) => {
      if (lastLogLine) {
        LoggerHelpers.success(lastLogLine);
      }

      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve(output);
      }
    });

    process.on("error", (err) => {
      reject(new Error(`Failed to start subprocess: ${err.message}`));
    });
  });
}

export async function execInIosWithRetry(command: string, retries: number = 3, delay: number = 5000): Promise<string> {
  let attempts = 0;
  let lastError: any;

  while (attempts < retries) {
    try {
      const result = await execInIos(command);
      return result; 
    } catch (error) {
      attempts++;
      lastError = error;

      if (error instanceof Error) {
        LoggerHelpers.error(`Attempt ${attempts} failed. Error: ${error.message}`);
      } else {
        LoggerHelpers.error(`Attempt ${attempts} failed. Unknown error: ${JSON.stringify(error)}`);
      }

      if (attempts >= retries) {
        if (lastError instanceof Error) {
          LoggerHelpers.error(`Command failed after ${retries} attempts: ${lastError.message}`);
        } else {
          LoggerHelpers.error(`Command failed after ${retries} attempts: Unknown error`);
        }

        throw new Error(`Command failed after ${retries} attempts: ${lastError instanceof Error ? lastError.message : "Unknown error"}`);
      }

      LoggerHelpers.error(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}