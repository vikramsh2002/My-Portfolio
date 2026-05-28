# Portfolio Project Sync

This repository includes a GitHub Models workflow that can turn pasted LinkedIn/profile project update text into a portfolio data PR.

The current implementation targets the portfolio Projects section. It uses the existing project card UI as the reference, so the automation updates data instead of rewriting React layout code.

## How to Run It

Make sure GitHub Models is enabled for the repository first.

1. Open the repository on GitHub.
2. Go to Actions.
3. Choose `Sync Portfolio Project with GitHub Models`.
4. Click `Run workflow`.
5. Paste the LinkedIn/profile update text. Include source, demo, live, or LinkedIn URLs if available.
6. Keep the default model or enter another GitHub Models id.
7. Optionally paste a `card_image_url` if the project does not have a live website that can be screenshotted.
8. Leave `auto_merge` off unless you want low-risk updates merged automatically.

## Automatic Trigger

The workflow also supports `repository_dispatch` with event type `linkedin_project_update`. A future LinkedIn watcher, form, or automation service can call this endpoint when it detects a new project update.

```bash
curl --request POST \
  --url https://api.github.com/repos/vikramsh2002/My-Portfolio/dispatches \
  --header "Authorization: Bearer <github-token>" \
  --header "Accept: application/vnd.github+json" \
  --data '{
    "event_type": "linkedin_project_update",
    "client_payload": {
      "linkedin_update": "Built and shipped a new project...",
      "model": "openai/gpt-4o",
      "auto_merge": false,
      "card_image_url": "https://example.com/project-card.png"
    }
  }'
```

## What It Changes

The workflow only updates `portfolio-v2/src/projects.json`, which feeds the exported portfolio `projects` array.

The workflow:

- Sends the current projects and pasted update to GitHub Models.
- Converts the update into structured project data.
- Prepares a project thumbnail by reusing an existing local image, downloading `card_image_url`, or capturing a screenshot from the live/demo URL.
- Applies an add/update to the project list.
- Runs the Vite build.
- Opens a pull request with a summary when the update is safe enough for review.
- Optionally enables auto-merge for low-risk updates after the build passes.
- Creates a GitHub issue when the update is high-risk, unclear, missing a usable project image, or the build fails.
- Sends a review email when email secrets are configured.

## Model Configuration

The workflow accepts a GitHub Models id. The default is:

```text
openai/gpt-4o
```

You can switch it to another model available in your GitHub Models catalog.

## Safety Rules

The workflow treats dependency, workflow, secret, layout, and broad code changes as high risk. High-risk or unclear updates do not get merged automatically. Missing or failed project thumbnails are also blocked. Instead, the workflow creates a review issue and can send an email alert.

## Preview Before Merge

For generated project PRs, use the `Deploy Portfolio Preview` workflow before merging when you want to see the exact rendered UI on a separate Pages URL.

The preview workflow:

- Builds the selected branch from this repository.
- Uses `VITE_BASE=/My-Portfolio-Preview/`.
- Pushes only the compiled `portfolio-v2/dist` files to the preview repository.
- Writes the preview link in the workflow summary.
- Can comment the preview link on a PR when `pr_number` is provided.

This keeps the live portfolio separate from preview testing.

## Email Alerts

Email alerts use Resend when these repository secrets are configured:

```text
RESEND_API_KEY
PORTFOLIO_ALERT_EMAIL
PORTFOLIO_ALERT_FROM
```

`PORTFOLIO_ALERT_FROM` is optional. If it is not set, the workflow uses Resend's onboarding sender.
