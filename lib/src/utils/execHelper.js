"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReason = exports.convertStringToBinaryVersion = void 0;
/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
const validUrl = require("valid-url");
function convertStringToBinaryVersion(version) {
    if (!version) {
        return { valid: false, reason: 'The action was run without any version as input.' };
    }
    if (version === 'latest') {
        return { valid: true, type: 'latest', value: version };
    }
    if (validUrl.isWebUri(version)) {
        return { valid: true, type: 'url', value: version };
    }
    const regexVersion = new RegExp('[0-9]+[.]{1}[0-9]+[.]{0,1}[0-9]*');
    const versionObj = regexVersion.exec(version);
    if (versionObj && versionObj.length > 0) {
        return { valid: true, type: 'number', value: version };
    }
    return { valid: false, reason: 'Version is written in an unknown format' };
}
exports.convertStringToBinaryVersion = convertStringToBinaryVersion;
function getReason(version) {
    return version.reason ? version.reason : 'error';
}
exports.getReason = getReason;
