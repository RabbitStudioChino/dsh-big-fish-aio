# 正式发布流程

正式发布基线为 v1.0.0，随包日志为 `update/changelog-v1.0.0.json`。根 `package.json.version` 是唯一版本来源，四个内置模块同版本且 `private: true`，原作者整合基线与完整许可保留。

## 发布边界

- 日常开发推送到私有内测仓库 `CHINOSAMAAA/dsh-big-fish-aio-demo`，不触发 npm 发布。
- 首次正式发布须明确授权，从审查后的文件建立 `RabbitStudioChino/dsh-big-fish-aio` 的全新独立历史，以已准备好的 v1.0.0 为唯一根提交并初始化远端 `main`；根提交没有父提交，v1.0.0 标签指向该根提交。不得携带内测 `.git`、分支、标签，或通过合并、变基导入私有提交历史。统一脚本不负责初始化正式仓库。
- 正式 GitHub 源码及其全部可达历史、正式 npm 包都不得包含 v1.0.0 之前的整合版 `update/changelog-v0.*.json`；须在正式仓库第一次提交前排除，先提交后删除仍不合格。私有内测仓库继续保留原日志和历史。此规则不删除模块原作者的 CHANGELOG.md、LICENSE、NOTICE 或其他来源声明。
- 首次正式发布完成后，用户明确要求“推送并更新版本”表示执行完整的 GitHub 与 npm 双渠道发布。仅推送代码、修改 README、准备版本或运行检查，不代表发布授权。
- 在正式仓库的独立检出目录运行发布脚本，必须保留完整 Git 历史，禁止浅克隆。GitHub 仓库必须是上述正式仓库、分支必须是 `main`，npm 必须使用官方仓库 `https://registry.npmjs.org/`；国内镜像仅用于安装与发布后同步核验。
- 正式推送只包含已核验的 main 和对应版本标签，不使用 `push --mirror`、`--all`、`--tags`。若远端已有内测分支、标签或历史，停止并报告，不能通过删除当前文件或强推声称已经清除。

## 首次正式快照

在获准初始化后，从已审查并提交的私有源码导出到新建空目录。以下命令只准备本地快照，不推送远端；`formal_snapshot` 必须来自本次 `mktemp`，不要改为已有项目目录。

```bash
(
set -euo pipefail
formal_snapshot=$(mktemp -d "${TMPDIR:-/tmp}/bigfish-formal.XXXXXX")
git archive --format=tar HEAD | tar -xf - -C "$formal_snapshot"
cd "$formal_snapshot"
node --input-type=module - <<'NODE'
import { readdirSync, unlinkSync } from 'node:fs'
for (const name of readdirSync('update')) {
  if (/^changelog-v0\.\d+\.\d+\.json$/.test(name)) unlinkSync(`update/${name}`)
}
NODE
npm ci --ignore-scripts
npm run release -- prepare 1.0.0
npm run build
git init -b main
git add .
git commit -m '1.0.0：首次正式发布'
test "$(git rev-list --count HEAD)" = 1
node --input-type=module - <<'NODE'
import assert from 'node:assert/strict'
import { runCommand } from './scripts/release.mjs'
import { assertFormalHistory } from './scripts/release-policy.mjs'
const git = (...args) => runCommand('git', args, { cwd: process.cwd() })
assert.equal(/^parent /m.test(git('cat-file', 'commit', 'HEAD').split('\n\n')[0]), false)
assertFormalHistory(git, 'HEAD', 'dsh-big-fish-aio')
NODE
npm run release -- check
printf '本地正式快照：%s\n' "$formal_snapshot"
)
```

日志排除、原始根提交和完整历史核验、源码和包清单检查都必须先于第一次正式推送。`release -- check` 检查源码与包，不替代首次推送前的历史核验；`publish` 会拒绝浅克隆和 grafts，并忽略 Git replace 后重新核对真实历史。完成秘密扫描、许可证与包文件清单复核后，才按已获授权配置正式远端并初始化 main；不能把含旧日志的根提交先推上去，再在后续提交删除。复用本地 AGENTS.md 时确认仍被忽略。保留私有源码目录不变，后续正式更新在正式仓库自己的历史上提交。

## 每版日志

`update/changelog-v版本.json` 是整合版更新日志的唯一来源，随 npm 包与 GitHub 源码分发；不再维护根目录 CHANGELOG.md、Web 版本清单或独立日志分支。模块原作者的变更记录继续作为来源资料保留。

1. 以**上一个已发布正式标签**到本次提交的差异为依据，整理本次新增、优化、修复、移除及兼容性变化。首次 v1.0.0 可记录首次发布的功能基线；以后不得复制整套功能介绍。私有内测日志以此前内测版本为比较基线。
2. 分类按本次内容选择，ID、名称与数量均不固定；没有改动的分类不写，不用空条目占位。已出现的同一主题尽量保留原 ID。
3. JSON 格式固定为 `schemaVersion: 1`，字段及示例见 [随包更新日志](update-service.md#随包更新日志)。分类 ID 在本版唯一，条目 ID 在本版全局唯一。分类名称不与固定十二类或技能库功能清单绑定。
4. 文件名、`version`、`releaseId` 必须一致，`releaseId` 为 `v` 加根版本号。草稿使用 `__PUBLISHED_AT__`，正式发布前填写带时区的时间；延期且尚未发布时先重新核对时间，再冻结发布提交。
5. 正式 v1.0.0 及之后的已发布日志逐版保留且不原地改写；勘误写入下一版说明。不得为了本版内容精简而删除正式历史文件。0.x 日志只留在私有内测仓库，当前未发布准备稿可以修订。

插件直接按固定 JSON 格式读取日志，动态生成非空分类；未变化的分类不展示。历史列表来自已安装包内的有效日志，断网仍能读取，不需要另建更新网站。

## 统一脚本

脚本为 `scripts/release.mjs`，通过以下命令调用：

```sh
# 先编写并审查 update/changelog-v1.0.1.json，再同步版本与发布时间
npm run release -- prepare 1.0.1

# 仅检查与打包，不推送、不发布；省略子命令也只执行检查
npm run release -- check

# 在获准发布后，从干净的正式仓库 main 执行双渠道发布
npm run release -- publish
```

准备命令读取已写好的日志，不生成或猜测更新内容；它将根包、四个内置模块、锁文件及日志元数据统一到指定版本。版本使用 `主版本.次版本.修订号`：修复通常递增修订号，新功能递增次版本，不兼容变更递增主版本。不得给内置模块单独发版，也不要修改 `upstreamCompatibility` 冒充已同步原作者仓库。

`check` 允许当前日志为草稿，执行项目检查和临时打包后清理临时目录；`publish` 拒绝日期占位符。`prepare` 只处理尚未填写日期的目标日志，填入 UTC 时间，并拒绝版本倒退。

正式版本还须通过 `scripts/release-policy.mjs` 的日志边界检查。`prepare` 在改写版本前检查正式快照，`prepack` 在打包前检查源码，`check` 和 `publish` 另核对实际包清单；含旧日志时拒绝执行，要求只清理导出副本，不自动删除私有原件。规则仅对 v1.0.0 起的正式版本启用，私有 0.x 开发检查继续保留内测日志。发布检查完整可达历史，曾提交内测版本或旧日志、之后又删除的历史也会拒绝。

## 执行顺序

1. 检查工作区和上一正式标签，确定本次差异、版本号及发布授权；保存并保留用户已有改动。准备新的增量 JSON，运行 `prepare`，检查所有版本字段一致。
2. 按 [贡献与审查规范](../CONTRIBUTING.md) 审查代码、许可、素材与公开范围。使用 `npm ci --ignore-scripts` 安装锁定依赖，运行 `npm run release -- check`；发布前还须运行 `npm run scan:secrets`，检查完整历史及待公开文件。Gitleaks 须预先安装；`.gitignore` 不会移除已经进入 Git 历史的秘密。
3. 检查构建产物、完整提交历史、日志和实际 npm tarball 的文件清单，确认正式源码与包中均无 v1.0.0 之前的整合版日志、历史中也无内测提交或旧日志；`client.js` 已提交，AGENTS.md 未被跟踪且不在包内。完成真实宿主所需的针对性验收；未完成的验收必须明确记录。
4. 将审查后的版本、源码、构建产物与日志提交为同一个发布提交。正式发布使用干净的 `main`，在当前环境完成 `gh` 与 npm 的正常登录，不把 Token、密码或 OTP 写入仓库、日志或脚本参数。
5. 运行 `publish`，脚本先验证版本、来源、独立历史、已发布日志及干净工作区，执行检查并固定包内容。发布顺序为：npm 精确 tarball → npm 回读 → GitHub 标签 → 由同一 JSON 生成的 Release → 推送 main。已有版本或标签只能在确认内容相同后用于恢复发布，不能强推标签或覆盖 npm 同名版本。
6. 脚本回读 GitHub main、标签、Release 与 npm latest，再从官方 npm 和国内镜像下载该版本，核对完整性。全部通过才返回发布流程完成。镜像未同步时命令返回失败并保留已发布内容，应报告“官方发布已完成，镜像验证待完成”，稍后从同一提交重试；不能把同步延迟说成 npm 发布失败或镜像已可安装。
7. 在独立测试环境分别核对 npm / GitHub 安装成功、插件重载、日志自动弹出及关闭去重。安装失败不得显示成功日志；日志缺失必须有明确提示。真实宿主验收与线上发布核验分开报告。

## 失败与恢复

npm 与 GitHub 没有跨平台原子事务，任何一侧失败均须报告已完成与未完成的步骤。脚本将本次 tarball、Release 文本和发布信息归档到被忽略的 `local/releases/v版本-完整SHA/`。修正认证或网络问题后，在相同发布提交重跑 `publish`，脚本核对已发布内容并跳过已完成阶段；不得先升新版本、强推标签、删除 Release 或撤回已发布 npm 包来掩盖部分失败。已存在内容与本次不符时停止并人工处理，不能覆盖。

npm 不允许重新发布相同包名和版本，因此恢复流程核对已发布包的完整性并跳过重复上传，依据 [npm publish 官方说明](https://docs.npmjs.com/cli/v11/commands/npm-publish/)。GitHub Release 使用预先核验的标签与 `--verify-tag`，正文通过 `--notes-file` 传入，依据 [GitHub CLI release create 官方说明](https://cli.github.com/manual/gh_release_create)。

正式发布期间不要另行推送 `main`：插件的 GitHub 渠道直接读取 `main`，脚本最后推送 main 以减少提前暴露新版本的时间，但 npm、GitHub 与镜像之间仍可能短暂不一致。对外发布结果应列出版本、提交 SHA、GitHub Release、npm 版本与镜像同步状态，不将“构建通过”写成“发布成功”。
