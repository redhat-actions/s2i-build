# s2i-build
[![s2i-build Example](https://github.com/redhat-actions/s2i-build/workflows/Build%20and%20Push/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A"Build+and+Push")
[![Verify Build](https://github.com/redhat-actions/s2i-build/workflows/Install%20and%20Build/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Install%2C+Build+and+Test%22)
[![Verify Bundle](https://github.com/redhat-actions/s2i-build/workflows/Verify%20Bundle/badge.svg)](https://github.com/redhat-actions/s2i-build/actions?query=workflow%3A%22Verify+Bundle%22)
<br></br>
[![tag badge](https://img.shields.io/github/v/tag/redhat-actions/s2i-build?sort=semver)](https://github.com/redhat-actions/s2i-build/tags)
[![license badge](https://img.shields.io/github/license/redhat-actions/s2i-build)](./LICENSE)
[![size badge](https://img.shields.io/github/size/redhat-actions/s2i-build/dist/index.js)](./dist)

`s2i-build` is a Github Action to build `container images` from the `source code`.

[Source-to-Image (S2I)](https://github.com/openshift/source-to-image) is a toolkit and workflow for building reproducible
container images from `source code`.
S2I produces images by injecting source code into a base S2I container image
and letting the container prepare that source code for execution. The base
S2I container images contains the language runtime and build tools needed for
building and running the source code.

`s2i-build` action works on only `Linux` platforms as of now.

This Action will install [`latest`](https://github.com/openshift/source-to-image/releases/tag/v1.3.1) version of s2i such that it can build the image
from the source code.

**NOTE:** Since this action assumes to have `Docker daemon` to be running, if you are using Ubuntu envoirnments for running the actions it already has Docker daemon running. 
For other envoirnments, suggest running [Docker Setup Buildx](https://github.com/marketplace/actions/docker-setup-buildx) to setup Docker Daemon.

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
    <td>The location of the s2i builder image. Refer below for the curated list of
    <a href="#builder-images">Builder Images</a>
    to use for s2i </td>
  </tr>

  <tr>
    <td>image_name</td>
     <td>Yes</td>
    <td>-</td>
    <td>The Name of the image to build. </td>
  </tr>

  <tr>
    <td>image_tag</td>
    <td>No</td>
    <td>latest</td>
    <td>The version of the image to build. Image will be tagged with the version provided.</td>
  </tr>

  <tr>
    <td>path_context</td>
    <td>No</td>
    <td><code>.</code></td>
    <td>The location of the path to run s2i from. This should be location where your source code is stored. </td>
  </tr>

  <tr>
    <td>log_level</td>
    <td>No</td>
    <td>1</td>
    <td>Log level when running the S2I. Can be changed based on the requirements. </td>
  </tr>

</table>

Once the image is build using this action. [`push-to-registry`](https://github.com/redhat-actions/push-to-registry) action can be used to `push` the image to the desired image registry.

Below is the example for end to end workflow to build and push image using s2i-build action.

## Examples

```yaml
# This workflow will build container image of the
# application using source to image build startegy
# and push the image to quay.io

steps:

  # Checkout the project repository
  - name: Checkout
    uses: actions/checkout@v2
    with:
      repository: spring-projects/spring-petclinic
      
  # Setup S2i and Build container image
  - name: Setup and Build
    uses: redhat-actions/s2i-build@v1
    with:
      path_context: '.'
      # Builder image for java project
      builder_image: 'registry.access.redhat.com/openjdk/openjdk-11-rhel7'
      image_name: spring-petclinic-s2i
      image_tag: 'v1'
      
  # Push Image to Quay registry
  - name: Push To Quay Action
    uses: redhat-actions/push-to-registry@v1
    with:
      image: 'spring-petclinic-s2i'
      tag: 'v1'
      registry: ${{ secrets.QUAY_REPO }}
      username: ${{ secrets.QUAY_USERNAME }}
      password: ${{ secrets.QUAY_PASSWORD }}

```

## Builder Images

Here is a non-exhaustive list of well maintained s2i builder image:

- **go**
  - `centos/go-toolset-7-centos7`
  - `registry.access.redhat.com/devtools/go-toolset-rhel7`

- **java**
  - `registry.access.redhat.com/redhat-openjdk-18/openjdk18-openshift`
  - `registry.access.redhat.com/openjdk/openjdk-11-rhel7`
  - `fabric8/s2i-java`

- **nodejs**
  - [`centos/nodejs-6-centos7`](https://hub.docker.com/r/centos/nodejs-6-centos7)
  - [`centos/nodejs-8-centos7`](https://hub.docker.com/r/centos/nodejs-8-centos7)
  - [`centos/nodejs-10-centos7`](https://hub.docker.com/r/centos/nodejs-10-centos7)

- **perl**
  - [`centos/perl-524-centos7`](https://hub.docker.com/r/centos/perl-524-centos7)
  - [`centos/perl-526-centos7`](https://hub.docker.com/r/centos/perl-526-centos7)
  - `registry.access.redhat.com/rhscl/perl-526-rhel7`

- **php**
  - [`centos/php-70-centos7`](https://hub.docker.com/r/centos/php-70-centos7)
  - [`centos/php-71-centos7`](https://hub.docker.com/r/centos/php-71-centos7)
  - [`centos/php-72-centos7`](https://hub.docker.com/r/centos/php-72-centos7)

- **python**
  - [`centos/python-27-centos7`](https://hub.docker.com/r/centos/python-27-centos7)
  - [`centos/python-35-centos7`](https://hub.docker.com/r/centos/python-35-centos7)
  - [`centos/python-36-centos7`](https://hub.docker.com/r/centos/python-36-centos7)
  - [`centos/python-38-centos7`](https://hub.docker.com/r/centos/python-38-centos7)
  - `registry.access.redhat.com/rhscl/python-27-rhel7`
  - `registry.access.redhat.com/rhscl/python-36-rhel7`

- **ruby**
  - [`centos/ruby-23-centos7`](https://hub.docker.com/r/centos/ruby-23-centos7)
  - [`centos/ruby-24-centos7`](https://hub.docker.com/r/centos/ruby-24-centos7)
  - [`centos/ruby-25-centos7`](https://hub.docker.com/r/centos/ruby-25-centos7)
  - `registry.access.redhat.com/rhscl/ruby-25-rhel7`

- **dotnet**
  - `registry.access.redhat.com/dotnet/dotnet-22-rhel7` 
  - `registry.access.redhat.com/dotnet/dotnetcore-11-rhel7` 

*Note: Above `centos` images are also available with RHEL as base, just replace `centos7` by `rhel7` or `rhel8`* 

## Contributing

This is an open source project open to anyone. This project welcomes contributions and suggestions!

## Feedback & Questions

If you discover an issue please file a bug in [GitHub issues](https://github.com/redhat-actions/s2i-build/issues) and we will fix it as soon as possible.

## License

MIT, See [LICENSE](https://github.com/redhat-actions/s2i-build/blob/main/LICENSE.md) for more information.

