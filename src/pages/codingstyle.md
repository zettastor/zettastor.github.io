---
title: 编码规范
description: N/A
layout: ~/layouts/MainLayout.astro
---

## 编码标准
请在编辑器中设置2空格缩进后，查看和编辑本项目的源代码，每个缩进级别使用一次缩进。空格可用于一行内的其他对齐方式。

大部分代码遵循 [Google Java 风格](https://google.github.io/styleguide/javaguide)；也有一些代码遵循 [Oracle 编码约定](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html) —— 这主要取决于最初的版本。 重要的是，**您修改代码的时候请保持一致，并在修改现有源代码时将空格更改保持在最低限度。** 对于新代码，请使用 Google Java 风格。

## 提交代码
完成代码开发后，您应该向 master 分支提交拉取请求 (PR) 并填写拉取请求模板。拉取请求会自动触发持续整合 (CI) 流程，代码只有在通过 CI 并审核后才会被合并。 如果 CI 运行失败，您可以登录 Jenkins 平台查看失败原因。我们在工程编译过程中引入了代码风格检查流程，请在提交代码之前检查编译结果，确保没有代码风格错误。虽然在审核您的 PR 之前必须满足上述先决条件，但审核者可能会要求您完成额外的设计工作、测试、或其他更改，然后才能最终接受 PR。
