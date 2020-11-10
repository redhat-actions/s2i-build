"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installer = void 0;
/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
const core = require("@actions/core");
const fs = require("mz/fs");
const glob = require("glob");
const ioUtil = require("@actions/io/lib/io-util");
const tc = require("@actions/tool-cache");
const constants_1 = require("./constants");
class Installer {
    static installS2i(versionToUse, runnerOS) {
        return __awaiter(this, void 0, void 0, function* () {
            if (versionToUse.valid === false) {
                return { found: false, reason: versionToUse.reason };
            }
            const url = yield Installer.getS2iURLToDownload(versionToUse, runnerOS);
            if (!url) {
                return { found: false, reason: 'Unable to determine URL where to download s2i executable.' };
            }
            core.debug(`downloading: ${url}`);
            const s2iBinary = yield Installer.downloadAndExtract(url, runnerOS);
            return s2iBinary;
        });
    }
    static getS2iURLToDownload(version, runnerOS) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '';
            if (!version.valid) {
                return undefined;
            }
            if (version.type === 'url') {
                return version.value;
            }
            if (version.type === 'latest') {
                url = yield Installer.latest(runnerOS);
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
        });
    }
    static latest(runnerOS) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundle = Installer.getS2iBundleByOS(runnerOS);
            if (!bundle) {
                core.debug('Unable to find s2i bundle url');
                return null;
            }
            // const url = `${S2I_BASE_URL}/${LATEST}/${bundle}`;
            let url = `${constants_1.S2I_BASE_URL}`;
            url += `${bundle}`;
            core.debug(`latest stable s2i version: ${url}`);
            return url;
        });
    }
    static downloadAndExtract(url, runnerOS) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                return { found: false, reason: 'URL where to download s2i is not valid.' };
            }
            let downloadDir = '';
            const pathS2iArchive = yield tc.downloadTool(url);
            if (runnerOS === 'Windows') {
                downloadDir = yield tc.extractZip(pathS2iArchive);
            }
            else {
                downloadDir = yield tc.extractTar(pathS2iArchive);
            }
            let s2iBinary = Installer.s2iBinaryByOS(runnerOS);
            s2iBinary = yield Installer.findS2iFile(downloadDir, s2iBinary);
            if (!(yield ioUtil.exists(s2iBinary))) {
                return { found: false, reason: `An error occurred while downloading and extracting s2i binary from ${url}. File ${s2iBinary} not found.` };
            }
            fs.chmodSync(s2iBinary, '0755');
            return { found: true, path: s2iBinary };
        });
    }
    static getS2iBundleByOS(runnerOS) {
        let url = '';
        // determine the bundle path based on the OS type
        switch (runnerOS) {
            case 'Linux': {
                url += `${constants_1.S2I_LINUX_TAR_GZ}`;
                break;
            }
            case 'macOS': {
                url += `${constants_1.S2I_MACOSX_TAR_GZ}`;
                break;
            }
            case 'Windows': {
                url += `${constants_1.S2I_WIN_ZIP}`;
                break;
            }
            default: {
                return null;
            }
        }
        return url;
    }
    static s2iBinaryByOS(osType) {
        if (osType.includes('Windows'))
            return 's2i.exe';
        return 's2i';
    }
    static findS2iFile(folder, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                glob(`${folder}/**/${file}`, (err, res) => {
                    if (err) {
                        reject(new Error(`Unable to find s2i exewcutable inside the directory ${folder}`));
                    }
                    else {
                        resolve(res[0]);
                    }
                });
            });
        });
    }
    /**
   * Adds s2i to the PATH environment variable.
   *
   * @param s2iPath the full path to the s2i binary. Must be a non null.
   * @param osType the OS type. One of 'Linux', 'Darwin' or 'Windows_NT'.
   */
    static addS2iToPath(s2iPath, osType) {
        if (!s2iPath) {
            core.debug('Unable to add null or empty s2i path to the PATH.');
            return;
        }
        let dir = '';
        if (osType.includes('Windows')) {
            dir = s2iPath.substr(0, s2iPath.lastIndexOf('\\'));
        }
        else {
            dir = s2iPath.substr(0, s2iPath.lastIndexOf('/'));
        }
        core.addPath(dir);
    }
}
exports.Installer = Installer;
