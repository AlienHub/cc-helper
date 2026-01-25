// 多语言支持
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const LANG_CONFIG_FILE = path.join(os.homedir(), '.cc-helper', 'lang.json');

// 语言包
const translations = {
  zh: {
    // 通用
    back: '返回主菜单',
    cancel: '取消',
    exit: '退出',
    confirm: '确认',
    operationCancelled: '操作已取消',
    
    // 主菜单
    selectAction: '请选择操作',
    configKey: '配置/更新密钥',
    configKeyDesc: '添加或更新 API 密钥',
    viewConfig: '查看当前配置',
    viewConfigDesc: '查看已配置的密钥和端点',
    verifyConfig: '验证配置',
    verifyConfigDesc: '测试 API 密钥是否有效',
    checkInstall: '检查 Claude Code 安装',
    checkInstallDesc: '检查 Claude Code 是否已安装',
    launchClaude: '启动 Claude Code',
    launchClaudeDesc: '直接启动 Claude Code',
    deleteKey: '删除密钥',
    deleteKeyDesc: '清除当前配置',
    exitApp: '退出',
    exitAppDesc: '退出程序',
    goodbye: '再见!',
    
    // 配置相关
    selectProvider: '选择要配置的服务提供商',
    customAPI: '自定义 API 端点',
    customAPIDesc: '配置自定义 API 端点和密钥',
    customAPIName: '自定义 API',
    enterCustomURL: '请输入自定义 API 端点 URL',
    enterCustomURLCurrent: '请输入自定义 API 端点 URL（当前: {current}）',
    enterAPIKey: '请输入 API 密钥',
    enterAPIKeyCurrent: '请输入 API 密钥（当前: {current}）',
    enterProviderAPIKey: '请输入 {provider} 的 API 密钥',
    enterProviderAPIKeyCurrent: '请输入 {provider} 的 API 密钥（当前: {current}）',
    urlCannotBeEmpty: 'API 端点不能为空',
    urlMustBeHTTP: 'URL 必须以 http:// 或 https:// 开头',
    invalidURL: '请输入有效的 URL 格式',
    keyCannotBeEmpty: '密钥不能为空',
    keyTooShort: '密钥长度似乎不正确，请检查',
    configSaved: '{provider} 配置已保存成功!',
    apiEndpoint: 'API 端点',
    modelConfigSet: '模型配置: 已自动设置',
    unknownProvider: '未知的服务提供商',
    configError: '配置过程中发生错误',
    
    // 查看配置
    currentConfig: '当前 Claude Code 配置',
    noAPIKey: '未配置 API 密钥',
    serviceProvider: '服务提供商',
    apiEndpointLabel: 'API 端点',
    apiKey: 'API 密钥',
    timeout: '超时设置',
    configFile: '配置文件',
    notSet: '未设置',
    seconds: '秒',
    pressEnterToBack: '按回车键返回主菜单',
    
    // 验证配置
    validating: '正在通过 Claude Code 验证配置...',
    testing: '正在测试 Claude Code 连接（最多等待 30 秒）...',
    validationSuccess: '配置验证成功！',
    validationSuccessDesc: 'Claude Code 可以正常工作，配置有效。',
    response: '响应',
    validationFailed: '配置验证失败！',
    validationFailedDesc: '配置可能存在问题，请检查 API 密钥和端点是否正确。',
    error: '错误',
    noKeyToVerify: '未配置 API 密钥，无法验证',
    claudeNotInstalled: '未找到 Claude Code 命令',
    installClaude: '请先安装 Claude Code',
    installCommand: 'curl -fsSL https://claude.ai/install.sh | bash',
    
    // 检查安装
    checkingInstall: '正在检查 Claude Code 安装状态...',
    installed: 'Claude Code 已安装',
    version: '版本信息',
    canLaunch: '可以使用 "启动 Claude Code" 选项直接启动',
    notInstalled: 'Claude Code 未安装',
    installMethod: '安装方法',
    restartTerminal: '安装后请重启终端或运行: source ~/.bashrc (或 ~/.zshrc)',
    
    // 启动
    launching: '正在启动 Claude Code...',
    launchTip: '提示: 按 Ctrl+C 可以退出 Claude Code',
    launchExited: 'Claude Code 已退出',
    launchFailed: '启动 Claude Code 失败',
    launchSuccess: 'Claude Code 已成功启动并退出。',
    launchFailedOrCancelled: 'Claude Code 启动失败或用户取消。',
    
    // 删除
    noConfigToDelete: '没有可删除的配置',
    confirmDelete: '确定要清除 {provider} 的 API 密钥配置吗?',
    deleteCancelled: '已取消删除',
    configCleared: '配置已清除!',
    
    // 启动界面
    title: 'Claude Code 密钥配置工具',
    errorNotTTY: '错误: 此工具需要在交互式终端中运行',
    runDirectly: '请直接在终端中运行: npm start 或 node bin/cli.js',
    errorOccurred: '发生错误',
    
    // 语言选择
    selectLanguage: '请选择语言 / Please select language',
    chinese: '中文',
    english: 'English'
  },
  en: {
    // Common
    back: 'Back to Main Menu',
    cancel: 'Cancel',
    exit: 'Exit',
    confirm: 'Confirm',
    operationCancelled: 'Operation cancelled',
    
    // Main menu
    selectAction: 'Please select an action',
    configKey: 'Configure/Update Key',
    configKeyDesc: 'Add or update API keys',
    viewConfig: 'View Current Configuration',
    viewConfigDesc: 'View configured keys and endpoints',
    verifyConfig: 'Validate Configuration',
    verifyConfigDesc: 'Test if API keys are valid',
    checkInstall: 'Check Claude Code Installation',
    checkInstallDesc: 'Check if Claude Code is installed',
    launchClaude: 'Launch Claude Code',
    launchClaudeDesc: 'Directly launch Claude Code',
    deleteKey: 'Delete Key',
    deleteKeyDesc: 'Clear current configuration',
    exitApp: 'Exit',
    exitAppDesc: 'Exit the program',
    goodbye: 'Goodbye!',
    
    // Configuration
    selectProvider: 'Select service provider to configure',
    customAPI: 'Custom API Endpoint',
    customAPIDesc: 'Configure custom API endpoint and key',
    customAPIName: 'Custom API',
    enterCustomURL: 'Enter custom API endpoint URL',
    enterCustomURLCurrent: 'Enter custom API endpoint URL (current: {current})',
    enterAPIKey: 'Enter API key',
    enterAPIKeyCurrent: 'Enter API key (current: {current})',
    enterProviderAPIKey: 'Enter {provider} API key',
    enterProviderAPIKeyCurrent: 'Enter {provider} API key (current: {current})',
    urlCannotBeEmpty: 'API endpoint cannot be empty',
    urlMustBeHTTP: 'URL must start with http:// or https://',
    invalidURL: 'Please enter a valid URL format',
    keyCannotBeEmpty: 'Key cannot be empty',
    keyTooShort: 'Key length seems incorrect, please check',
    configSaved: '{provider} configuration saved successfully!',
    apiEndpoint: 'API Endpoint',
    modelConfigSet: 'Model Configuration: Auto-configured',
    unknownProvider: 'Unknown service provider',
    configError: 'Error occurred during configuration',
    
    // View configuration
    currentConfig: 'Current Claude Code Configuration',
    noAPIKey: 'No API key configured',
    serviceProvider: 'Service Provider',
    apiEndpointLabel: 'API Endpoint',
    apiKey: 'API Key',
    timeout: 'Timeout',
    configFile: 'Configuration File',
    notSet: 'Not set',
    seconds: 'seconds',
    pressEnterToBack: 'Press Enter to return to main menu',
    
    // Validate configuration
    validating: 'Validating configuration through Claude Code...',
    testing: 'Testing Claude Code connection (wait up to 30 seconds)...',
    validationSuccess: 'Configuration validation successful!',
    validationSuccessDesc: 'Claude Code can work normally, configuration is valid.',
    response: 'Response',
    validationFailed: 'Configuration validation failed!',
    validationFailedDesc: 'Configuration may have issues, please check if API key and endpoint are correct.',
    error: 'Error',
    noKeyToVerify: 'No API key configured, cannot validate',
    claudeNotInstalled: 'Claude Code command not found',
    installClaude: 'Please install Claude Code first',
    installCommand: 'curl -fsSL https://claude.ai/install.sh | bash',
    
    // Check installation
    checkingInstall: 'Checking Claude Code installation status...',
    installed: 'Claude Code is installed',
    version: 'Version',
    canLaunch: 'You can use the "Launch Claude Code" option to launch directly',
    notInstalled: 'Claude Code is not installed',
    installMethod: 'Installation method',
    restartTerminal: 'After installation, please restart terminal or run: source ~/.bashrc (or ~/.zshrc)',
    
    // Launch
    launching: 'Launching Claude Code...',
    launchTip: 'Tip: Press Ctrl+C to exit Claude Code',
    launchExited: 'Claude Code has exited',
    launchFailed: 'Failed to launch Claude Code',
    launchSuccess: 'Claude Code launched and exited successfully.',
    launchFailedOrCancelled: 'Claude Code launch failed or user cancelled.',
    
    // Delete
    noConfigToDelete: 'No configuration to delete',
    confirmDelete: 'Are you sure you want to clear the API key configuration for {provider}?',
    deleteCancelled: 'Delete cancelled',
    configCleared: 'Configuration cleared!',
    
    // Startup
    title: 'Claude Code API Key Configuration Tool',
    errorNotTTY: 'Error: This tool needs to run in an interactive terminal',
    runDirectly: 'Please run directly in terminal: npm start or node bin/cli.js',
    errorOccurred: 'An error occurred',
    
    // Language selection
    selectLanguage: 'Please select language / 请选择语言',
    chinese: '中文',
    english: 'English'
  }
};

// 获取当前语言
function getLanguage() {
  try {
    if (fs.existsSync(LANG_CONFIG_FILE)) {
      const config = fs.readJsonSync(LANG_CONFIG_FILE);
      return config.language || 'zh';
    }
  } catch (error) {
    // 忽略错误，使用默认语言
  }
  return 'zh'; // 默认中文
}

// 保存语言设置
function saveLanguage(lang) {
  try {
    const dir = path.dirname(LANG_CONFIG_FILE);
    fs.ensureDirSync(dir);
    fs.writeJsonSync(LANG_CONFIG_FILE, { language: lang }, { spaces: 2 });
  } catch (error) {
    // 忽略错误
  }
}

// 获取翻译
function t(key, params = {}) {
  const lang = getLanguage();
  const langTranslations = translations[lang] || translations.zh;
  let text = langTranslations[key] || key;
  
  // 替换参数
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
  }
  
  return text;
}

// 设置语言
function setLanguage(lang) {
  if (translations[lang]) {
    saveLanguage(lang);
    return true;
  }
  return false;
}

// 获取可用语言列表
function getAvailableLanguages() {
  return Object.keys(translations).map(key => ({
    value: key,
    title: key === 'zh' ? '中文' : 'English',
    description: key === 'zh' ? 'Chinese' : 'English'
  }));
}

module.exports = {
  t,
  setLanguage,
  getLanguage,
  getAvailableLanguages,
  translations
};

