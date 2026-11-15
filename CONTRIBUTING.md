# 参与开发

请先阅读 [许可与来源](LICENSE.md)。本项目是 Yuuyuko-uu 插件的衍生整合版；贡献不得删除原作者署名、替换上游许可或移除第三方声明。整合版的问题与 PR 提交至本项目仓库，模块中保留的上游地址用于记录来源。

## 开发与检查

开发工具使用 Node.js 22.13+ 或 24+、npm 和 Git。运行时最低版本仍由 `package.json.engines` 声明。首次安装开发依赖使用 `npm ci --ignore-scripts`；运行依赖由根 `package.json` 与锁文件统一管理。

```sh
npm run build         # 从源码生成 client.js
npm run lint          # 构建后执行 ESLint
npm test              # 根测试和全部内置模块回归
npm run check:public  # 核查 Git 跟踪内容及实际 npm 包
npm run check         # 上述必要检查
npm pack --dry-run    # 复核完整安装包，不发布
npm run release:check # 统一发布预检与实际打包，不发布
```

安装 [Gitleaks CLI](https://github.com/gitleaks/gitleaks) 后，运行 `npm run scan:secrets` 检查全部本地 Git 历史。CI 还会扫描当前跟踪文件；报告仅保留在 `local/`，扫描使用 `--redact=100`，不要把密钥原文复制进日志。

## 规范依据

- 项目治理、变更记录、自动测试与安全响应参考 [OpenSSF Best Practices](https://www.bestpractices.dev/en/criteria/0)。这是一套审查基线，不代表项目已获得该认证。
- JavaScript 使用 [ESLint recommended](https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations) 作为可执行基线，配置和限定例外见 `eslint.config.mjs`。沿用 ESM、两空格、单引号和现有中文领域标识；不要仅为风格重命名接口或整体格式化历史代码。
- 凭据处理参考 [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)，Git 排除规则以 [gitignore 官方语义](https://git-scm.com/docs/gitignore) 为准。

前端源码由构建器放入共享闭包，因此 ESLint 检查完整生成的 `client.js`，避免把跨片段符号误判为未定义；后端、工具、构建脚本和测试单独检查。生成客户端保留原有 React hook 槽位和兼容辅助函数，不启用未使用变量清理。空 catch 的兼容回退、控制字符清洗和防御性初始化沿用现有语义；对外错误有意丢弃可能含凭据与聊天内容的原始 cause。上述例外不豁免未定义变量、重复字段或语法错误。

## 目录与提交边界

| 路径 | 用途 |
| --- | --- |
| `index.js`、`lib/` | 整合入口及共享后端能力 |
| `src/`、`assets/` | 前端源码、主题及运行时资源 |
| `client.js` | 必须随源码提交的构建结果，不手工修改 |
| `modules/{qq,memory,mood,speak}/` | 四个内置模块，保持现有加载路径与接口 |
| `tests/`、`modules/*/tests/` | 可以公开的合成回归测试与夹具 |
| `scripts/`、`.github/workflows/` | 构建、发布、公开文件检查与持续集成 |
| `docs/`、`modules/*/docs/` | 可公开的使用、协议与开发文档 |
| `update/` | 整合版唯一更新日志来源，按版本维护并随包分发 JSON |
| `local/` | 私有测试、调试记录、截图、设计过程与报告，禁止提交 |

`.gitignore` 不会让已跟踪文件退出 Git，也不会清理历史。发现误入版本控制的私有文件时，先保留本地副本，再移除跟踪；如泄漏凭据，应先吊销或轮换，再单独协调历史清理，不能只添加忽略规则。

`package.json.files` 显式列出运行文件；新增运行资源需同步维护白名单。普通测试和使用文档应留在源码仓库，真实聊天、记忆、录音、API Key、宿主配置与本机路径不得作为测试夹具。禁止通过忽略全部 `tests/` 或 `docs/` 代替内容审查。

## 提交要求

1. 在隔离临时目录中构造测试数据，测试结束清理；不依赖真实账号、聊天、付费模型或已安装插件。
2. 缺陷修复先提供可复现的回归测试，运行相关测试及完整检查。保留信任边界校验与失败处理。
3. 修改 UI 时同时核对明暗主题、键盘操作及资源路径；通过构建生成 `client.js`。纯仓库整理不得改变运行行为与视觉样式。
4. PR 描述说明问题、最小修改、验证结果和未验证范围。不要上传本机调试日志或真实宿主截图。
5. 正式发布前完成 [发布准备](docs/release-preparation.md)。私有内测历史不复制到正式仓库；检查通过不等于获得正式发布或 npm 发布授权。
