# s2i-build
[![s2i-build Example](https://github.com/redhat-actions/s2i-build/workflows/Build%20and%20Push/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A"Build+and+Push")
[![Verify Build](https://github.com/redhat-actions/s2i-build/workflows/Install%20and%20Build/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Install%2C+Build+and+Test%22)
[![Verify Bundle](https://github.com/redhat-actions/s2i-build/workflows/Verify%20Bundle/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Verify+Bundle%22)
<br></br>
[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/s2i-build?sort=semver)](https://github.com/redhat-actions/s2i-build/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/s2i-build)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/s2i-build/dist/index.js)](./dist)

`s2i-build` is a Github Action to build OCI-compatible container images from source code.

[Source-to-Image (S2I)](https://github.com/openshift/source-to-image) is a toolkit and workflow for building reproducible
container images from source code.
S2I produces images by injecting source code into a base S2I container image
and letting the container prepare that source code for execution. The base
S2I container images contain the language runtime and build tools needed for
building and running the source code.

This Action will install [the latest](https://github.com/openshift/source-to-image/releases/tag/v1.3.1) version of S2I.

**NOTE:**
`s2i-build` only works on Linux platforms, because it relies on the Docker daemon.<br>
If you are using GitHub's Ubuntu runners, the Docker daemon will already be available.
Otherwise, you can use [Docker Setup Buildx](https://github.com/marketplace/actions/docker-setup-buildx) to set up and start the Docker daemon.

Also see [buildah-build](https://github.com/redhat-actions/buildah-build) for more configurable method of building images, from scratch or from a Dockerfile.

Once an image has been built, [push-to-registry](https://github.com/redhat-actions/push-to-registry) can be used to push it to an image registry.

## Action Inputs

<table>
  <thead>
    <tr>
      <th>Input</th>
      <th>Required</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>builder_image</td>
    <td>Yes</td>
    <td>-</td>
    <td>
      The location of the S2I builder image. Curated list of builder images can be found
      <a href="https://github.com/redhat-actions/s2i-build/blob/main/builder-images.md">here</a>.
    </td>
  </tr>

  <tr>
    <td>image_name</td>
     <td>Yes</td>
    <td>-</td>
    <td>The name of the image to produce. </td>
  </tr>

  <tr>
    <td>image_tag</td>
    <td>No</td>
    <td>latest</td>
    <td>The tag of the image to produce.</td>
  </tr>

  <tr>
    <td>path_context</td>
    <td>No</td>
    <td><code>.</code></td>
    <td>The location of the path to run S2I from. This should be the path where your source code is stored.</td>
  </tr>

  <tr>
    <td>log_level</td>
    <td>No</td>
    <td>1</td>
    <td><a href="https://github.com/openshift/source-to-image/blob/master/docs/cli.md#log-levels">Log level</a> when running S2I. Can be 0 (least verbose) to 5 (most verbose).</td>
  </tr>

</table>

## Builder Images

Please refer [here](https://github.com/redhat-actions/s2i-build/blob/main/builder-images.md) for curated list of well maintained builder images to use for S2I.

## Examples

Below is an example for end to end workflow to build and push a Java application image using s2i-build action.

```yaml
# This workflow builds a container image of a java
# application using the source to image build strategy,
# and pushes the image to quay.io.

steps:
  env:
    IMAGE_NAME: my-java-app
    IMAGE_TAG: v1

  - name: Checkout
    uses: actions/checkout@v2

  # Setup S2i and Build container image
  - name: Setup and Build
    uses: redhat-actions/s2i-build@v1
    with:
      path_context: '.'
      # Builder image for a java project
      builder_image: 'registry.access.redhat.com/openjdk/openjdk-11-rhel7'
      image_name: ${{ env.IMAGE_NAME }}
      image_tag: ${{ env.IMAGE_TAG }}

  # Push Image to Quay registry
  - name: Push To Quay Action
    uses: redhat-actions/push-to-registry@v1
    with:
      image: ${{ env.IMAGE_NAME }}
      tag: ${{ env.IMAGE_TAG }}
      registry: quay.io/${{ secrets.QUAY_USERNAME }}
      username: ${{ secrets.QUAY_USERNAME }}
      password: ${{ secrets.QUAY_PASSWORD }}

```

## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub Issues](https://github.com/redhat-actions/s2i-build/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](./LICENSE) for more information.
