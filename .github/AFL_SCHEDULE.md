# AFL Season Schedule for GitHub Actions

This workflow is optimized for GitHub's free tier (2,000 minutes/month).

## Schedule Strategy

### Current Schedule:
- **Twice daily**: 9 AM and 9 PM AEST (11 UTC and 23 UTC)
- **Season aware**: Runs March-October (AFL season)
- **Manual trigger**: Available via GitHub Actions UI

### Resource Usage:
- **Runs per month**: ~60 (2/day × 30 days)
- **Minutes per run**: ~2-3 minutes
- **Total monthly usage**: ~120-180 minutes (well under 2,000 limit)

### Optimizations:
1. **Node.js 20** with npm caching for faster builds
2. **Production-only** dependencies (`--only=production`)
3. **Focused git status** check (only `public/data/` directory)
4. **Official bot identity** for commits
5. **Single commit** (removed redundant rebuild trigger)

### Manual Updates:
During heavy AFL activity (finals, etc.), you can manually trigger updates:
1. Go to Actions tab in GitHub
2. Select "Update AFL Ladders" workflow
3. Click "Run workflow"

### Off-Season:
The workflow will naturally run less frequently when no games are happening,
as the data won't change and no commits will be made.
