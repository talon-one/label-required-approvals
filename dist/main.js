var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getInput, error as coreError, setFailed, info } from "@actions/core";
import { context } from "@actions/github";
import { createClient, getPrLabels } from "./github";
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = getInput("repo-token", { required: true });
            const configPath = getInput("configuration-path", { required: true });
            const client = createClient(token);
            const prNumber = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number;
            const labels = getPrLabels(client, prNumber);
            info(`labels: ${labels.toString()}`);
        }
        catch (error) {
            coreError(error);
            setFailed(error.message);
        }
    });
}
