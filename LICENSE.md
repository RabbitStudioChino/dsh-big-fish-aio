# 大肥鱼 · 许可与原作者署名

本项目派生自以下四个仓库，原作者 **Yuuyuko-uu**：

| 项目名称 | 原作者仓库 | 整合时的原仓库版本 | 原始提交 |
| --- | --- | --- | --- |
| 通到 QQ | [Yuuyuko-uu/dsh-qq-link](https://github.com/Yuuyuko-uu/dsh-qq-link) | 1.5.1 | [fba7e3e](https://github.com/Yuuyuko-uu/dsh-qq-link/commit/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb) |
| 鱼的记忆 | [Yuuyuko-uu/dsh-fish-memory](https://github.com/Yuuyuko-uu/dsh-fish-memory) | 1.5.2 | [5124cc1](https://github.com/Yuuyuko-uu/dsh-fish-memory/commit/5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea) |
| 鱼的心情 | [Yuuyuko-uu/dsh-feiyu-mood](https://github.com/Yuuyuko-uu/dsh-feiyu-mood) | 0.9.0 | [02fddca](https://github.com/Yuuyuko-uu/dsh-feiyu-mood/commit/02fddcaae0763651ecd65af5f644fe61f19de4bd) |
| 主动搭话 | [Yuuyuko-uu/dsh-speak-up](https://github.com/Yuuyuko-uu/dsh-speak-up) | 0.3.0 | [e3bc636](https://github.com/Yuuyuko-uu/dsh-speak-up/commit/e3bc6362208c693bb833ecf463ec6a20df4b6419) |

上述版本和提交记录整合时的来源基线，不代表原仓库当前最新版本；与根 `package.json` 的 `upstreamCompatibility` 对应。

本项目是衍生整合版本，不代表原作者出品；各模块在本仓库内统一维护。

整合修改：RabbitStudio 将四个插件整合为「大肥鱼」，统一宿主加载、工作台、版本与更新入口，补充打包流程和测试。扩展功能包括历史导入、QQ 来源隔离、Qwen 语义召回、开放平台与文件管理。心情图片统一收录于 `assets/mood/`，挂饰脚本保留于 `modules/mood/assets/`。

本项目整体继续采用 **Yuuyuko-uu 插件许可 1.2**。[LICENSE](LICENSE) 为逐字完整保留的许可正文；不向其正文添加署名封面，以满足「不删、不改、不缩略」的要求。本文件作为许可署名首页随包分发。四个模块中也分别保留原许可、README、变更记录与包内作者信息。

第三方资料：

- Qwen Embedding 实现参考 [Aonysen/dsh-memory-rag](https://github.com/Aonysen/dsh-memory-rag/tree/9527a91f49863e7f16e109335e44b137e436dc41)，Copyright 2026 aonysen，Apache-2.0；原有许可和 NOTICE 位于 `modules/memory/lib/notices/`。该项目是源码参考，不是整合包的运行依赖。
- 中文词典与词频来自 [fxsjy/jieba](https://github.com/fxsjy/jieba)，Copyright (c) 2013 Sun Junyi，MIT；保留 `词典-来源.txt`，并随包补充分发 `modules/memory/lib/notices/jieba-LICENSE`。

发布、介绍、截图和视频引用请同时保留上述原作者署名与项目地址。详见 [LICENSE](LICENSE)。
