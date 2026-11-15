# 直接渠道更新与安装后日志

版本检查和安装直接使用当前选择的 npm / GitHub 来源，不使用 Web 版本服务，不请求 version.json、远端 releases.json 或独立日志分支。

## 固定渠道与安装保护

- 国内镜像：`dsh-big-fish-aio`，`https://registry.npmmirror.com`。
- GitHub 正式版：`RabbitStudioChino/dsh-big-fish-aio` 的 main，正式版本与 npm 一致。
- 私有内测：`CHINOSAMAAA/dsh-big-fish-aio-demo` 的 main，通过 Token 检查完整 SHA，支持同版本新提交。

继续校验包名、版本、目标 SHA、允许来源、安装包体积与镜像 SHA-512；保留 Token 鉴权、跨渠道确认、安装串行、开发副本保护和失败状态。安装前前端复查目标，服务端在安装锁内再次复查 expectedTarget。目标变化时刷新版本并提示再次点击确认，不自动打开日志。

后端共享渠道检查缓存和进行中的请求，失败短缓存；前端启动、约三十分钟轮询及窗口恢复时补查，保留随机偏移和失败退避。npm / GitHub JSON 读取继续支持超时、大小限制和 ETag / 304。读取失败不得伪装为没有更新。

## 随包更新日志

正式仓库及正式 npm 包的日志目录从 v1.0.0 起，例如后续发布 v1.0.1 后：

```text
update/
├── changelog-v1.0.0.json
└── changelog-v1.0.1.json
```

每个正式版本保留独立日志文件，后续版本新增日志文件而不覆盖 v1.0.0 起的正式历史。v1.0.0 之前的整合版日志只保留在私有内测仓库，不进入正式 GitHub 源码、提交历史或正式 npm 包；正式快照必须在第一次提交前排除这些文件。模块原作者 CHANGELOG.md、许可和来源记录继续保留。

package.json.version 是唯一版本真源，不另维护 latest/version.json 或 releases.json。npm files 收录经过发布策略校验的 `update/changelog-v*.json`；GitHub 安装也携带相同正式日志。私有 0.x 开发副本可继续保留自己的历史，不能直接作为正式源码推送；完整隔离步骤见 [发布流程](release-preparation.md#首次正式快照)。

每版只记录相对上一发布版本新增、优化、修复、移除及其他实际变化。分类 ID、名称和数量可以随本次内容调整，不要求覆盖全部功能或固定十二类；未变化的分类不写入。首个 v1.0.0 可以保留首次发布的功能基线，后续版本不复制该基线。UI 根据 `sections` 动态生成分类，只显示 `items` 非空的分类，初始选中第一个非空分类；全部为空时显示暂无条目。

数据结构保持 `schemaVersion: 1`，示例如下。版本、标题和内容是示例，不应原样用于真实发布。

```json
{
  "schemaVersion": 1,
  "releaseId": "v1.0.1",
  "version": "1.0.1",
  "channel": "stable",
  "title": "大肥鱼 1.0.1",
  "publishedAt": "__PUBLISHED_AT__",
  "summary": "本次变化的简短概述。",
  "sections": [
    {
      "id": "history",
      "title": "聊天记录导入",
      "items": [
        {
          "id": "history.example-fix",
          "title": "本次修复的具体问题",
          "description": "说明触发条件与修复后的行为。"
        }
      ]
    }
  ]
}
```

必填字段为顶层 `schemaVersion`、`releaseId`、`version`、`channel`、`title`、`publishedAt`、`sections`，分类的 `id`、`title`、`items`，以及条目的 `id`、`title`。`summary`、条目的 `module` / `description` / `links` 可选；链接格式为 `{ "label": "说明", "url": "https://…" }`，只允许 HTTPS。分类 ID 在本版唯一，条目 ID 在本版所有分类中唯一；同一主题延续原 ID，无需与技能库的全部功能 ID 对齐。发布时间必须带时区，准备稿可使用占位符，正式发布必须填写时间。发布时至少有一条真实变更，不创建空分类。详细命令和发布核验见 [发布流程](release-preparation.md)。

`lib/bundled-changelog.mjs` 只读取当前安装包内日志。版本 ID 严格限制为 v 加正式版本号，单文件最多 512 KiB，检查 schemaVersion 1、版本对应、稳定且唯一的条目 ID 和 HTTPS 链接。当前版本准备稿的 `__PUBLISHED_AT__` 只允许在本地显示为“待发布草稿”，不伪造时间。历史列表按需扫描本地日志文件，只列有效且已填写发布时间的日志。

日志缺失或损坏显示明确状态并允许重试，不影响安装完成结果；断网不影响查看已安装日志。内测日志来自已鉴权安装的包，不额外联网或下发 Token；本机管理接口仍经过宿主鉴权和同源校验。

## 安装后自动展示

1. 发现更新：刷新共享更新状态，保留侧栏圆点，更新页提供“立即更新”，不自动弹日志。
2. 安装期间：显示进度；宿主确认应用成功后，才将 pendingLog 与目标版本、完整 SHA 写入当前 profile 的 big-fish-update.json。失败不创建成功提醒。
3. 插件重载后：新实例等待宿主 modules.entries.state.syncing 结束，再异步恢复面板；成功只切换一次，卸载取消定时器与订阅，旧实例在安装返回后不再切页。/version 返回已匹配当前包版本的 postUpdate。旧安装实例不返回本次成功日志，避免读取旧包内容。
4. 客户端同时等待宿主模块就绪、窗口可见、其他模态框关闭后展示随包日志；若重载早于成功记录写入，安装窗口在短时间内补查本机状态。待展示记录保留到用户关闭，不依赖一次性页面内存。
5. “知道了”、关闭或 Esc 按同一目标持久去重；新版本或新的内测 SHA 可以再次展示。历史查看始终保留已安装目标说明，不提供安装按钮。

“更新与来源 → 更新日志”始终打开当前已安装包日志，不依赖远端检查成功，也不预读待安装版本日志。

## 本机接口

所有接口保留宿主鉴权、同源和方法检查。

- `GET /dsh-big-fish-aio/version`：安装来源、版本、完整提交，以及安装成功并重载后尚未关闭的 postUpdate。
- `GET /dsh-big-fish-aio/update?channel=mirror|github|beta`：直接渠道检查结果；refresh=1 强制复查。
- `POST /dsh-big-fish-aio/install?channel=...`：安装，接受 confirmSourceChange、operationId 和 expectedTarget。
- `GET /dsh-big-fish-aio/changelog?releaseId=v1.0.0`：本地随包日志，省略版本时读取当前包版本。
- `GET /dsh-big-fish-aio/releases`：从本地日志目录生成历史列表。
- `POST /dsh-big-fish-aio/reminder`：以 targetId 关闭提醒，匹配当前 pendingLog 时清除待展示记录并持久去重。

## 验证边界

自动测试覆盖直接渠道、安装目标变化、本地日志缺失或损坏、网络失败、取消、重载后提醒、关闭去重、同版本内测 SHA、分类和历史切换。真实 DSH 插件重载时序、亮暗主题与窄屏仍须实际宿主验收。发布脚本的检查模式不会发布；首次正式仓库初始化与首次 npm 发布须单独获得明确指令，后续双渠道发布按 [发布流程](release-preparation.md) 执行。
