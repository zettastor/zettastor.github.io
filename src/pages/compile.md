---
title: 编译说明
description: N/A
layout: ~/layouts/DocLayout.astro
---

在 Linux 系统下，可以通过键入下列命令安装编译所需要的软件包：

## 一、准备编译环境

### RHEL/CentOS 7
```bash
yum install epel-release
yum -y install git java-1.8.0-openjdk-devel thrift curl unzip

# 安装新版 Apache Maven
curl -LO https://downloads.apache.org/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz
tar -zxvf apache-maven-3.5.4-bin.tar.gz --directory /opt
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

## 二、下载代码
ZettaStor DBS 的仓库必须按特定的层次结构组织目录，请使用下列命令下载源代码：
```bash
ROOT_PATH=$1

git clone --depth 1 -b 1.0.0 file://$ROOT_PATH/pengyun-root
pushd pengyun-root

git clone --depth 1 -b 1.0.0 file://$ROOT_PATH/pengyun-root/pengyun-lib
pushd pengyun-lib
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-core
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-database_core
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-models
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-dih_model
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-dih_client
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-query_log
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-configuration
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-lib/pengyun-monitor_common
popd

git clone --depth 1 -b 1.0.x-OS file://$ROOT_PATH/pengyun-root/pengyun-dbs
pushd pengyun-dbs
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/dbs-dnmodel
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/dbs-models_related
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-driver_core
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-coordinator
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-infocenter
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-drivercontainer
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-deployment_daemon
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-system_daemon
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode_core
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode_service
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-datanode
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-webservice_adapter
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-utils
git clone --depth 1 -b feature/open_source file://$ROOT_PATH/pengyun-root/pengyun-dbs/pengyun-console
popd

popd
```

## 三、开始编译
在`pengyun-root/pom.xml`所在目录，使用下列 Maven 命令编译软件包：
```bash
# 根据系统环境更新版本号
mvn versions:set-property -Dproperty=libthrift.version -DnewVersion=$(thrift --version | awk '{print $3}')
mvn versions:set-property -Dproperty=protobuf.version -DnewVersion=$(protoc --version | awk '{print $2}')
mvn clean install -Dcheckstyle.skip=true -DskipTests
```