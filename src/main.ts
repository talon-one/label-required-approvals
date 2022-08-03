import {
  getInput,
  error as coreError,
  setFailed,
  info,
  notice,
} from "@actions/core";
import { context } from "@actions/github";
import { createClient, getApprovals, getPrLabels } from "./github";
import { intersection } from "./intersection";
import { getLabelConfig, getRequireApprovals } from "./labels";

const run = async () => {
  try {
    const token = getInput("repo-token", { required: true });
    const configPath = getInput("configuration-path", { required: true });
    const client = createClient(token);
    const prNumber = context.payload.pull_request?.number;

    if (!prNumber) {
      notice("Could not get a pull request number from context, exiting...");
      return;
    }

    const yamlConfig = await getLabelConfig(configPath);

    if (!yamlConfig) {
      setFailed("Error reading the config yaml file");
      return;
    }

    const prLabels = await getPrLabels(
      client,
      prNumber,
      context.repo.owner,
      context.repo.repo
    );

    const requiredReviews = getRequireApprovals(yamlConfig, prLabels);

    const approvals = await getApprovals(
      client,
      prNumber,
      context.repo.owner,
      context.repo.repo
    );

    const needsApprovalFrom = Object.entries(requiredReviews).reduce(
      (accum, [key, value]) => {
        const intersect = intersection([value, approvals]);
        if (!intersect.length) {
          accum.push(key);
        }
        return accum;
      },
      [] as string[]
    );

    if (needsApprovalFrom.length) {
      throw new Error(
        `Missing approvals from labels: ${needsApprovalFrom.join()}`
      );
    }
  } catch (error: any) {
    setFailed(error.message);
  }
};

run();
