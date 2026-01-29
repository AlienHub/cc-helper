# cc-helper v1.0.0

🎉 **First Release!** A simple and easy-to-use CLI tool for interactively configuring [Claude Code](https://code.claude.com) API keys.

## ✨ Features

- 🌐 **Multi-language Support** - Choose between Chinese (中文) and English at startup
- 🔑 **Interactive API Key Configuration** - Easy-to-use prompts for configuring API keys
- 🌍 **Multiple Service Providers** - Support for GLM (Zhipu AI), MiniMax, and Kimi (Moonshot)
- 🔧 **Custom API Endpoints** - Configure your own API endpoints and tokens
- ✅ **Configuration Validation** - Test if your API keys are valid before using
- 📋 **View Current Configuration** - Check your current Claude Code settings
- 🔍 **Installation Check** - Verify if Claude Code is installed and check version
- 🚀 **Direct Launch** - Launch Claude Code directly from the tool
- 📝 **Clipboard Support** - Paste API keys directly (Cmd/Ctrl+V)
- 🎨 **Beautiful CLI Interface** - Modern and user-friendly command-line experience

## 🎯 Supported Service Providers

- **GLM (智谱AI)** - Zhipu AI compatible interface with GLM-4.7 and GLM-4.5-Air models
- **MiniMax** - MiniMax API with MiniMax-M2.1 model
- **Kimi (Moonshot)** - Moonshot Kimi API with kimi-k2-turbo-preview model
- **Custom API** - Configure your own API endpoints

## 📦 Installation

### Via npx (Recommended)
```bash
npx cc-helper
```

### Global Installation
```bash
npm install -g cc-helper
```

### From GitHub
```bash
npm install -g git+https://github.com/AlienHub/cc-helper.git
```

## 🚀 Quick Start

1. Run `cc-helper` or `npx cc-helper`
2. Select your preferred language (中文/English)
3. Choose "Configure/Update Key" to set up your API key
4. Select a service provider (GLM, MiniMax, Kimi, or Custom)
5. Enter your API key (supports clipboard paste)
6. The configuration will be automatically saved to `~/.claude/settings.json`

## 📋 What's Included

- Interactive CLI interface with `prompts` library
- Multi-language support (Chinese & English)
- Configuration validation through Claude Code commands
- Automatic model configuration for each service provider
- Support for custom API endpoints
- Configuration file management for Claude Code

## 🔧 Requirements

- Node.js >= 14.0.0
- Claude Code installed (optional, for validation and launch features)

## 📚 Documentation

- [中文文档](README.md)
- [English Documentation](README_EN.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

**Enjoy using cc-helper!** 🎉

If you encounter any issues or have suggestions, please open an issue on [GitHub](https://github.com/AlienHub/cc-helper).

