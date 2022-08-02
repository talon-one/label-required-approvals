import {
  getInput,
  error as coreError,
  setFailed,
  debug,
  info,
} from "@actions/core";
import { context } from "@actions/github";
import { createClient, getPrLabels } from "./github";

const run = async () => {
  try {
    const token = getInput("repo-token", { required: true });
    const configPath = getInput("configuration-path", { required: true });
    const client = createClient(token);
    const prNumber = context.payload.pull_request?.number;
    const orgName = context.payload.repository?.owner.login;
    const repoName = context.payload.repository?.name;

    // const labels = getPrLabels(client, prNumber);
    // console.log(`labels test: ${labels.toString()}`);

    info(`number - ${prNumber}`);
    info(`orgname - ${orgName}`);
    info(`repoName - ${repoName}`);
  } catch (error: any) {
    coreError(error);
    setFailed(error.message);
  }
};

run();
