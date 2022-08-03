import { info } from "@actions/core";
import { readFile } from "fs/promises";
import { load } from "js-yaml";

interface YamlConfigInt {
  [key: string]: string[];
}

export async function getLabelConfig(
  configPath: string
): Promise<YamlConfigInt> {
  info(`workspace ${process.env.GITHUB_WORKSPACE}`);
  const config = await readFile(`./${configPath}`, "utf-8");
  return load(config) as YamlConfigInt;
}

export function getRequireApprovals(
  yamlConfig: YamlConfigInt,
  labels: string[]
) {
  return labels.reduce((accum, label) => {
    if (yamlConfig[label]?.length) {
      accum[label] = [...yamlConfig[label]];
    }
    return accum;
  }, {} as { [key: string]: string[] });
}
