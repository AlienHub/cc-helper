# @alienzhou1958/cc-helper - Claude Code API Key Configuration Tool

> English | [中文](README.md)

A simple and easy-to-use CLI tool for interactively configuring [Claude Code](https://code.claude.com) API keys, supporting GLM (Zhipu AI), MiniMax, and other service providers.

## Features

- Interactive configuration of Claude Code API keys
- Support for multiple service providers (GLM, MiniMax, Kimi) and custom API endpoints
- View current Claude Code configuration (keys, endpoints, etc.)
- Validate configuration effectiveness (test if API keys are valid)
- Clear unwanted configurations
- Directly modify Claude Code's configuration file `~/.claude/settings.json`
- Support clipboard paste (Cmd/Ctrl+V)
- Beautiful command-line interface

## Supported Service Providers

- **GLM (Zhipu AI)** - Uses Zhipu AI's compatible interface
- **MiniMax** - Uses MiniMax's compatible interface
- **Kimi (Moonshot)** - Uses Moonshot Kimi API (compatible with Claude interface)

## Installation

### Run via npx (Recommended)

```bash
npx @alienzhou1958/cc-helper
```

### Local Installation

```bash
npm install -g @alienzhou1958/cc-helper
```

After installation, run directly:

```bash
cc-helper
```

## Usage

After running the command, an interactive menu will be displayed:

1. **Configure/Update Key** - Add or update API keys
2. **View Current Configuration** - View configured keys (partially hidden)
3. **Validate Configuration** - Test if API keys are valid
4. **Check Claude Code Installation** - Check if Claude Code is installed
5. **Launch Claude Code** - Directly launch Claude Code
6. **Delete Key** - Delete unwanted keys
7. **Exit** - Exit the program

### Configure Keys

1. Select "Configure/Update Key"
2. Choose a service provider from the list (GLM, MiniMax, Kimi, or Custom API)
3. Enter the corresponding API key (supports direct paste)
4. If selecting Custom API, you also need to enter a custom API endpoint URL
5. Configuration will be automatically saved to Claude Code's configuration file

### View Configuration

Select "View Current Configuration" to view Claude Code's current configuration, including:
- Currently used service provider
- API endpoint address
- API key (partially hidden)
- Timeout settings, etc.

### Validate Configuration

Select "Validate Configuration" to test if the current API key is valid. The tool will actually send requests through Claude Code commands to validate the configuration.

### Check Installation and Launch

- **Check Claude Code Installation**: Check if Claude Code is installed in the system and display version information
- **Launch Claude Code**: Directly launch Claude Code's interactive interface

### Delete Keys

Select "Delete Key" to clear the current API key configuration.

## Configuration File Location

The tool directly modifies Claude Code's configuration file:

```
~/.claude/settings.json
```

Configuration file format example:

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

> Note: Different service providers have different configurations. The tool will automatically set the corresponding model configuration based on the selected service provider.

## About Claude Code

[Claude Code](https://code.claude.com) is Anthropic's official AI programming assistant tool that can be used in the terminal.

- Install Claude Code: `curl -fsSL https://claude.ai/install.sh | bash`
- Documentation: https://code.claude.com/docs

## Development

```bash
# Clone the project
git clone <repository-url>
cd @alienzhou1958/cc-helper

# Install dependencies
npm install

# Run
npm start
```

## Internal Distribution

### Method 1: Package Distribution (Recommended)

1. **Package the project**:
```bash
npm run build
# or
npm pack
```

This will generate a `alienzhou1958-cc-helper-1.0.0.tgz` file.

2. **Distribute and Install**:
Distribute the `.tgz` file to team members, who can install it via:

```bash
# Global installation
npm install -g /path/to/alienzhou1958-cc-helper-1.0.0.tgz

# or local installation
npm install /path/to/alienzhou1958-cc-helper-1.0.0.tgz
```

After installation, you can use the `cc-helper` command.

### Method 2: Install from Git Repository

If the project is in a Git repository (such as GitHub, GitLab, etc.), you can install directly:

```bash
# Install from Git repository
npm install -g git+https://your-git-repo-url.git

# or specify branch/tag
npm install -g git+https://your-git-repo-url.git#main
```

### Method 3: Local Link (for development)

When developing on the same machine, you can use `npm link`:

```bash
# In the project directory
npm link

# Then you can directly use the cc-helper command
cc-helper
```

## License

MIT

