/* -----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as path from "path";
import CommandResult from "./types";

export class Command {
    public static async execute(
        executable: string,
        args: string[],
        execOptions: exec.ExecOptions & { group?: boolean } = {},
    ): Promise<CommandResult> {
        let stdout = "";
        let stderr = "";

        const finalExecOptions = { ...execOptions };
        finalExecOptions.ignoreReturnCode = true; // the return code is processed below

        finalExecOptions.listeners = {
            stdline: (line): void => {
                stdout += line + "\n";
            },
            errline: (line): void => {
                stderr += line + "\n";
            },
        };

        if (execOptions.group) {
            const groupName = [ executable, ...args ].join(" ");
            core.startGroup(groupName);
        }

        try {
            const exitCode = await exec.exec(executable, args, finalExecOptions);

            if (execOptions.ignoreReturnCode !== true && exitCode !== 0) {
                // Throwing the stderr as part of the Error makes the stderr show up in the action outline,
                // which saves some clicking when debugging.
                let error = `${path.basename(executable)} exited with code ${exitCode}`;
                if (stderr) {
                    error += `\n${stderr}`;
                }
                throw new Error(error);
            }

            return {
                exitCode, output: stdout, error: stderr,
            };
        }

        finally {
            if (execOptions.group) {
                core.endGroup();
            }
        }
    }

    public static async tag(image: string, tags: string[]): Promise<void> {
        // get docker cli
        let dockerPath: string;

        try {
            dockerPath = await io.which("docker", true);
        }
        catch (error) {
            core.debug(error);
            core.setFailed(
                "❌ Docker client not found. Make sure that docker client is installed before running this action"
            );
            return;
        }
        const args: string[] = [ "tag" ];
        for (const tag of tags) {
            args.push(`${image}:${tag}`);
        }
        core.info(`Tagging the built image with tags ${tags.toString()}`);
        Command.execute(dockerPath, args);
    }
}
