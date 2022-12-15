---
title: 编译说明
description: N/A
layout: ~/layouts/DocLayout.astro
---

## 一、下载代码
ZettaStor DBS 的仓库必须按特定的层次结构组织目录，请使用下列命令下载源代码：
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

在 Linux 系统下，可以通过键入下列命令安装编译所需要的软件包：

## 二、准备编译环境

### RHEL/CentOS 7
```bash
yum install epel-release
yum -y install java-1.8.0-openjdk-devel thrift curl unzip

# 安装新版 Apache Maven
curl -LO https://downloads.apache.org/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz
tar -xvf apache-maven-3.5.4-bin.tar.gz --directory /opt
ln -s /opt/apache-maven-3.5.4 /opt/maven
chown -R root:root /opt/maven
echo '# Apache Maven 环境变量' > /etc/profile.d/maven.sh
echo 'export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk/' >> /etc/profile.d/maven.sh
echo 'export PATH=/opt/maven/bin:${PATH}' >> /etc/profile.d/maven.sh

# 安装新版 Protocol Buffers
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### RHEL/CentOS 8
```bash
yum install epel-release
yum install net-tools maven compat-openssl10 protobuf-compiler
yum install https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/t/thrift-0.9.1-15.el7.x86_64.rpm
```

### RHEL 9
```bash
yum install maven unzip
yum install http://mirror.centos.org/centos/8-stream/AppStream/x86_64/os/Packages/compat-openssl10-1.0.2o-3.el8.x86_64.rpm
yum install https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/t/thrift-0.9.1-15.el7.x86_64.rpm
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### Debian 10/11, Ubuntu 18/20
```bash
sudo apt-get update
sudo apt-get install curl openjdk-11-jdk maven protobuf-compiler
curl -LO http://ftp.debian.org/debian/pool/main/t/thrift-compiler/thrift-compiler_0.9.1-2.1+b1_amd64.deb
sudo dpkg -i thrift-compiler_0.9.1-2.1+b1_amd64.deb
```

### SUSE/SLES 15
```bash
zypper install curl unzip maven thrift
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-linux-x86_64.zip
unzip protoc-3.5.1-linux-x86_64.zip -d /usr/local
```

### macOS Catalina (10.15) 或更高版本
```zsh
# 安装 Homebrew 软件包管理器
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 JDK
brew install openjdk@11
sudo ln -sfn $(brew --prefix)/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk

# 安装 Apache Maven
curl -LO https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz
tar -xvf apache-maven-3.6.3-bin.tar.gz
sudo mv apache-maven-3.6.3 /opt/
export M2_HOME="/opt/apache-maven-3.6.3"
export PATH="${M2_HOME}/bin:${PATH}"

# 安装 Protocol Buffers
curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.5.1/protoc-3.5.1-osx-x86_64.zip
sudo unzip protoc-3.5.1-osx-x86_64.zip -d /usr/local

# 安装 Apache Thrift
brew install thrift@0.9
export PATH="/usr/local/opt/thrift@0.9/bin:$PATH"
```

### 其他架构和平台

一般来说，最便捷的方法是下载预编译的二进制文件。如果要从源代码编译二进制文件，请参阅下列链接。

- __Apache Thrift__: 要从源代码编译 Thrift，请查看 [安装说明](https://thrift.apache.org/docs/install/)。请注意各个操作系统可能有相关的特定要求。

- __Protocol Buffers (Protobuf)__: 首先检查您是否可以下载 [Protobuf 3.5.1 预编译二进制文件](https://github.com/protocolbuffers/protobuf/releases/tag/v3.5.1)。如果要从源代码编译 protoc 二进制文件，请查看 [安装说明](https://github.com/protocolbuffers/protobuf/blob/main/src/README.md)。

## 三、开始编译

### 编译环境确认
要编译 ZettaStor DBS，您需要：
- Java Development Kit (JDK) 11
- Apache Maven 3.5 或更高版本
- Apache Thrift 0.9.x
- Protocol Buffers 3.5.1 或更高版本

请确认下列命令行在系统的 PATH 环境变量中，并能返回正确的版本号，例如：
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

### 使用 Maven 构建

在`pengyun-root/pom.xml`所在目录，使用下列 Maven 命令构建软件包：
```bash
# 根据系统环境更新版本号
mvn versions:set-property -Dproperty=libthrift.version -DnewVersion=$(thrift --version | awk '{print $3}')
mvn versions:set-property -Dproperty=protobuf.version -DnewVersion=$(protoc --version | awk '{print $2}')
mvn clean install -Dcheckstyle.skip=true -DskipTests
```