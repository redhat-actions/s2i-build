/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import * as exec from '@actions/exec';

export class Command {
  static async execute(s2iPath: string, args: string): Promise<number> {
    if (!s2iPath) {
      return Promise.reject(new Error('Unable to find s2i bundle'));
    }

    const exitCode = await exec.exec(`${s2iPath} ${args}`);
    return exitCode;
  }
}
