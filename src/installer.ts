/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as core from '@actions/core';
import * as fs from 'mz/fs';
import * as glob from 'glob';
import * as ioUtil from '@actions/io/lib/io-util';
import * as tc from '@actions/tool-cache';
import { BinaryVersion, FindBinaryStatus } from './utils/execHelper';
import {
    S2I_BASE_URL, S2I_WIN_ZIP, S2I_MACOSX_TAR_GZ, S2I_LINUX_TAR_GZ
} from './constants';

export class Installer {
    static async installS2i(versionToUse: BinaryVersion, runnerOS: string): Promise<FindBinaryStatus> {

        if (versionToUse.valid === false) {
            return { found: false, reason: versionToUse.reason };
        }

        const url: string = await Installer.getS2iURLToDownload(versionToUse, runnerOS);
        if (!url) {
            return { found: false, reason: 'Unable to determine URL where to download s2i executable.' };
        }

        core.debug(`downloading: ${url}`);
        const s2iBinary = await Installer.downloadAndExtract(url, runnerOS);
        return s2iBinary;
    }

    static async getS2iURLToDownload(version: BinaryVersion, runnerOS: string): Promise<string> {
        let url = '';
        if (!version.valid) {
            return undefined;
        }

        if (version.type === 'url') {
            return version.value;
        }

        if (version.type === 'latest') {
            url = await Installer.latest(runnerOS);
            return url;
        }

        const bundle = Installer.getS2iBundleByOS(runnerOS);
        if (!bundle) {
            core.debug('Unable to find s2i bundle url');
            return undefined;
        }

        url += bundle;

        core.debug(`archive URL: ${url}`);
        return url;
    }

    static async latest(runnerOS: string): Promise<string> {
        const bundle = Installer.getS2iBundleByOS(runnerOS);
        if (!bundle) {
            core.debug('Unable to find s2i bundle url');
            return null;
        }

        let url = `${S2I_BASE_URL}`;
        url += `${bundle}`


        core.debug(`latest stable s2i version: ${url}`);
        return url;
    }


    static async downloadAndExtract(url: string, runnerOS: string): Promise<FindBinaryStatus> {
        if (!url) {
            return { found: false, reason: 'URL where to download s2i is not valid.' };
        }

        let downloadDir = '';
        const pathS2iArchive = await tc.downloadTool(url);
        if (runnerOS === 'Windows') {
            downloadDir = await tc.extractZip(pathS2iArchive);
        } else {
            downloadDir = await tc.extractTar(pathS2iArchive);
        }

        let s2iBinary: string = Installer.s2iBinaryByOS(runnerOS);
        s2iBinary = await Installer.findS2iFile(downloadDir, s2iBinary);
        if (!await ioUtil.exists(s2iBinary)) {
            return { found: false, reason: `An error occurred while downloading and extracting s2i binary from ${url}. File ${s2iBinary} not found.` };
        }
        fs.chmodSync(s2iBinary, '0755');
        return { found: true, path: s2iBinary };
    }

    static getS2iBundleByOS(runnerOS: string): string | null {
        let url = '';
        // determine the bundle path based on the OS type
        switch (runnerOS) {
            case 'Linux': {
                url += `${S2I_LINUX_TAR_GZ}`;
                break;
            }
            case 'macOS': {
                url += `${S2I_MACOSX_TAR_GZ}`;
                break;
            }
            case 'Windows': {
                url += `${S2I_WIN_ZIP}`;
                break;
            }
            default: {
                return null;
            }
        }
        return url;
    }

    private static s2iBinaryByOS(osType: string): string {
        if (osType.includes('Windows')) return 's2i.exe';
        return 's2i';
    }

    static async findS2iFile(folder, file): Promise<string> {
        return new Promise((resolve, reject) => {
            glob(`${folder}/**/${file}`, (err, res) => {
                if (err) {
                    reject(new Error(`Unable to find s2i exewcutable inside the directory ${folder}`));
                } else {
                    resolve(res[0]);
                }
            });
        });
    }

    /**
   * Adds s2i to the PATH environment variable.
   *
   * @param s2iPath the full path to the s2i binary. Must be a non null.
   * @param osType the OS type. One of 'Linux', 'Darwin' or 'Windows_NT'.
   */
    static addS2iToPath(s2iPath: string, osType: string): void {
        if (!s2iPath) {
            core.debug('Unable to add null or empty s2i path to the PATH.');
            return;
        }
        let dir = '';
        if (osType.includes('Windows')) {
            dir = s2iPath.substr(0, s2iPath.lastIndexOf('\\'));
        } else {
            dir = s2iPath.substr(0, s2iPath.lastIndexOf('/'));
        }
        core.addPath(dir);
    }

}