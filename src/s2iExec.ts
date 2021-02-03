/* -----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";
import { Command } from "./command";
import { Installer } from "./installer";
import { Inputs } from "./generated/inputs-outputs";
import {
    BinaryVersion, convertStringToBinaryVersion, FindBinaryStatus, getReason,
} from "./utils/execHelper";

export async function run(): Promise<void> {
    const builderImage = core.getInput(Inputs.BUILDER_IMAGE, { required: true });
    const imageName = core.getInput(Inputs.IMAGE_NAME, { required: true });
    const imageTag = core.getInput(Inputs.IMAGE_TAG, { required: false });
    const pathContext = core.getInput(Inputs.PATH_CONTEXT, { required: false });
    const logLevel = core.getInput(Inputs.LOG_LEVEL, { required: false });
    const envVars = core.getInput(Inputs.ENV_VARS, { required: false });
    const runnerOS = process.env.RUNNER_OS || process.platform;

    const version = "v1.3.1";
    core.debug(version);
    core.debug(runnerOS);

    const binaryVersion: BinaryVersion = convertStringToBinaryVersion(version);
    const s2iBinary: FindBinaryStatus = await Installer.installS2i(binaryVersion, runnerOS);

    if (s2iBinary.found === false) {
        throw new Error(getReason(s2iBinary));
    }

    Installer.addS2iToPath(s2iBinary.path, runnerOS);

    let envCmd = "";
    if (envVars) {
        const sha = process.env.GITHUB_SHA;
        const shortSha = sha ? sha.substring(0, 7) : "";

        const envFileName = `s2i-${shortSha}.env`;
        const envFilePath = path.join(process.cwd(), envFileName);

        await fs.promises.writeFile(envFilePath, envVars);
        envCmd = `--environment-file ${envFilePath}`;

        const envCount = envVars.split("\n").length;
        core.info(`Writing ${envCount} environment variables to ${envFilePath}`);
    }

    const buildCmd = [ "build", pathContext, builderImage, `${imageName}:${imageTag}`, "--loglevel", logLevel, envCmd ];

    await Command.execute(s2iBinary.path, buildCmd);
}

run().catch(core.setFailed);
