import { getInput } from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

export const STATE_ERROR = "error";
export const STATE_FAILURE = "failure";
export const STATE_PENDING = "pending";
export const STATE_SUCCESS = "success";

type CheckState = "error" | "failure" | "pending" | "success";

export const reportStatus = (
  client: InstanceType<typeof GitHub>,
  state: CheckState,
  description: string
) => {
  if (!process.env.CI) return;

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const sha = context.payload.pull_request?.head?.sha;
  const target_url = `https://github.com/${owner}/${repo}/actions/runs/${context.runId}`;
  const checkContex = getInput("status", { required: true });

  if (!sha) {
    throw new Error("PR sha missing!");
  }

  return client.rest.repos.createCommitStatus({
    owner,
    repo,
    sha,
    state,
    target_url,
    description,
    context: checkContex,
  });
};
