# s2i-build
[![CI checks](https://github.com/redhat-actions/s2i-build/workflows/CI%20checks/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22CI+checks%22)
[![Verify Build](https://github.com/redhat-actions/s2i-build/workflows/Verify%20Build/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Verify+Build%22)
[![Link checker](https://github.com/redhat-actions/s2i-build/workflows/Link%20checker/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Link+checker%22)
<br></br>
[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/s2i-build)](https://github.com/redhat-actions/s2i-build/tags)
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

<a id="action-inputs"></a>

## Action Inputs

| Input Name | Description | Default |
| ---------- | ----------- | ------- |
| builder_image | The path of the S2I builder image. A curated list of builder images can be found [here](./builder-images.md). | **Required**
| env_vars | List of environment variable key-value pairs to pass to the S2I builder context. (eg. `key=value`, `mysecret=${{ secrets.MY_SECRET }}`). | None
| image | Name to give to the output image. | **Required**
| tags | The tags of the image to build. For multiple tags, separate by a space. For example, `latest ${{ github.sha }}` | `latest`
| log_level | [Log level](https://github.com/openshift/source-to-image/blob/master/docs/cli.md#log-levels) when running S2I. Can be 0 (least verbose) to 5 (most verbose). | `1`
| path_context | The location of the path to run S2I from. This should be the path where your source code is stored. | `.`

<a id="outputs"></a>

## Action Outputs

`image`: The name of the built image.<br>
For example, `spring-image`.

`tags`: A list of the tags that were created, separated by spaces.<br>
For example, `latest v1`.

## Builder Images

Please refer [here](./builder-images.md) for a curated list of well maintained builder images to use for S2I.

## Examples

Below is an example end to end workflow to build and push a Java application image using s2i-build.

```yaml
# This workflow builds a container image of a java
# application using the source to image build strategy,
# and pushes the image to quay.io.

steps:
  env:
    IMAGE_NAME: my-java-app
    TAGS: v1 ${{ github.sha }}

  - name: Checkout
    uses: actions/checkout@v2

  # Setup S2i and Build container image
  - name: Setup and Build
    id: build_image
    uses: redhat-actions/s2i-build@v2
    with:
      path_context: '.'
      # Builder image for a java project
      builder_image: 'registry.access.redhat.com/openjdk/openjdk-11-rhel7'
      image: ${{ env.IMAGE_NAME }}
      tags: ${{ env.TAGS }}

  # Push Image to Quay registry
  - name: Push To Quay Action
    uses: redhat-actions/push-to-registry@v2
    with:
      image: ${{ steps.build_image.outputs.image }}
      tags: ${{ steps.build_image.outputs.tags }}
      registry: quay.io/${{ secrets.QUAY_USERNAME }}
      username: ${{ secrets.QUAY_USERNAME }}
      password: ${{ secrets.QUAY_PASSWORD }}
```
