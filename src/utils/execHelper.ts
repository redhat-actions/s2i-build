/* -----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
import * as validUrl from "valid-url";

 interface BinaryVersionValid {
    readonly valid: true;
    readonly type: "url" | "number" | "latest";
    readonly value: string;
}

interface BinaryVersionNotValid {
    readonly valid: false;
    readonly reason: string;
}

export type BinaryVersion = BinaryVersionValid | BinaryVersionNotValid;

export interface BinaryFound {
    readonly found: true;
    readonly path: string;
  }

export interface BinaryNotFound {
    readonly found: false;
    readonly reason?: string;
  }

export type FindBinaryStatus = BinaryFound | BinaryNotFound;

export function convertStringToBinaryVersion(version: string): BinaryVersion {
    if (!version) {
        return { valid: false, reason: "The action was run without any version as input." };
    }
    if (version === "latest") {
        return { valid: true, type: "latest", value: version };
    }
    if (validUrl.isWebUri(version)) {
        return { valid: true, type: "url", value: version };
    }

    const regexVersion = new RegExp("[0-9]+[.]{1}[0-9]+[.]{0,1}[0-9]*");
    const versionObj = regexVersion.exec(version);
    if (versionObj && versionObj.length > 0) {
        return { valid: true, type: "number", value: version };
    }

    return { valid: false, reason: "Version is written in an unknown format" };
}

export function getReason(version: BinaryNotFound): string {
    return version.reason ? version.reason : "error";
}
