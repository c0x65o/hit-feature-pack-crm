# CRM Feature Pack Architecture

## Where CRM Code Lives

### Feature Pack Source Code
**Location:** `hit-feature-packs/hit-feature-pack-crm/src/`

This is where ALL the CRM frontend code lives:
- `src/pages/` - React page components (Dashboard, ContactList, DealList, etc.)
- `src/components/` - Reusable UI components (SummaryCards, PipelineMetrics, etc.)
- `src/hooks/` - React hooks for data fetching (useCrmMetrics, useCrmDeals, etc.)
- `src/services/` - Service layer code
- `src/schema/` - Database schema definitions

### Compiled/Built Code
**Location:** `hit-feature-packs/hit-feature-pack-crm/dist/`

After running `npm run build`, TypeScript compiles the source code into JavaScript here. This is what applications actually import and use.

### Application Integration
**Location:** `applications/hit-dashboard/`

The application references the feature pack in two places:

1. **package.json** - Links to the feature pack:
   ```json
   "@hit/feature-pack-crm": "file:../../hit-feature-packs/hit-feature-pack-crm"
   ```

2. **hit.yaml** - Declares the feature pack is enabled:
   ```yaml
   feature_packs:
     - name: crm
       version: "1.0.0"
   ```

## Why Updates Don't Appear Immediately

### The Build Process

1. **Edit source code** in `hit-feature-packs/hit-feature-pack-crm/src/`
2. **Build the feature pack**: `cd hit-feature-packs/hit-feature-pack-crm && npm run build`
   - This compiles TypeScript → JavaScript in `dist/`
3. **Application uses `dist/`** - The app imports from the built `dist/` folder, NOT the `src/` folder

### Common Issue: Code Updated But Dashboard Not Updated

**Problem:** You edited `src/pages/Dashboard.tsx` but the dashboard still shows old code.

**Solution:** You need to rebuild the feature pack:
```bash
cd hit-feature-packs/hit-feature-pack-crm
npm run build
```

Then restart your application dev server.

## Workflow for Making Changes

### When Editing Feature Pack Code:

1. **Edit source files** in `hit-feature-packs/hit-feature-pack-crm/src/`
2. **Build the feature pack**:
   ```bash
   cd hit-feature-packs/hit-feature-pack-crm
   npm run build
   ```
3. **Restart application** (if needed):
   ```bash
   cd applications/hit-dashboard
   npm run dev
   ```

### Watch Mode (Auto-rebuild):

For faster development, use watch mode:
```bash
cd hit-feature-packs/hit-feature-pack-crm
npm run dev  # Runs tsc --watch
```

This will automatically rebuild when you save files.

## What Gets Copied vs What Stays in Feature Pack

### Stays in Feature Pack (Imported via npm):
- ✅ All React components (`src/pages/`, `src/components/`)
- ✅ Hooks (`src/hooks/`)
- ✅ Services (`src/services/`)
- ✅ Route definitions (`feature-pack.yaml`)

### Gets Copied to Application (via `hit run`):
- ✅ Database schema → `applications/hit-dashboard/lib/feature-pack-schemas.ts`
- ✅ API routes → `applications/hit-dashboard/app/api/crm/`

The schema is copied (not imported) so the application has direct access to database types without npm dependency issues.

## Multiple Applications Using Same Feature Pack

If you have multiple applications using the CRM feature pack:

1. **Each application** has its own `hit.yaml` that references the feature pack
2. **Each application** runs `npm install` to link to the feature pack
3. **When you update the feature pack**, you need to:
   - Build it: `cd hit-feature-packs/hit-feature-pack-crm && npm run build`
   - Each application will pick up the changes (no need to reinstall)

## Troubleshooting

### "Module not found" errors:
- Make sure feature pack is built: `cd hit-feature-packs/hit-feature-pack-crm && npm run build`
- Make sure application has installed it: `cd applications/hit-dashboard && npm install`

### "Old code still showing":
- Rebuild feature pack: `npm run build` in feature pack directory
- Clear Next.js cache: `rm -rf applications/hit-dashboard/.next`
- Restart dev server

### TypeScript errors in feature pack:
- Install dependencies: `cd hit-feature-packs/hit-feature-pack-crm && npm install --legacy-peer-deps`
- Check `tsconfig.json` is correct
- Make sure peer dependencies (like `next`) are available

