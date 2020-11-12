"use strict";
/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
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
exports.Command = void 0;
const exec = require("@actions/exec");
// import * as split from 'argv-split';
// import * as sub from 'substituter';
class Command {
    static execute(s2iPath, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!s2iPath) {
                return Promise.reject(new Error('Unable to find s2i bundle'));
            }
            // const cmdArgs = Command.prepareS2iArgs(args);
            const exitCode = yield exec.exec(`${s2iPath} ${args}`);
            return exitCode;
        });
    }
}
exports.Command = Command;
