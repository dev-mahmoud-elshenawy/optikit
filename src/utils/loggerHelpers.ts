import chalk from "chalk";

export class LoggerHelpers {
  static success(message: string) {
    console.log(chalk.green(message));
  }

  static error(message: string) {
    console.log(chalk.red(message));
  }

  static warning(message: string) {
    console.log(chalk.yellow(message));
  }

  static info(message: string) {
    console.log(chalk.hex('#add8e6')(message));
  }
}
