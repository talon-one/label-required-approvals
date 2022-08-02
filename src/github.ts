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
  prNumber: number | undefined
) {
  const data = await client.graphql(
    `
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
    `
  );

  return data;
}
