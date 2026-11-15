# 给 DSH 开发插件的 prompt

复制下文，将「业务需求」替换为你要做的功能后交给 DSH 中的 AI。

---

请为当前 DSH 开发一个可独立安装的插件，通过 DSH 原生接口注册接入「大肥鱼开放平台」，让用户导入时无需填写地址或 Token。插件原生支持会话级别隔离，用户通过开放平台卡片开启或关闭，插件面板展示当前状态。

## 业务需求

【在这里填写插件名称、界面和需要开放的能力。例如开发备忘录，提供新建、修改、查询、完成四项能力。】

## 开发与交付要求

1. 先查阅当前宿主的插件规范与可用 API，再实现业务、独立界面、持久化与必要校验。插件和大肥鱼安装在同一 DSH。使用可选的 `ctx.inject(['bigFishOpenPlatform'], callback)` 注册能力，大肥鱼未安装或停用时，插件本身仍能独立运行。
2. 一个插件只创建一个提供方，所有接口放在同一个 operations 数组。接口通过 handler 直接调用插件内部业务方法，不通过 HTTP 绕回自己的路由。handler 成功直接返回符合 outputSchema 的业务数据，失败抛出错误，由平台包装统一响应。查询标记 readOnly=true，处理器只读数据，写操作标记 false。向业务方法传递 execution.signal、execution.isolation，新建记录时另行传递 execution.isOwner。在存储层落实会话校验、来源保存、并发一致性和幂等约束。
3. 使用注入回调收到的 platformCtx.effect 管理 register 返回的注销函数。平台停用、重载或插件卸载时移除接口及模型工具，重新启用时自动注册。不要在宿主插件的必需 inject 数组中加入 bigFishOpenPlatform，也不要仅在加载时检查一次服务是否存在。
4. 交付真实文件 big-fish-api.json，严格遵循下方三字段结构。它只引用已安装插件的提供方 ID，必须与原生清单 id 一致。接口名称、说明、版本、Schema、示例和处理器全部在插件注册清单中提供。导入时用户无需编辑这些内容。
5. 原生接入文件只包含 schemaVersion、transport、id。不得生成 url、headers、Authorization、Token 或地址占位符。不得要求用户创建、查询或粘贴任何接入 Token，不得以删除 HTTP 鉴权代替原生注册。插件若另有供外部客户端使用的 HTTP 接口，可保留其独立鉴权，但不用于这次大肥鱼接入。第三方业务凭据在插件自身的配置中管理，不写入接入文件、示例或日志。
6. BIG_FISH_API.md 面向不懂技术的用户，正文控制在 30 行以内。只写三步操作和首次测试顺序，并说明面板的「导出 API 配置」入口。步骤为“在同一 DSH 安装并启用插件和大肥鱼 → 在插件面板点击导出 API 配置，然后在大肥鱼的 + 接入 API 中导入 big-fish-api.json，点击确认接入 → 开启卡片接入和目标会话授权”。明确写出“无需填写地址或 Token”。开发参考另放 README。
7. 新建示例使用有效的合成业务数据。修改、完成等需要真实记录 ID 的示例可留清晰的占位 ID，但必须说明先用新建/查询获取 ID。验证 JSON 可解析、原生提供方实际注册、输入示例符合 Schema，以及无 Token 的正常调用、关闭接入、未授权会话、隔离开关、跨会话查询及写入拒绝、参数错误、取消和卸载/重载路径。按用户授权范围验证，用户要求不测试时只交付待验证项目并说明实际范围。
8. OpenAPI 3.1 由平台根据同一清单自动生成。inputSchema 对应管理入口请求体，outputSchema 对应平台成功响应中的 data。平台调用地址采用 POST /dsh-big-fish-aio/open-platform/invoke/{providerId}/{operationId}，模型工具名为 big_fish_{providerId}_{operationId}。管理调用复用 DSH 本人登录态，模型调用还须通过接入开关与会话授权。平台响应包含 ok、data 或 error、requestId、durationMs，业务调用返回 HTTP 200 时仍需检查 ok。OpenAPI 描述文档与用户导入的三字段引用文件各有用途，用户导入时选择 big-fish-api.json。

## big-fish-api.json 的严格结构

根据真实插件替换 my_plugin，直接写入 JSON 文件，不只输出 Markdown 代码块。不要把完整接口清单、JavaScript、OpenAPI 文档或用户数据放进这个引用文件。

```json
{
  "schemaVersion": 1,
  "transport": "dsh",
  "id": "my_plugin"
}
```

## 插件内的原生注册清单

在 apply 中创建真实清单，通过可选注入注册。下面的 store.read 示意插件自身的存储方法，请替换为实际实现。它必须先按 access 过滤再返回 {items:[...]}，每项仅包含 id、text 和记录原有的布尔 isOwner。

```js
export function apply(ctx) {
  // 在这里初始化插件自身的界面、存储和业务能力。
  const manifest = {
    schemaVersion: 1,
    id: 'my_plugin',
    title: '我的插件',
    description: '插件的业务用途',
    version: '1.0.0',
    supportsSessionIsolation: true,
    operations: [{
      id: 'read',
      title: '查询记录',
      description: '读取记录，返回 items。',
      readOnly: true,
      inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },
      outputSchema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: { id: { type: 'string' }, text: { type: 'string' }, isOwner: { type: 'boolean' } },
              required: ['id', 'text', 'isOwner'],
              additionalProperties: false,
            },
          },
        },
        required: ['items'],
        additionalProperties: false,
      },
      example: {},
      async handler(input, execution) {
        if (!execution.isolation || typeof execution.isOwner !== 'boolean') {
          throw Error('请更新大肥鱼以提供可信调用上下文')
        }
        const { signal, isolation } = execution
        signal.throwIfAborted()
        isolation.assertCurrent()
        const result = await store.read(input, { signal, access: isolation })
        signal.throwIfAborted()
        isolation.assertCurrent()
        return result
      },
    }],
  }
  ctx.inject(['bigFishOpenPlatform'], platformCtx => {
    platformCtx.effect(() => platformCtx.bigFishOpenPlatform.register(manifest))
  })
}
```

提供方和接口 ID 均以小写字母开头，只含小写字母、数字和下划线，长度 1–24。更新时保留 ID。引用文件与管理请求体各不超过 64 KB。输入 Schema 根类型必须是 object，每个对象声明 properties 和 additionalProperties=false，数组声明 items。Schema 只支持 type、properties、required、additionalProperties、items、标量 enum、字符串 minLength/maxLength，以及 title/description/default/examples 注释。支持的 type 为 object、array、string、number、integer、boolean、null，嵌套最多 12 层，integer 必须为安全整数。default 只作说明，业务自行处理默认值。不使用 $ref、oneOf、format、minimum 等未支持字段。outputSchema 描述 handler 直接返回的成功业务数据。

调用限时 15 秒，平台不自动重试。将 execution.signal 传给内部异步操作和外部请求，存储层在原子提交前检查取消与授权变化。写入超时后先核对结果，再决定是否使用同一业务幂等键重试。

## 可切换的会话级别隔离

- 只有存储层完整实现这些规则后，注册清单才声明 `supportsSessionIsolation: true`。平台为该提供方默认开启隔离，用户在卡片配置中即时切换。隔离开关只由开放平台卡片管理，插件面板通过 `getSessionIsolation(providerId)` 展示当前状态。插件不创建第二套隔离配置，不提供修改该设置的开关或写入入口。
- 平台向原生处理器提供 `execution.isolation`，包含只读的 `enabled`、可信 `sessionId` 和 `assertCurrent()`。调用来源和权限由平台确定，模型输入 Schema 不包含归属、隔离开关、主人标识或任意会话选择参数。QQ 主人与普通会话执行相同规则。
- 新记录始终保存 `execution.isolation.sessionId`。开启隔离时，查询先按相同 `sessionId` 过滤再搜索、排序、计数和分页。按 ID 读取、修改、完成和删除也必须检查归属，越权统一返回未找到。同一会话内判断幂等键，即使关闭隔离也继续按会话判断。
- 关闭隔离时，获授权会话共享读写全部数据。保留每条记录的原始归属，关闭期间的新记录继续标记实际调用会话，重新开启后恢复按归属访问。修改内容与归属分别控制，普通业务更新不能修改归属。
- 在任务进入队列、异步读取后、返回结果前以及原子写入发布前调用 `assertCurrent()` 并检查取消信号。切换隔离、撤销授权及停用会取消在途平台调用。发布前检查与原子发布应避免异步间隙，已提交写入的结果需要由用户查询确认。
- 独立面板必须使用宿主登录鉴权，按本机独立范围处理数据。旧数据的未知归属进入本机待整理范围，保留原数据，避免自动归入第一个调用的会话。其他 HTTP 入口缺少可信会话上下文时，开启隔离后拒绝其访问会话数据。平台暂未提供 HTTP 远端的隔离上下文协议，通用 HTTP 清单保持既有契约。
- 缺少 `execution.isolation` 时提示升级平台并拒绝会话业务调用。平台未加载时，独立面板按开启隔离处理。平台服务提供 `getSessionIsolation(providerId)` 读取当前开关，插件使用同一配置来源。
- 页面接口测试默认使用 `@local` 本机范围，开启隔离时只访问本机记录。会话隔离通过实际 QQ 会话验证。平台兼容本人登录管理请求中的可选 `X-Big-Fish-Session` 请求头，指定会话须属于绑定工作区且已授权。业务 JSON 仅包含业务参数。

## 主人数据标记 isOwner

平台在处理器第二个参数中提供布尔值 `execution.isOwner`。`true` 表示本轮数据由主人 QQ 产生，`false` 表示非主人或来源未核验。平台复用可信 QQ 桥接来源，根据当前宿主消息的发送者与配置的主人 QQ 比较。群聊中仅当本轮已核验消息的发送者集合只有主人一人时为 true，多发送者混合消息为 false。本人登录后的平台页面调用按手工录入处理，传入 true。

`sessionId` 只决定会话归属与隔离。`isOwner` 独立标记数据来源，不能通过会话 ID、会话标题、模型输入或客户端自行提交的字段推定。开启隔离时主人仍只读写本会话，来源标记不会扩大权限。

插件新建数据时将 `execution.isOwner` 原样保存为记录的布尔字段，返回记录时包含 `isOwner`。查询返回记录原有标记，修改与完成保留记录最初的来源标记，查询、修改、完成和删除继续按会话校验。插件自身已登录面板手工新建记录默认写入 `isOwner: true`。原生调用缺少布尔 isOwner 时提示升级并拒绝，不能将来源未知的调用自行标为主人。旧记录缺少该字段时，如采用默认 true，必须在文档说明这是历史兼容值，无法还原旧记录实际发送者。业务输入 Schema 与导出配置不包含可由模型指定的 isOwner 字段。平台在存储层调用 assertCurrent() 及返回前复核消息来源和主人配置，变化时拒绝继续提交。

新建业务调用可采用 `store.create(input, { signal: execution.signal, access: execution.isolation, isOwner: execution.isOwner })`，由存储方法保存可信归属和来源。查询、修改与完成使用已保存记录的来源标记。

## 面板导出 API 配置

在插件面板的「刷新」按钮左侧提供「导出 API 配置」按钮，一键下载 `big-fish-api.json`，并显示提示“请在大肥鱼 → 开放平台 → + 接入 API → 导入 JSON 中导入”。导出内容与交付文件及实际注册提供方 ID 一致，使用本文的 schemaVersion、transport、id 三字段原生引用格式。导出文件不包含 Token、业务数据、会话授权、isOwner 或 JavaScript。复用插件已鉴权的面板入口读取当前接入文件，文件读取或校验失败时显示错误。

## 最终回复

用简短中文给出插件目录、安装方法、big-fish-api.json 和 BIG_FISH_API.md 的实际文件路径，以及已完成的验证。用户的下一步是启用同一 DSH 内的两个插件、选择接入文件并确认、开启接入和会话授权，并按需调整会话级别隔离开关。
