import { getInput, error as coreError, setFailed, info } from "@actions/core";
import { context } from "@actions/github";
import { createClient, getPrLabels } from "./github";

async function run() {
  try {
    const token = getInput("repo-token", { required: true });
    const configPath = getInput("configuration-path", { required: true });
    const client = createClient(token);
    const prNumber = context.payload.pull_request?.number;

    const labels = getPrLabels(client, prNumber);

    console.log(`labels test: ${labels.toString()}`);
  } catch (error: any) {
    coreError(error);
    setFailed(error.message);
  }
}
