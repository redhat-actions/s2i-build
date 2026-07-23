# s2i-build Changelog

## v3
- Upgrade action runtime to Node24
- Upgrade s2i to `v1.6.2` with tool-cache caching for faster builds
- Switch to ESM output to fix `@actions/*` module resolution
- Upgrade all dependencies to current stable versions (`@actions/core` v3, `@actions/exec` v3, `@actions/io` v3, `@actions/tool-cache` v4, TypeScript v6)
- Fix docker tag bug and correct action metadata ([#61](https://github.com/redhat-actions/s2i-build/pull/61))
- Modernize CI workflows to current GitHub Actions standards ([#60](https://github.com/redhat-actions/s2i-build/pull/60))
- Add CODEOWNERS, SECURITY.md, and Dependabot configuration
- Remove defunct CRDA code scanning workflow

## v2.4
- Update s2i version to `v1.3.9`
- Update action to run on Node20. https://github.blog/changelog/2023-09-22-github-actions-transitioning-from-node-16-to-node-20/

## v2.3
- Update action to run on Node16. https://github.blog/changelog/2022-05-20-actions-can-now-run-in-a-node-js-16-runtime/

## v2.2
- Feature include `.git` folder in s2i build. https://github.com/redhat-actions/s2i-build/pull/40

## v2.1
- Skip `s2i` installation if already installed in the runner.

## v2
- Rename `image_tag` input to `tags`, to allow you to build multiple tags of the same image
- Rename `image_name` input to `image` to maintain consistency across all redhat actions
- Add outputs `image` and `tags`, which output the image name and all tags of the image that was created

## v1.1.1
- Fix input `env_vars` bug

## v1.1
- Add support to provide environment variables

## v1.0
- Initial marketplace release

## v0.1
- Initial pre-release
