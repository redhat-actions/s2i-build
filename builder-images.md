## Builder Images

Here is a non-exhaustive list of well maintained S2I builder images. Many more S2I builders can be found on [sclorg](https://github.com/sclorg/).

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

*Note: The `centos` images above are also available with RHEL as a base. Just replace `centos7` with `rhel7` or `rhel8`*.