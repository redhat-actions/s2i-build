/* -----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as core from "@actions/core";
import * as fs from "fs";
import * as io from "@actions/io";
import * as path from "path";
import { Command } from "./command";
import { Installer } from "./installer";
import { Inputs, Outputs } from "./generated/inputs-outputs";
import {
    BinaryVersion, convertStringToBinaryVersion, FindBinaryStatus, getReason,
} from "./utils/execHelper";

export async function run(): Promise<void> {
    const DEFAULT_TAG = "latest";
    const builderImage = core.getInput(Inputs.BUILDER_IMAGE, { required: true });
    const image = core.getInput(Inputs.IMAGE, { required: true });
    const tags = core.getInput(Inputs.TAGS, { required: false });
    const pathContext = core.getInput(Inputs.PATH_CONTEXT, { required: false });
    const logLevel = core.getInput(Inputs.LOG_LEVEL, { required: false });
    const envVars = core.getInput(Inputs.ENV_VARS, { required: false });
    const includeGit = core.getInput(Inputs.INCLUDE_GIT, { required: false });
    const runnerOS = process.env.RUNNER_OS || process.platform;

    const tagsList: string[] = tags.split(" ");

    let s2iPath = await io.which("s2i", false);

    if (s2iPath === "") {
        const s2iVersion = "v1.3.1";
        core.info(`⏳ s2i is not installed. Installing s2i ${s2iVersion}`);
        const binaryVersion: BinaryVersion = convertStringToBinaryVersion(s2iVersion);
        const s2iBinary: FindBinaryStatus = await Installer.installS2i(binaryVersion, runnerOS);

        if (s2iBinary.found === false) {
            throw new Error(getReason(s2iBinary));
        }

        core.info(`✅ Sucessfully installed s2i.`);

        s2iPath = s2iBinary.path;
    }
    else {
        core.info(`ℹ️ s2i is already installed, skipping installation`);
    }
    Installer.addS2iToPath(s2iPath, runnerOS);

    core.debug(runnerOS);

    // info message if user doesn't provides any tag
    if (tagsList.length === 0) {
        core.info(`Input "${Inputs.TAGS}" is not provided, using default tag "${DEFAULT_TAG}"`);
        tagsList.push(DEFAULT_TAG);
    }

    const buildCmd = [
        "build", pathContext, builderImage, `${image}:${tagsList[0]}`, "--loglevel", logLevel
    ];

    if (includeGit && includeGit != 'false') {
        buildCmd.push("--copy");
        buildCmd.push("--exclude=''");
    }

    if (envVars) {
        const sha = process.env.GITHUB_SHA;
        const shortSha = sha ? sha.substring(0, 7) : "";

        const envFileName = `s2i-${shortSha}.env`;
        const envFilePath = path.join(process.cwd(), envFileName);

        await fs.promises.writeFile(envFilePath, envVars);

        const envCount = envVars.split("\n").length;
        core.info(`Writing ${envCount} environment variables to ${envFilePath}`);

        buildCmd.push("--environment-file");
        buildCmd.push(envFilePath);
    }

    await Command.execute(s2iPath, buildCmd);

    if (tagsList.length > 1) {
        await Command.tag(image, tagsList);
    }

    core.setOutput(Outputs.IMAGE, image);
    core.setOutput(Outputs.TAGS, tags);
}

run().catch(core.setFailed);
