import fs from "fs";
import path from "path";
import {
  createDirectories,
  writeFile,
  getClassName,
} from "../utils/fileHelpers.js";
import { LoggerHelpers } from "../utils/loggerHelpers.js";

export { generateModule };

function generateModule(moduleName: string) {
  const modulePath = path.join("lib", "module", moduleName);
  const directories = ["bloc", "event", "state", "screen", "import", "factory"];

  createDirectories(modulePath, directories);

  LoggerHelpers.info(`Creating module structure for ${moduleName}...`);

  generateBloc(moduleName, path.join(modulePath, "bloc"));
  generateEvent(moduleName, path.join(modulePath, "event"));
  generateState(moduleName, path.join(modulePath, "state"));
  generateScreen(moduleName, path.join(modulePath, "screen"));
  generateImport(moduleName, path.join(modulePath, "import"));
  generateStateFactory(moduleName, path.join(modulePath, "factory"));

  LoggerHelpers.success(`Module ${moduleName} created with full structure.`);
}

function generateBloc(moduleName: string, blocPath: string) {
  const blocFilePath = path.join(blocPath, `${moduleName}_bloc.dart`);
  const className = getClassName(moduleName, "bloc");

  const template = `part of '../import/${moduleName}_import.dart';

class ${className}Bloc extends BaseBloc {
    ${className}Bloc() : super(
    ${className}Factory(), 
    initialState: ${className}InitialState(),
    ) {}

    @override
    void onDispose() {}
}
  `;

  writeFile(blocFilePath, template);
  LoggerHelpers.success(
    `Bloc file ${moduleName}_bloc.dart created in ${blocPath}`
  );
}

function generateEvent(moduleName: string, eventPath: string) {
  const eventFilePath = path.join(eventPath, `${moduleName}_event.dart`);
  const className = getClassName(moduleName, "event");

  const template = `part of '../import/${moduleName}_import.dart';

class ${className}InitialEvent extends BaseEvent {}
  `;

  writeFile(eventFilePath, template);
  LoggerHelpers.success(
    `Event file ${moduleName}_event.dart created in ${eventPath}`
  );
}

function generateState(moduleName: string, statePath: string) {
  const stateFilePath = path.join(statePath, `${moduleName}_state.dart`);
  const className = getClassName(moduleName, "state");

  const template = `part of '../import/${moduleName}_import.dart';

class ${className}InitialState extends RenderDataState {
  ${className}InitialState() : super(null);
}
  `;

  writeFile(stateFilePath, template);
  LoggerHelpers.success(
    `State file ${moduleName}_state.dart created in ${statePath}`
  );
}

function generateScreen(moduleName: string, screenPath: string) {
  const screenFilePath = path.join(screenPath, `${moduleName}_screen.dart`);
  const className = getClassName(moduleName, "screen");

  const template = `part of '../import/${moduleName}_import.dart';

class ${className}Screen extends StatefulWidget {
  final ${className}Bloc bloc;
  const ${className}Screen({super.key, required this.bloc});

  @override
  _${className}ScreenState createState() => _${className}ScreenState(bloc);
}

class _${className}ScreenState extends BaseScreen<${className}Bloc, ${className}Screen, dynamic> {
  _${className}ScreenState(super.bloc);

  @override
  Widget buildWidget(BuildContext context, RenderDataState state) {
    return Container();
  }
  
  @override
  void listenToState(BuildContext context, BaseState state) {}
}
  `;

  writeFile(screenFilePath, template);
  LoggerHelpers.success(
    `Screen file ${moduleName}_screen.dart created in ${screenPath}`
  );
}

function generateImport(moduleName: string, importPath: string) {
  const importFilePath = path.join(importPath, `${moduleName}_import.dart`);
  const className = getClassName(moduleName, "import");

  const template = `import 'package:flutter/material.dart';
import 'package:opticore/opticore.dart';

part '../bloc/${moduleName}_bloc.dart';
part '../event/${moduleName}_event.dart';
part '../screen/${moduleName}_screen.dart';
part '../state/${moduleName}_state.dart';
part '../factory/${moduleName}_factory.dart';
  `;

  writeFile(importFilePath, template);
  LoggerHelpers.success(
    `Import file ${moduleName}_import.dart created in ${importPath}`
  );
}

function generateStateFactory(moduleName: string, factoryPath: string) {
  const factoryFilePath = path.join(
    factoryPath,
    `${moduleName}_factory.dart`
  );
  const className = getClassName(moduleName, "state_factory");

  const template = `part of '../import/${moduleName}_import.dart';

class ${className}Factory extends BaseFactory {
  @override
  BaseState getState<M>(M data) {
    return DefaultState();
  }
}
  `;

  writeFile(factoryFilePath, template);
  LoggerHelpers.success(
    `State Factory file ${moduleName}_factory.dart created in ${factoryPath}`
  );
}
