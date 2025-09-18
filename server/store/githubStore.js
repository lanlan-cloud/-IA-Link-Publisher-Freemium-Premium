const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GH_PAT });

async function publishContent(slug, htmlContent, meta) {
  const path = `public/${slug}.html`;
  const repo = { owner: "TU_USUARIO", repo: "tu-portfolio" };
  const message = `Publicar ${slug} (${meta.freemium ? "freemium" : "premium"})`;
  const contentBase64 = Buffer.from(htmlContent, "utf8").toString("base64");

  let sha;
  try {
    const existing = await octokit.repos.getContent({ ...repo, path });
    sha = existing.data.sha;
  } catch (e) {
    // si no existe, ignorar
  }

  await octokit.repos.createOrUpdateFileContents({
    ...repo,
    path,
    message,
    content: contentBase64,
    sha,
  });

  return `https://${repo.owner}.github.io/${repo.repo}/${slug}.html`;
}

module.exports = { publishContent };
