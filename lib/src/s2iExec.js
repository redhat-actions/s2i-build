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
exports.run = void 0;
/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/
const core = require("@actions/core");
const installer_1 = require("./installer");
const execHelper_1 = require("./utils/execHelper");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const binaryVersion = execHelper_1.convertStringToBinaryVersion(version);
        const s2iBinary = yield installer_1.Installer.installS2i(binaryVersion, runnerOS);
        if (s2iBinary.found === false) {
            return Promise.reject(new Error(execHelper_1.getReason(s2iBinary)));
        }
        installer_1.Installer.addS2iToPath(s2iBinary.path, runnerOS);
    });
}
exports.run = run;
run().catch(core.setFailed);
