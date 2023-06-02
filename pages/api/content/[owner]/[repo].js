import { CmsBackend, GithubClient } from "@/airview-cms-api";
import fs from "fs";

const getCache = () => {
  const _cache = {};
  const get = (key) => {
    return _cache[key];
  };
  const set = (key, value) => (_cache[key] = value);
  return { get, set };
};
const cache = getCache();

const appId = process.env.GITHUB_APP_ID;
const installationId = process.env.GITHUB_INSTALLATION_ID;
const repo = process.env.GITHUB_REPO_NAME;
const org = process.env.GITHUB_ORG_NAME;
const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;

const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
const settings = {
  applicationId: appId,
  installationId: installationId,
  privateKey: privateKey,
  repositoryName: repo,
  organisation: org,
};
const client = new GithubClient(settings);

const backend = new CmsBackend(client, cache);

export default async function handler(req, res) {
  try {
    if (typeof req.query.path !== "string") {
      res.status(400).send();
      return;
    }
    const data = await backend.getExternalData(
      req.query.repo,
      req.query.owner,
      req.query.path
    );
    const content = Buffer.from(data.content ?? "", "base64").toString("utf8");
    res.status(200).json({ content });
  } catch (err) {
    console.log(err);
    res.status(404).send();
  }
}