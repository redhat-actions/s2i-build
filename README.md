# s2i-build-action

[Source-to-Image (S2I)](https://github.com/openshift/source-to-image) is a toolkit and workflow for building reproducible
container images from source code
S2I produces images by injecting source code into a base S2I container image
and letting the container prepare that source code for execution. The base
S2I container images contains the language runtime and build tools needed for
building and running the source code.
s2i-build action works only on Linux, Windows and on Mac platforms at this time.

This Action will install latest version of s2i such that it can build the image
from source code.

This Action needs Docker daemon to be running. Suggest running [Docker Setup Buildx](https://github.com/marketplace/actions/docker-setup-buildx) to setup Docker Daemon.

## Action Inputs

<table>
  <thead>
    <tr>
      <th>Action input</th>
      <th>Description</th>
    </tr>
  </thead>

  <tr>
    <td>builder_image</td>
    <td>(Required) The location of the s2i builder image. </td>
  </tr>

  <tr>
    <td>image_name</td>
    <td>(Required) The Name of the image to build. </td>
  </tr>

  <tr>
    <td>image_tag</td>
    <td>(Optional) The version of the image to build. </td>
  </tr>

  <tr>
    <td>path_context</td>
    <td>(Optional) The location of the path to run s2i from. </td>
  </tr>

  <tr>
    <td>log_level</td>
    <td>(Optional) Log level when running the S2I. </td>
  </tr>

</table>

## Examples

```
name: Build
on: [push]

jobs:
  s2i-job:
    runs-on: ubuntu-latest
    name: A job to build image

    steps:
      - name: Set up Docker Buildx
        id: buildx
        uses: docker/setup-buildx-action@v1
        with:
          version: latest

      - name: Checkout
        uses: actions/checkout@v2
        env:
          DEFAULT_BRANCH: main

      - name: Setup and Build
        uses: redhat-actions/s2i-build@v0.0.1
        with:
          path_context: '.'
          builder_image: 'registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift'
          image_name: spring-petclinic-s2i
          image_tag: 'v1'

```

## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub issues](https://github.com/redhat-actions/s2i-build/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](https://github.com/redhat-actions/s2i-build/blob/main/LICENSE.md) for more information.

