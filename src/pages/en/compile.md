---
title: How to compile?
description: N/A
layout: ~/layouts/DocLayout.astro
---

## I. Downloading the Source
The repositories of ZettaStor DBS must be organized in a hierarchy structure, use the following commands to download the source code:
```bash
ROOT_PATH=$1

git clone -b 1.0.0 $ROOT_PATH/pengyun-root
pushd pengyun-root

git clone -b 1.0.0 $ROOT_PATH/pengyun-root/pengyun-lib
pushd pengyun-lib
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-core
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-database_core
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-models
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-dih_model
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-dih_client
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-query_log
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-configuration
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-lib/pengyun-monitor_common
popd

git clone -b 1.0.x-OS $ROOT_PATH/pengyun-root/pengyun-dbs
pushd pengyun-dbs
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/dbs-dnmodel
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/dbs-models_related
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-driver_core
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-coordinator
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-infocenter
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-drivercontainer
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-deployment_daemon
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-system_daemon
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode_core
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode_service
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-webservice_adapter
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-utils
git clone -b feature/open_source $ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-console
popd

popd
```

## II. Setup a development environment
If you're on Linux, the packages required for compilation can be installed by the folowing commands

### RHEL/CentOS 7
```bash
yum install epel-release
yum -y install git java-1.8.0-openjdk-devel thrift curl unzip

# Install a newer version of Apache Maven
curl -LO https://downloads.apache.org/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz
tar -xvf apache-maven-3.5.4-bin.tar.gz --directory /opt
ln -s /opt/apache-maven-3.5.4 /opt/maven
chown -R root:root /opt/maven
echo '# Apache Maven Environment Variables' > /etc/profile.d/maven.sh
echo 'export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk/' >> /etc/profile.d/maven.sh
echo 'export PATH=/opt/maven/bin:${PATH}' >> /etc/profile.d/maven.sh

# Install a newer version of Protocol Buffers
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### RHEL/CentOS 8
```bash
yum install epel-release
yum install git net-tools maven compat-openssl10 protobuf-compiler
yum install https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/t/thrift-0.9.1-15.el7.x86_64.rpm
```

### RHEL 9
```bash
yum install git maven unzip
yum install http://mirror.centos.org/centos/8-stream/AppStream/x86_64/os/Packages/compat-openssl10-1.0.2o-3.el8.x86_64.rpm
yum install https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/t/thrift-0.9.1-15.el7.x86_64.rpm
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### Debian 10/11, Ubuntu 18/20
```bash
sudo apt-get update
sudo apt-get install git net-tools curl openjdk-11-jdk maven protobuf-compiler
curl -LO http://ftp.debian.org/debian/pool/main/t/thrift-compiler/thrift-compiler_0.9.1-2.1+b1_amd64.deb
sudo dpkg -i thrift-compiler_0.9.1-2.1+b1_amd64.deb
```

### SUSE/SLES 15
```bash
zypper install net-tools-deprecated curl unzip maven thrift
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### macOS Catalina (10.15) or higher
```zsh
# Install Homebrew package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install JDK
brew install openjdk@11
sudo ln -sfn $(brew --prefix)/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# Install Apache Maven
curl -LO https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
tar -xvf apache-maven-3.6.3-bin.tar.gz
sudo mv apache-maven-3.6.3 /opt/
export M2_HOME="/opt/apache-maven-3.6.3"
export PATH="${M2_HOME}/bin:${PATH}"

# Install Protocol Buffers
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-osx-x86_64.zip
sudo unzip protoc-3.5.1-osx-x86_64.zip -d /usr/local

# Install Apache Thrift
brew install thrift@0.9
export PATH="/usr/local/opt/thrift@0.9/bin:$PATH"
```

### Other Architecture and Platform

As a general rule, the simplest way is to download a pre-built binary. If you would like to build from source code, please refer to the links below for details.

- __Apache Thrift__: To build Thrift from source look at [installation instructions](https://thrift.apache.org/docs/install/). Pay attention to the OS notes, there are are some system specific requirements.

- __Protocol Buffers (Protobuf)__: First check whether you can download a [Protobuf 3.5.1 pre-built binary](https://github.com/protocolbuffers/protobuf/releases/tag/v3.5.1). If you would like to build protoc binary from source, see the [installation instructions](https://github.com/protocolbuffers/protobuf/blob/main/src/README.md).

## III. Compiling the code

### Verification of Requirements
To compile ZettaStor DBS, you need:
- Java Development Kit (JDK) 11
- Apache Maven 3.5 or higher
- Apache Thrift 0.9.x
- Protocol Buffers 3.5.1 or higher

Please make sure that the following command is in the PATH environment variable of the system and returns the correct version number, for example:
```
$ mvn --version
Apache Maven 3.6.3
Maven home: /usr/share/maven
Java version: 11.0.17, vendor: Ubuntu, runtime: /usr/lib/jvm/java-11-openjdk-amd64

$ thrift --version
Thrift version 0.9.1

$ protoc --version
libprotoc 3.5.1
```

### Building with Maven

To build the package, use the following commands in the directory where `pengyun-root/pom.xml` is located
```bash
# Update version number from system environment
mvn versions:set-property -Dproperty=libthrift.version -DnewVersion=$(thrift --version | awk '{print $3}')
mvn versions:set-property -Dproperty=protobuf.version -DnewVersion=$(protoc --version | awk '{print $2}')
mvn clean install -Dcheckstyle.skip=true -DskipTests
```