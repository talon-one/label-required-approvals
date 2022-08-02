var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { context, getOctokit } from "@actions/github";
export function createClient(token) {
    return getOctokit(token);
}
export function getPrNumber() {
    var _a;
    return ((_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.number) || undefined;
}
export function getPrLabels(client, prNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.graphql(`
      {
        viewer {
          pullRequests(states: OPEN, first: 100) {
            edges {
              node {
                number
                repository {
                  name
                }
                labels(first: 100) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `);
        return data;
    });
}
