const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const PROVIDERS = require('./providers');

// Claude Code 配置文件路径
const CLAUDE_CONFIG_DIR = path.join(os.homedir(), '.claude');
const CLAUDE_SETTINGS_FILE = path.join(CLAUDE_CONFIG_DIR, 'settings.json');
const CLAUDE_JSON_FILE = path.join(os.homedir(), '.claude.json');

// 读取 Claude Code 配置文件
function readClaudeConfig() {
  try {
    if (fs.existsSync(CLAUDE_SETTINGS_FILE)) {
      const config = fs.readJsonSync(CLAUDE_SETTINGS_FILE);
      return config.env || {};
    }
  } catch (error) {
    console.error(chalk.red('读取 Claude Code 配置文件失败:'), error.message);
  }
  return {};
}

// 保存 Claude Code 配置文件
function saveClaudeConfig(envConfig, providerKey) {
  try {
    // 确保配置目录存在
    fs.ensureDirSync(CLAUDE_CONFIG_DIR);
    
    let settings = {};
    if (fs.existsSync(CLAUDE_SETTINGS_FILE)) {
      settings = fs.readJsonSync(CLAUDE_SETTINGS_FILE);
    }
    
    // 获取服务提供商的模型配置
    const provider = PROVIDERS[providerKey];
    const modelConfig = provider ? provider.modelConfig || {} : {};
    
    // 合并基础配置、模型配置和用户提供的配置
    settings.env = { 
      ...(settings.env || {}), 
      ...modelConfig,
      ...envConfig 
    };
    
    // 添加超时设置（如果不存在）
    if (!settings.env.API_TIMEOUT_MS) {
      settings.env.API_TIMEOUT_MS = '3000000';
    }
    
    // 禁用非必要流量（可选）
    if (!settings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) {
      settings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = 1;
    }
    
    fs.writeJsonSync(CLAUDE_SETTINGS_FILE, settings, { spaces: 2 });
    console.log(chalk.green(`\n✓ 配置已保存到: ${CLAUDE_SETTINGS_FILE}`));
    
    // 确保 .claude.json 文件存在并设置 hasCompletedOnboarding
    ensureClaudeJson();
    
    return true;
  } catch (error) {
    console.error(chalk.red('保存配置文件失败:'), error.message);
    return false;
  }
}

// 确保 .claude.json 文件存在并设置 hasCompletedOnboarding
function ensureClaudeJson() {
  try {
    let claudeJson = {};
    if (fs.existsSync(CLAUDE_JSON_FILE)) {
      claudeJson = fs.readJsonSync(CLAUDE_JSON_FILE);
    }
    
    // 设置 hasCompletedOnboarding 为 true
    claudeJson.hasCompletedOnboarding = true;
    
    fs.writeJsonSync(CLAUDE_JSON_FILE, claudeJson, { spaces: 2 });
  } catch (error) {
    // 如果无法创建 .claude.json，不影响主流程
    console.log(chalk.yellow(`  注意: 无法更新 .claude.json: ${error.message}`));
  }
}

// 读取当前配置（从 Claude Code 配置文件）
function readConfig() {
  const claudeConfig = readClaudeConfig();
  const config = {};
  
  // 根据 ANTHROPIC_BASE_URL 判断当前使用的服务提供商
  // 如果没有配置，使用第一个可用的服务提供商作为默认值
  const firstProvider = Object.values(PROVIDERS)[0];
  const currentBaseUrl = claudeConfig.ANTHROPIC_BASE_URL || (firstProvider ? firstProvider.baseUrl : '');
  const currentToken = claudeConfig.ANTHROPIC_AUTH_TOKEN || '';
  
  // 找到匹配的服务提供商
  for (const [key, provider] of Object.entries(PROVIDERS)) {
    if (currentBaseUrl === provider.baseUrl) {
      config.provider = key;
      config.token = currentToken;
      config.baseUrl = currentBaseUrl;
      break;
    }
  }
  
  // 如果没有匹配到预设的服务提供商，认为是自定义配置
  if (!config.provider) {
    config.provider = 'custom';
    config.token = currentToken;
    config.baseUrl = currentBaseUrl;
  }
  
  return config;
}

module.exports = {
  readClaudeConfig,
  saveClaudeConfig,
  ensureClaudeJson,
  readConfig,
  CLAUDE_SETTINGS_FILE,
  CLAUDE_CONFIG_DIR,
  CLAUDE_JSON_FILE
};

