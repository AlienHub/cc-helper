# cc-helper - Claude Code 密钥配置工具

> [English](README_EN.md) | 中文

一个简单易用的 CLI 工具，用于交互式配置 [Claude Code](https://code.claude.com) 的 API 密钥，支持GLM (智谱AI)、MiniMax 等服务提供商。

## 功能特性

- 交互式配置 Claude Code 的 API 密钥
- 支持多个服务提供商（GLM、MiniMax、Kimi）及自定义 API 端点
- 查看当前 Claude Code 配置（密钥、端点等）
- 验证配置有效性（测试 API 密钥是否可用）
- 清除不需要的配置
- 直接修改 Claude Code 的配置文件 `~/.claude/settings.json`
- 支持剪贴板粘贴（Cmd/Ctrl+V）
- 美观的命令行界面

## 支持的服务提供商

- **GLM (智谱AI)** - 使用智谱AI的兼容接口
- **MiniMax** - 使用 MiniMax 的兼容接口
- **Kimi (Moonshot)** - 使用 Moonshot Kimi API（兼容 Claude 接口）

## 安装

### 通过 npx 运行（推荐）

```bash
npx cc-helper
```

### 本地安装

```bash
npm install -g cc-helper
```

安装后直接运行：

```bash
cc-helper
```

## 使用方法

运行命令后，会显示交互式菜单：

1. **配置/更新密钥** - 添加或更新API密钥
2. **查看当前配置** - 查看已配置的密钥（部分隐藏）
3. **验证配置** - 测试 API 密钥是否有效
4. **检查 Claude Code 安装** - 检查 Claude Code 是否已安装
5. **启动 Claude Code** - 直接启动 Claude Code
6. **删除密钥** - 删除不需要的密钥
7. **退出** - 退出程序

### 配置密钥

1. 选择 "配置/更新密钥"
2. 从列表中选择服务提供商（GLM、MiniMax、Kimi 或自定义 API）
3. 输入对应的 API 密钥（支持直接粘贴）
4. 如果选择自定义 API，还需要输入自定义的 API 端点 URL
5. 配置会自动保存到 Claude Code 的配置文件

### 查看配置

选择 "查看当前配置" 可以查看 Claude Code 的当前配置，包括：
- 当前使用的服务提供商
- API 端点地址
- API 密钥（部分隐藏）
- 超时设置等

### 验证配置

选择 "验证配置" 可以测试当前配置的 API 密钥是否有效。工具会通过 Claude Code 命令实际发送请求来验证配置。

### 检查安装和启动

- **检查 Claude Code 安装**：检查系统中是否已安装 Claude Code，并显示版本信息
- **启动 Claude Code**：直接启动 Claude Code 交互式界面

### 删除密钥

选择 "删除密钥" 可以清除当前的 API 密钥配置。

## 配置文件位置

工具直接修改 Claude Code 的配置文件：

```
~/.claude/settings.json
```

配置文件格式示例：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key-here",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1,
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air"
  }
}
```

> 注意：不同服务提供商的配置会有所不同，工具会根据选择的服务提供商自动设置相应的模型配置。

## 关于 Claude Code

[Claude Code](https://code.claude.com) 是 Anthropic 官方的 AI 编程助手工具，可以在终端中使用。

- 安装 Claude Code: `curl -fsSL https://claude.ai/install.sh | bash`
- 使用文档: https://code.claude.com/docs

## 开发

```bash
# 克隆项目
git clone <repository-url>
cd cc-helper

# 安装依赖
npm install

# 运行
npm start
```

## 内部分发

### 方法 1: 打包分发（推荐）

1. **打包项目**：
```bash
npm run build
# 或
npm pack
```

这会生成一个 `cc-helper-1.0.0.tgz` 文件。

2. **分发安装**：
将 `.tgz` 文件分发给团队成员，他们可以通过以下方式安装：

```bash
# 全局安装
npm install -g /path/to/cc-helper-1.0.0.tgz

# 或本地安装
npm install /path/to/cc-helper-1.0.0.tgz
```

安装后即可使用 `cc-helper` 命令。

### 方法 2: 从 Git 仓库安装

如果项目在 Git 仓库中（如 GitHub、GitLab 等），可以直接安装：

```bash
# 从 Git 仓库安装
npm install -g git+https://your-git-repo-url.git

# 或指定分支/标签
npm install -g git+https://your-git-repo-url.git#main
```

### 方法 3: 本地链接（开发用）

在同一台机器上开发时，可以使用 `npm link`：

```bash
# 在项目目录中
npm link

# 之后就可以直接使用 cc-helper 命令
cc-helper
```

## 许可证

MIT

