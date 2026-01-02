# Facebook Watchman Evaluation for Solely Art Platform

## Executive Summary

**Recommendation: YES - Implement Watchman**

Facebook Watchman is an excellent solution for the EMFILE (too many open files) error affecting the Solely Art platform. It addresses the root cause of the problem rather than just treating symptoms.

## Current Problem Analysis

| Metric | Current State | Issue |
|--------|---------------|-------|
| Open Files | 52,034+ | Far exceeds ulimit of 1,024 |
| Chrome Handles | 37,452 | Playwright browser instances |
| Node Handles | 8,635 | Vite + tsx file watchers |
| Root Cause | Native fs.watch | Opens descriptor per file |

## How Watchman Solves This

### 1. Efficient File Descriptor Management

**Native Node.js fs.watch (Current):**
- Opens a file descriptor for EACH file being watched
- In a project with 10,000 files → 10,000 file descriptors
- Descriptors stay open as long as watch is active

**Watchman Approach:**
- Uses OS-level facilities (inotify on Linux, FSEvents on macOS)
- Maintains a **single persistent watch** on directory trees
- Does NOT open individual file descriptors
- Tracks changes using an "abstract clock" mechanism

### 2. Key Technical Advantages

| Feature | Native fs.watch | Watchman |
|---------|-----------------|----------|
| File Descriptors | 1 per file | ~1 per directory tree |
| CPU Usage | High (polling fallback) | Low (kernel events) |
| Reliability | Platform-dependent | Consistent cross-platform |
| Duplicate Events | Common | Filtered automatically |
| Large Projects | Struggles | Designed for scale |

### 3. How Watchman Works

```
┌─────────────────────────────────────────────────────────┐
│                    Watchman Server                       │
│  (Single daemon process managing all file watches)       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌──────────────┐    ┌──────────────┐                  │
│   │ inotify/     │    │  Abstract    │                  │
│   │ FSEvents     │───▶│  Clock       │                  │
│   │ (OS kernel)  │    │  Tracking    │                  │
│   └──────────────┘    └──────────────┘                  │
│                              │                           │
│                              ▼                           │
│   ┌──────────────────────────────────────────────┐      │
│   │         Subscription System                   │      │
│   │  - Only reports changes since last clock     │      │
│   │  - Filters by expression (*.js, *.ts, etc)   │      │
│   │  - Batches notifications efficiently         │      │
│   └──────────────────────────────────────────────┘      │
│                              │                           │
└──────────────────────────────┼───────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐           ┌─────────┐           ┌─────────┐
   │  Vite   │           │  tsx    │           │Playwright│
   │ Client  │           │ Client  │           │  Client  │
   └─────────┘           └─────────┘           └─────────┘
```

## Implementation Plan

### Step 1: Install Watchman (Ubuntu)

```bash
# Download latest release
wget https://github.com/facebook/watchman/releases/download/v2024.01.01.00/watchman_ubuntu22.04_v2024.01.01.00.deb

# Install
sudo dpkg -i watchman_ubuntu22.04_v2024.01.01.00.deb
sudo apt-get -f install

# Verify
watchman version
```

### Step 2: Install Node.js Client

```bash
pnpm add fb-watchman
```

### Step 3: Configure Vite to Use Watchman

Update `vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  server: {
    watch: {
      // Use polling with longer interval as fallback
      // Watchman will be used automatically if available
      usePolling: false,
      interval: 1000,
      // Ignore node_modules and other large directories
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    }
  }
});
```

### Step 4: Create Watchman Configuration

Create `.watchmanconfig` in project root:

```json
{
  "ignore_dirs": ["node_modules", ".git", "dist", "coverage", ".playwright"]
}
```

### Step 5: Configure tsx to Use Watchman (Optional)

For the server's tsx watch mode, Watchman integration requires a custom wrapper:

```typescript
// scripts/watchman-dev.ts
import watchman from 'fb-watchman';
import { spawn } from 'child_process';

const client = new watchman.Client();

client.capabilityCheck({ required: ['relative_root'] }, (error, resp) => {
  if (error) {
    console.error('Watchman not available, falling back to tsx watch');
    spawn('tsx', ['watch', 'server/_core/index.ts'], { stdio: 'inherit' });
    return;
  }
  
  // Use Watchman for efficient file watching
  // ... implementation
});
```

## Pros and Cons

### Pros

1. **Dramatically reduces file descriptors** - From 8,000+ to ~10
2. **Better performance** - Kernel-level events, no polling
3. **Reliable change detection** - No missed or duplicate events
4. **Scales to large projects** - Used by Meta for massive codebases
5. **Cross-platform** - Works on Linux, macOS, Windows
6. **Industry standard** - Used by React Native, Jest, Metro bundler

### Cons

1. **Additional dependency** - Requires Watchman daemon installation
2. **System-level install** - Not just an npm package
3. **Learning curve** - Different API than fs.watch
4. **Daemon management** - Need to ensure watchman is running
5. **Not built into Vite** - Requires custom integration

## Alternative Solutions Comparison

| Solution | Effectiveness | Complexity | Recommendation |
|----------|--------------|------------|----------------|
| **Watchman** | ★★★★★ | Medium | **Best choice** |
| Increase ulimit | ★★☆☆☆ | Low | Temporary fix only |
| graceful-fs | ★★☆☆☆ | Low | Already tried, limited help |
| Disable watch mode | ★★★☆☆ | Low | Hurts DX significantly |
| @parcel/watcher | ★★★★☆ | Medium | Good alternative |
| Production build for tests | ★★★☆☆ | Low | Good for CI only |

## Expected Results After Implementation

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Node File Handles | 8,635 | ~50-100 |
| Total Open Files | 52,034 | ~40,000 (mostly Chrome) |
| Dev Server Stability | Crashes | Stable |
| HMR Reliability | Inconsistent | Consistent |
| CPU Usage (idle) | High | Low |

## Quick Win: Reduce Chrome File Handles

While implementing Watchman, also configure Playwright to reduce browser instances:

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 1, // Reduce parallel workers
  use: {
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu'
      ]
    }
  }
});
```

## Conclusion

Facebook Watchman is the right tool for this problem. It was specifically designed to solve the exact issue we're facing - efficient file watching at scale without exhausting system resources.

**Next Steps:**
1. Install Watchman on the system
2. Add fb-watchman to dependencies
3. Configure Vite's server.watch options
4. Create .watchmanconfig
5. Test with full Playwright suite

## Additional Quick Fixes (From Research)

### 1. Increase inotify Watchers (Linux)

The most common solution - increase the system limit:

```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase temporarily
sudo sysctl fs.inotify.max_user_watches=524288
sudo sysctl -p

# Make permanent (add to /etc/sysctl.conf)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

**Note:** This treats the symptom, not the root cause. High values consume more memory.

### 2. Configure Vite to Ignore Directories

Update `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.playwright/**',
        '**/e2e-tests/.auth/**'
      ]
    }
  }
});
```

### 3. VS Code Watcher Exclusions

Add to `.vscode/settings.json`:

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/coverage/**": true,
    "**/.playwright/**": true
  }
}
```

### 4. Webpack-style watchOptions.ignored

From Webpack docs - the pattern applies to Vite too:

```javascript
// Ignore node_modules with regex
watchOptions: {
  ignored: /node_modules/
}

// Or with glob patterns
watchOptions: {
  ignored: ['**/node_modules', '**/.git']
}
```

## Root Cause Analysis

From Stack Overflow research:

> "Most answers above talk about raising the max number of watches. They don't talk about taking away the root cause. Typically, the root cause is just a matter of having watches that aren't used, they are completely redundant! This typically happens for files in `node_modules`. Moreover, this situation typically consumes **a lot of memory** unnecessarily and some older PCs may become slow because of it."

**The real solution is to:**
1. Stop watching directories you don't need (node_modules, .git, dist)
2. Use efficient watchers like Watchman that don't open per-file descriptors
3. Only increase system limits as a last resort

## Recommended Implementation Order

1. **Immediate** - Add `server.watch.ignored` to vite.config.ts
2. **Immediate** - Increase inotify limit to 524288
3. **Short-term** - Install Watchman for efficient watching
4. **Short-term** - Add VS Code watcher exclusions
5. **Long-term** - Configure Playwright to use fewer browser instances

## References

- [Watchman Documentation](https://facebook.github.io/watchman/)
- [Watchman Node.js Client](https://facebook.github.io/watchman/docs/nodejs)
- [Vite Troubleshooting Guide](https://vite.dev/guide/troubleshooting)
- [Webpack watchOptions.ignored](https://webpack.js.org/configuration/watch/#watchoptionsignored)
- [Stack Overflow: ENOSPC System Limit](https://stackoverflow.com/questions/55763428/react-native-error-enospc-system-limit-for-number-of-file-watchers-reached)
- [Chokidar vs Watchman Comparison](https://github.com/vitejs/vite/issues/13593)
