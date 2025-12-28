const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      core.setFailed("Missing GITHUB_TOKEN");
      return;
    }

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (!context.payload.pull_request) {
      core.info("Not a pull request, skipping");
      return;
    }

    const { owner, repo } = context.repo;
    const pull_number = context.payload.pull_request.number;

    const files = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
      per_page: 100,
    });

    const forbiddenPatterns = [
      /^\.env$/,
      /^\.env\./,
      /\.env$/,
    ];

    const matches = files.data
      .map(file => file.filename)
      .filter(name =>
        forbiddenPatterns.some(rx => rx.test(name))
      );

    if (matches.length > 0) {
      core.setFailed(
        `❌ Forbidden .env files detected:\n\n${matches
          .map(f => `- ${f}`)
          .join("\n")}\n\nRemove these files and use GitHub Secrets instead.`
      );
    } else {
      core.info("✅ No .env files detected");
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();