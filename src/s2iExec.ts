/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as core from '@actions/core';
import { Installer } from './installer';
import {
    BinaryVersion,
    convertStringToBinaryVersion,
    FindBinaryStatus,
    getReason
  } from './utils/execHelper';
export async function run(): Promise<void> {
    const version = core.getInput('version');
    const builderImage = core.getInput('builder_image');
    const imageName = core.getInput('image_name');
    const imageTag = core.getInput('image_tag');
    const pathContext = core.getInput('path_context');
    const logLevel = core.getInput('log_level');
    const runnerOS = process.env.RUNNER_OS;
  
    core.debug(version);
    core.debug(runnerOS);
    core.debug(process.env.RUNNER_TEMP);
    
    const binaryVersion: BinaryVersion = convertStringToBinaryVersion(version);
    const s2iBinary: FindBinaryStatus = await Installer.installS2i(binaryVersion, runnerOS);

    if (s2iBinary.found === false) {
      return Promise.reject(new Error(getReason(s2iBinary)));
    }
  
    Installer.addS2iToPath(s2iBinary.path, runnerOS);
  }
  
  run().catch(core.setFailed);