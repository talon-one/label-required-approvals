import {
  getInput,
  error as coreError,
  setFailed,
  info,
  notice,
} from "@actions/core";
import { context } from "@actions/github";
import { createClient, getPrLabels } from "./github";
import { readFile } from "fs/promises";
import { load } from "js-yaml";

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

    const config = await readFile(`./${configPath}`, "utf-8");
    const yamlConfig = load(config);

    if (!yamlConfig) {
      setFailed("Error reading the config yaml file");
      return;
    }

    info(`config -> ${JSON.stringify(yamlConfig)}`);

    // const labels = getPrLabels(client, prNumber);
    // console.log(`labels test: ${labels.toString()}`);

    const prLabels = await getPrLabels(
      client,
      prNumber,
      context.repo.owner,
      context.repo.repo
    );

    info(`pr labels - ${JSON.stringify(prLabels)}`);
  } catch (error: any) {
    coreError(error);
    setFailed(error.message);
  }
};

run();
