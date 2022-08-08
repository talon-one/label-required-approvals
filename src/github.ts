import { context, getOctokit } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

export function createClient(token: string): InstanceType<typeof GitHub> {
  return getOctokit(token);
}

export function getPrNumber(): number | undefined {
  return context.payload.pull_request?.number || undefined;
}

export async function getPrLabels(
  client: InstanceType<typeof GitHub>,
  prNumber: number,
  owner: string,
  repo: string
) {
  const { data: pullRequest } = await client.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  return pullRequest.labels.map((label) => label.name);
}

export async function getApprovals(
  client: InstanceType<typeof GitHub>,
  prNumber: number,
  owner: string,
  repo: string
): Promise<(string | undefined)[]> {
  const { data: reviews } = await client.rest.pulls.listReviews({
    owner,
    repo,
    pull_number: prNumber,
  });

  const reviewers: Set<string | undefined> = new Set();
  (reviews || []).forEach((review) => {
    if (review.state === "APPROVED") {
      reviewers.add(review.user?.login);
    } else {
      reviewers.delete(review.user?.login);
    }
  });

  return [...reviewers];
}
