/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as core from "@actions/core";
import { Command } from "./command";
import { Installer } from "./installer";
import * as fs from "fs";
import {
  BinaryVersion,
  convertStringToBinaryVersion,
  FindBinaryStatus,
  getReason,
} from "./utils/execHelper";
import { fileURLToPath } from "url";

export async function run(): Promise<void> {
  const builderImage = core.getInput("builder_image", { required: true });
  const imageName = core.getInput("image_name", { required: true });
  const imageTag = core.getInput("image_tag", { required: false });
  const pathContext = core.getInput("path_context", { required: false });
  const logLevel = core.getInput("log_level", { required: false });
  const envVars = core.getInput("env_vars", { required: false });
  const runnerOS = process.env.RUNNER_OS;

  const version = "v1.3.1";
  core.debug(version);
  core.debug(runnerOS);
  core.debug(process.env.RUNNER_TEMP);

  const binaryVersion: BinaryVersion = convertStringToBinaryVersion(version);
  const s2iBinary: FindBinaryStatus = await Installer.installS2i(
    binaryVersion,
    runnerOS
  );

  if (s2iBinary.found === false) {
    return Promise.reject(new Error(getReason(s2iBinary)));
  }

  Installer.addS2iToPath(s2iBinary.path, runnerOS);

  let envCmd = "";
  if (envVars !== "") {
    fs.writeFileSync("env-file", envVars);
    envCmd += "--environment-file env-file";
  }

  const buildCmd = [
    "build",
    pathContext,
    builderImage,
    `${imageName}:${imageTag}`,
    "--loglevel",
    logLevel,
    envCmd,
  ];

  await Command.execute(s2iBinary.path, buildCmd);
}

run().catch(core.setFailed);
