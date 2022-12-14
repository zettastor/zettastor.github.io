---
title: Developer's Guide
description: N/A
layout: ~/layouts/DocLayout.astro
---

## I. System Architecture

### Functional Structure

The functional structure of ZettaStor DBS is shown in the figure below. The Storage Resource Layer is composed of standard servers and ethernet devices, responsible for providing the underlying physical resources for the storage system; the Storage Platform Layer is responsible for the construction of distributed systems and the implementation of core functions; the Storage Service Layer is responsible for providing clients with enterprise-level functional features, storage resource services that meet high reliability and high availability requirements of enterprise-level environments; the Storage Interface Layer is responsible for providing relevant protocols and interfaces to access client storage resources; Storage Management is responsible for the implementation of various management functions within the system, and it provides an operating interface for administrators, it is also responsible for providing APIs or specific integration interfaces for cloud platforms or third-party platforms.

<img src="https://zdbs.io/devguide/media/image1mod.png" />

### Software Architecture

ZettaStor DBS consists of a series of software modules that undertake different tasks, and implements various functions for the distributed storage system through communication and data transfer between modules. As shown below, these modules can be divided into two categories, Data Processing I/O related and Control Operations related:

- __Data Processing I/O__. These modules are responsible for managing underlying storage resources, establishing and managing I/O channels, accepting user data access requests and completing read and write operations;
- __Control Operations__. These modules are separated from the user data access process, and are responsible for collecting and presenting various types of system information, providing user management interfaces, and completing various management tasks of the system.

<img src="https://zdbs.io/devguide/media/image2.jpg" />

## II. Data Flow between Services

### Control Flow

The basic structure of Control Operation modules and data flow is shown in below, the communication is implemented via Thrift protocol:

<img src="https://zdbs.io/devguide/media/image3.png" style="width:50%" />

- __InfoCenter__

InfoCenter is the information center of the system. It is responsible for obtaining various information from DataNode for use by MonitorServer and Console, including DataNode and its back-end storage resource, block device mounting and usage, and account information.

- __Console__

Console is the portal of the system. Users can configure the system and view various system information through a web browser, including: the running status of each component, various warnings or alarms, I/O performance data and reports.

Each of the above software modules is separated from Data Processing I/O. A module failure only affects management operations, and does not affect normal reading or writing of data. In order to avoid system management inconvenience caused by the failure of Control Operations-related modules, the InfoCenter and Console modules adopt a distributed architecture design and are deployed on multiple nodes in the cluster in HA mode. When one node fails, the other can quickly take over.

### Data Flow

Software modules related to Data Processing I/O include Client Driver, Coordinator, and DataNode. The data flow uses [Netty](https://netty.io) framework 4.0 and the [Protocol Buffers](https://developers.google.com/protocol-buffers) encoding / decoding for communication.

- __Client Driver__

The Client Driver is responsible for communicating with the Coordinator to identify the standard block storage device provided by the ZettaStor DBS system and establish the data access path. The Client Driver registers the recognized block device to the operating system for read and write access, submits all received user I/O requests to the Coordinator, and returns the obtained execution result.

Client Driver can be a standard iSCSI initiator, used to access the block device provided by the Coordinator based on iSCSI protocol; it can also be Pengyun's PYD Client Driver, used to access the Coordinator based on the private LBD (Lightning Block Device) protocol provided by the block device. The former implementation has a wide compatibility, and the latter provides higher performance.

<img src="https://zdbs.io/devguide/media/image1n.png" style="width:75%" />

- __Coordinator__

Each Coordinator is responsible for managing a standard block storage device. The Coordinator acts as a server to respond to the I/O requests submitted by the Client Driver and to address them. Then, I/O requests to the DataNode process are distributed to the corresponding storage node server, and the processing results are returned back to the Client Driver.

- __DataNode__

The DataNode module is deployed on each storage node server and is the actual manager of physical storage resources and responsible for the actual execution of read and write operations. The DataNode module undertakes the following tasks:

  - Identify and manage the hard disk inside the storage node server, format the disk according to the custom data structure and manage the use of storage space on each hard disk;
  - Receive read and write requests distributed by the Coordinator, and perform data read and write operations;
  - Maintain the replica relationship between local data and data on other DataNodes, and perform operations such as master-slave replica switching and data reconstruction in case of failure.

## III. Product Features

### Node Grouping

ZettaStor DBS Node Grouping. An organizational form for the storage node servers, its main purpose is to enforce data reliability and system availability.

### Storage Domain

ZettaStor DBS Storage Domain. Resource division and management at the granularity of storage nodes, to effectively isolate faults.

### Storage Pools

ZettaStor DBS Storage Pools. An organizational form for the storage resources such as hard disks, different storage pools can be divided according to media types to meet the needs of different types of applications.

### Coexistence of Replica

ZettaStor DBS sets the number of data copies for data volumes. A data volume supports two copies, one is the Primary copy, the other is the Secondary copy, and there is an additional Arbiter copy; a data volume can also support three copies, one is the Primary copy, the other two are Secondary replicas. The greater the number of data copies, the greater the number of faulty nodes that can be tolerated, and the higher the reliability and availability level of the data volume.

### QoS Policy

ZettaStor DBS provides QoS guarantee for the created volume, ensuring that key applications can obtain sufficient I/O resources by limiting the IOPS and bandwidth of the volume.

On the one hand, the QoS mechanism ensures volume performance on-demand and guaranteed service quality. On the other hand, it can allocate more I/O resources to applications with high I/O resource demand to avoid race conditions.

It is able to set the upper limit of throughput IOPS and bandwidth by volumes or volume groups. The system limits the IOPS and bandwidth of volumes or volume groups to the configured limit, and ensures that the IOPS and bandwidth resources reserved for volumes or volume groups are not lower than the configured lower limit.

### Data Reconstruction

ZettaStor DBS is based on distributed data copy technology to ensure data reliability and availability. Each piece of data will be stored in at least two copies in the system, and distributed on different storage nodes. So that when a storage node or disk media fails, only one of the data copies will be affected. The integrity of the user data will not be affected or lost, and the access will not be interrupted. The system will automatically reconstruct the affected data copy to another location, so that the data volume will be restored to a stable state.

<img src="https://zdbs.io/devguide/media/image4.png" />

When a hard disk is offline, a node is down, or the network is abnormal, there are two possible situations for the affected Segment: either the primary copy is missing, or one of the slave copies is missing. If the primary copy is missing, a new primary copy will be elected among the remaining healthy Segment Units to continue providing I/O services; if the slave copy is missing, the master copy continues to respond to I/O requests.

When certain trigger conditions are met, the system will perform data reconstruction, by copying the Segment from the current primary replica unit to other locations in the same storage pool. 

Firstly, the selection of the new location ensures in such a way that the Segment belonging to the same Segment Unit will not appear on the storage nodes in the same group; and secondly, it will try to ensure a balanced distribution of data on the storage nodes in each group. Figure below briefly describes the data reconstruction operation process in the case of a three-copy configuration.

<img src="https://zdbs.io/devguide/media/image5.png" />

Data reconstruction is participated together by all the hard disks in the storage pool and the storage nodes to which the hard disks belong. The data replication is fully cross-distributed, and there will be no concentrated reading from or writing to a single location. This allows data reconstruction to be completed quickly while avoiding performance hotspots.

Data reconstruction requires cross-node data copy operations, which will occupy certain amount of bandwidth and server resources. Users can set the working mode of the data reconstruction operation. 

If it is set to the Business First mode, the background service will automatically control the data reconstruction operation to reduce resource occupation thus reduce the impact; if it is set to the Data First mode, The data reconstruction is given higher priority in order to restore the system to a stable state as soon as possible to ensure data security and system availability.

### Data Rebalancing

Intelligent Data Rebalancing refers to the process of rebalancing through data migration when resource usage is unbalanced among storage nodes in the system.

<img src="https://zdbs.io/devguide/media/image2n.png" />

During the operation of the system, various reasons may cause unbalanced resource utilization, such as adding new nodes or disks to the system, deleting original data volumes, and making data volume snapshots. Unbalanced resources will lead to underutilization or waste of resources. At the same time, it may also cause unbalanced distribution of I/O load, which affects the overall performance of the system.

ZettaStor DBS supports two types of rebalancing strategies: Manual Data Rebalancing and Intelligent Data Rebalancing, which can be flexibly adopted according to different situations. It is also possible to limit the execution time window of the data rebalancing operation, or the occupation of the I/O bandwidth during the process, so as to avoid impacting the normal processing of business applications.

- __Smart Triggering__

The conditions that trigger ZettaStor's data rebalancing and migration operation include:

1. The storage space utilization of a DataNode deviates greatly from the mean value.
2. The distribution ratio of master replicas on a DataNode deviates greatly from the mean value.

- __Smart Migration__

Intelligently choose Segment Units to migrate to other DataNodes:

1. Prefer to choose the slave copy unless it is to balance the distribution of the master copy.
2. Prefer to choose the one with the lowest usage rate to reduce performance impact caused by the migration operation.

## IV. Key Business Processes

### Disk Initialization

ZettaStor DBS manages hard disks directly as raw devices on storage node servers. A hard disk (including magnetic disk and solid-state disk) that has been identified and completed the initialization operation is called an Archive, and its storage space is divided into Segment Units of a specified size, which is the basic unit for performing storage space allocation.

The internal format of Archives under ZettaStor DBS management is shown below. Among them, the Archive Metadata located at the starting position of the hard disk is responsible for recording the usage of storage space and Segment Unit distribution information. At the starting position of every Segment Unit, there is corresponding metadata to record its own information.

<img src="https://zdbs.io/devguide/media/image6.jpg" />

### Data Volume Creation

ZettaStor DBS provides storage resources to client hosts in the form of data volumes, and clients use data volumes just like using regular local disks.

### I/O Write Process

The write requests will be sent to the Coordinator first. When the Coordinator receives the user's write request, it will perform calculations based on the volume composition information to determine which segment the user's data falls on.

The implementation of the striping strategy can be defined as follows: each volume has its own fixed stripe size independently; the stripe size must be an integer multiple of page size; and the integer value can be specified according to the user's profile. Based on the I/O request offset position and volume composition information, the system calculates which Segment the offset position should fall in. After addressing a stripe, if there is still additional requested data, continue to calculate the next Segment corresponding to the stripe, and so on.

Assuming that the user initiates a write request, the offset position of the write request is 0, and the size of data is 5MB. After stripe conversion, there will be 5 smaller block write requests, which are \[0,1MB), \[1MB,2MB) , \[2MB,3MB), \[3MB,4MB), \[4MB,5MB), the writing order is as follows:

1. \[0,1MB) will be written to position 0 of the 0th Segment, and the size is 1 stripe: 1MB;
2. \[1MB,2MB) will be written to position 0 of the 1st Segment, and the size is 1 stripe: 1MB;
3. \[2MB,3MB) will be written to position 0 of the 2nd Segment, and the size is 1 stripe: 1MB;
4. \[3MB,4MB) will be written to position 0 of the 3rd Segment, and the size is 1 stripe: 1MB;
5. \[4MB,5MB) will be written to position 0 of the 4th Segment, and the size is 1 stripe: 1MB.

<img src="https://zdbs.io/devguide/media/logicw.png" />

The purpose of introducing the striping strategy is to ensure that the user's write requests evenly fall on all data disks when writing large blocks sequentially, so as to ensure disk-level load-balancing, instead of writing to certain disks and resulting a performance bottleneck.

The Coordinator calculates the Segment where the data is located based on the offset of the data, and determines the target and size of data to be sent based on the Membership of the Segment. Membership contains the node status, among which the Segment Units in Primary, Secondary and JoinSecondary status will send data; Segment Unit in Arbiter is in a stable state, but it is only an arbitrator of voting and does not store data; A Segment Unit of InActiveSecondary indicates that the Segment Unit cannot be written temporarily. The Coordinator will simultaneously send write requests to all DataNodes where the Active Segment Units are located by broadcasting.

Coordinator will count all Segments after broadcasting
Unit returns the result, and determines the write result according to the VolumeType of the Volume:

After broadcasting, the Coordinator will count the return results from all Segment Units, and determine the write results according to the VolumeType of the volume:

__Two-copy Mode__: In a stable state, two copies shall be written successfully; in the event of a disaster such as disk downtime, it is allowed that only a single copy is written successfully. In this case, the availability is guaranteed but the risk of data loss is increased. In a stable state, only one copy is allowed to be corrupted or lost.

__Three-copy Mode__: the primary copy must be written successfully, the operation is considered successful if any one of the secondary copies is successfully written. In a stable state, one copy is allowed to be corrupted or lost.

__Three-copy High Availability Mode__: In a stable state, three copies shall be written successfully; in the event of a disaster such as disk downtime, the operation is considered successful if only a single copy is written successfully. In this case, the availability is guaranteed but the risk of data loss is increased. In a stable state, two copies are allowed to be corrupted or lost.

In Three-copy Mode, the write I/O operation only needs to be confirmed by two successful data copies. Other data copies can be ensured by cache comparison and synchronization between nodes. In this way, the impact of write latency caused by the abnormality of the network or storage nodes is avoided.

When the DataNode receives the write request from the Coordinator, it will create a corresponding Log in memory. A unique and self-increasing LogId for each Log will be generated by the Primary, then the LogId is broadcasted to all Secondaries, making sure all Secondaries have received the LogId and Data, and finally the result is returned to the Coordinator.

If the conditions are met (i.e., the condition that the Coordinator considers that the write is successful), 
a result of successful writing is returned, otherwise, request will be resent in the process described above until I/O times out.

After responding to the Coordinator, the data are actually placed on the disk. The smallest unit of data is Page, and a piece of data must belong to a Page. There are two advantages to this:

1. When multiple copies of data fall into the same Page, it is not necessary to write multiple times. Instead, the data corresponding to this Page is sorted in the order of LogId in the memory, and a single copy of data is written to the disk, which improves the performance.
2. When writing Pages, the operation is sorted by disk offset corresponding to the pages. The advantage of this is to organize random I/O from the user into some semi-sequential I/O to improve the throughput of the disk.





### I/O Read Process

The read request is first sent to the Coordinator, and the Coordinator calculates the Segment where the data required by the user is located, based on the volume composition information and the striping strategy.
After getting the index, a read request will be sent to the Primary copy in the Segment, at the same time, a check read request will be sent to other copies. The check read request will only check whether the Membership is consistent and whether the primary has been changed, it will not actually read the data. The advantage of this is that when Membership is stable, it does not need to send read requests to multiple nodes to improve performance. When turbulence occurs, it can detect changes in time to prevent Membership from split-brain, resulting in a inconsistent data reading.

<img src="https://zdbs.io/devguide/media/logicr.png" />