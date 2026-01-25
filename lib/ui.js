const prompts = require('prompts');
const chalk = require('chalk');
const { readConfig, readClaudeConfig, saveClaudeConfig, CLAUDE_SETTINGS_FILE } = require('./config');
const { verifyConfig, checkClaudeInstallation, launchClaudeCode } = require('./validator');
const PROVIDERS = require('./providers');
const { t, setLanguage, getLanguage, getAvailableLanguages } = require('./i18n');

// 显示当前配置
async function showConfig(mainMenu) {
  const config = readConfig();
  const claudeConfig = readClaudeConfig();
  
  console.log(chalk.blue('\n' + t('currentConfig') + ':'));
  console.log(chalk.gray('─'.repeat(60)));
  
  if (!config.token || config.token.length === 0) {
    console.log(chalk.yellow('  ' + t('noAPIKey')));
  } else {
    const providerInfo = PROVIDERS[config.provider] || Object.values(PROVIDERS)[0];
    const displayToken = config.token ? `${config.token.substring(0, 12)}...${config.token.substring(config.token.length - 4)}` : t('notSet');
    
    console.log(chalk.cyan('  ' + t('serviceProvider') + ':'), providerInfo.name);
    console.log(chalk.cyan('  ' + t('apiEndpointLabel') + ':'), config.baseUrl || providerInfo.baseUrl);
    console.log(chalk.cyan('  ' + t('apiKey') + ':'), displayToken);
    
    if (claudeConfig.API_TIMEOUT_MS) {
      console.log(chalk.cyan('  ' + t('timeout') + ':'), `${parseInt(claudeConfig.API_TIMEOUT_MS) / 1000}${t('seconds')}`);
    }
  }
  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.gray(`  ${t('configFile')}: ${CLAUDE_SETTINGS_FILE}`));
  
  // 询问是否返回主菜单
  try {
    await prompts({
      type: 'select',
      name: 'action',
      message: '\n' + t('pressEnterToBack'),
      choices: [
        { title: t('back'), value: 'back' }
      ],
      initial: 0,
      onCancel: () => {
        return true;
      }
    });
  } catch (error) {
    if (error.name === 'ExitPrompt') {
      return;
    }
    throw error;
  }
}

// 配置密钥
async function configKeys(currentConfig, mainMenu) {
  try {
    // 选择服务提供商
    const providerChoices = [
      ...Object.entries(PROVIDERS).map(([key, value]) => ({
        title: value.name,
        value: key,
        description: value.description
      })),
      { title: t('customAPI'), value: 'custom', description: t('customAPIDesc') },
      { title: t('back'), value: 'back', description: t('back') }
    ];
    
    const { provider } = await prompts({
      type: 'select',
      name: 'provider',
      message: t('selectProvider'),
      choices: providerChoices,
      initial: providerChoices.findIndex(c => c.value === (currentConfig.provider || Object.keys(PROVIDERS)[0])),
      onCancel: () => {
        return true;
      }
    });

    if (!provider || provider === 'back') {
      await mainMenu();
      return;
    }

    let providerInfo;
    let baseUrl;
    let token;
    let providerKey = provider;

    // 如果是自定义配置
    if (provider === 'custom') {
      const currentBaseUrl = currentConfig.provider === 'custom' ? currentConfig.baseUrl : '';
      const currentToken = currentConfig.provider === 'custom' ? currentConfig.token : '';
      const displayToken = currentToken ? `${currentToken.substring(0, 12)}...${currentToken.substring(currentToken.length - 4)}` : t('notSet');

      // 输入自定义 API 端点
      const { customBaseUrl } = await prompts({
        type: 'text',
        name: 'customBaseUrl',
        message: currentBaseUrl ? t('enterCustomURLCurrent', { current: currentBaseUrl }) : t('enterCustomURL'),
        initial: currentBaseUrl || '',
        placeholder: 'https://api.example.com/anthropic',
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return t('urlCannotBeEmpty');
          }
          if (value.trim().toLowerCase() === 'back') {
            return true;
          }
          try {
            const url = new URL(value.trim());
            if (!url.protocol.startsWith('http')) {
              return t('urlMustBeHTTP');
            }
            return true;
          } catch (e) {
            return t('invalidURL');
          }
        },
        onCancel: () => {
          return true;
        }
      });

      if (!customBaseUrl || customBaseUrl.trim().toLowerCase() === 'back') {
        await mainMenu();
        return;
      }

      baseUrl = customBaseUrl.trim();

      // 输入 API 密钥
      const { customToken } = await prompts({
        type: 'text',
        name: 'customToken',
        message: currentToken ? t('enterAPIKeyCurrent', { current: displayToken }) : t('enterAPIKey'),
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return t('keyCannotBeEmpty');
          }
          if (value.trim().toLowerCase() === 'back') {
            return true;
          }
          if (value.trim().length < 10) {
            return t('keyTooShort');
          }
          return true;
        },
        onCancel: () => {
          return true;
        }
      });
      
      if (!customToken || customToken.trim().toLowerCase() === 'back') {
        await mainMenu();
        return;
      }

      token = customToken.trim();
      providerInfo = {
        name: t('customAPIName'),
        baseUrl: baseUrl,
        description: `${t('customAPIName')}: ${baseUrl}`
      };
    } else {
      // 预设服务提供商
      providerInfo = PROVIDERS[provider];
      if (!providerInfo) {
        console.log(chalk.red(t('unknownProvider')));
        await mainMenu();
        return;
      }

      baseUrl = providerInfo.baseUrl;
      const currentToken = currentConfig.provider === provider ? currentConfig.token : '';
      const displayToken = currentToken ? `${currentToken.substring(0, 12)}...${currentToken.substring(currentToken.length - 4)}` : t('notSet');

      // 输入 API 密钥
      const { inputToken } = await prompts({
        type: 'text',
        name: 'inputToken',
        message: currentToken ? t('enterProviderAPIKeyCurrent', { provider: providerInfo.name, current: displayToken }) : t('enterProviderAPIKey', { provider: providerInfo.name }),
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return t('keyCannotBeEmpty');
          }
          if (value.trim().toLowerCase() === 'back') {
            return true;
          }
          if (value.trim().length < 10) {
            return t('keyTooShort');
          }
          return true;
        },
        onCancel: () => {
          return true;
        }
      });
      
      if (!inputToken || inputToken.trim().toLowerCase() === 'back') {
        await mainMenu();
        return;
      }

      token = inputToken.trim();
    }

    // 保存配置
    const envConfig = {
      ANTHROPIC_AUTH_TOKEN: token,
      ANTHROPIC_BASE_URL: baseUrl
    };

    if (saveClaudeConfig(envConfig, providerKey)) {
      console.log(chalk.green(`\n${t('configSaved', { provider: providerInfo.name })}`));
      console.log(chalk.gray(`   ${t('apiEndpoint')}: ${baseUrl}`));
      if (provider !== 'custom' && Object.keys(providerInfo.modelConfig || {}).length > 0) {
        console.log(chalk.gray(`   ${t('modelConfigSet')}`));
      }
    }

    await mainMenu();
  } catch (error) {
    console.error(chalk.red('\n' + t('configError') + ':'), error.message);
    await mainMenu();
  }
}

// 检查 Claude Code 安装状态
async function checkInstallation(mainMenu) {
  console.log(chalk.blue('\n' + t('checkingInstall') + '\n'));
  
  const result = await checkClaudeInstallation();
  
  if (result.installed) {
    console.log(chalk.green('✓ ' + t('installed')));
    console.log(chalk.cyan(`   ${t('version')}: ${result.version}`));
    console.log(chalk.gray('\n   ' + t('canLaunch')));
  } else {
    console.log(chalk.red('✗ ' + t('notInstalled')));
    console.log(chalk.yellow('\n   ' + t('installMethod') + ':'));
    console.log(chalk.gray('   ' + t('installCommand')));
    console.log(chalk.gray('\n   ' + t('restartTerminal')));
  }
  
  console.log('');
  
  // 询问是否返回主菜单
  try {
    await prompts({
      type: 'select',
      name: 'action',
      message: t('pressEnterToBack'),
      choices: [
        { title: t('back'), value: 'back' }
      ],
      initial: 0,
      onCancel: () => {
        return true;
      }
    });
  } catch (error) {
    if (error.name === 'ExitPrompt') {
      await mainMenu();
      return;
    }
    throw error;
  }
  
  await mainMenu();
}

// 启动 Claude Code
async function launchClaude(mainMenu) {
  const result = await checkClaudeInstallation();
  
  if (!result.installed) {
    console.log(chalk.red('\n' + t('notInstalled')));
    console.log(chalk.yellow('   ' + t('installClaude') + ':'));
    console.log(chalk.gray('   ' + t('installCommand')));
    console.log(chalk.gray('\n   ' + t('restartTerminal')));
    
    // 询问是否返回主菜单
    try {
      await prompts({
        type: 'select',
        name: 'action',
        message: '\n' + t('pressEnterToBack'),
        choices: [
          { title: t('back'), value: 'back' }
        ],
        initial: 0,
        onCancel: () => {
          return true;
        }
      });
    } catch (error) {
      if (error.name === 'ExitPrompt') {
        await mainMenu();
        return;
      }
      throw error;
    }
    
    await mainMenu();
    return;
  }
  
  // 启动 Claude Code
  const launched = await launchClaudeCode();
  if (launched) {
    console.log(chalk.green('\n' + t('launchSuccess')));
  } else {
    console.log(chalk.red('\n' + t('launchFailedOrCancelled')));
  }
  
  // 启动后返回主菜单
  await mainMenu();
}

// 删除密钥
async function deleteKeys(currentConfig, mainMenu) {
  if (!currentConfig.token || currentConfig.token.length === 0) {
    console.log(chalk.yellow('\n' + t('noConfigToDelete')));
    await mainMenu();
    return;
  }

  let providerName;
  if (currentConfig.provider === 'custom') {
    providerName = t('customAPIName');
  } else {
    const providerInfo = PROVIDERS[currentConfig.provider] || Object.values(PROVIDERS)[0];
    providerName = providerInfo.name;
  }
  const displayToken = currentConfig.token ? `${currentConfig.token.substring(0, 12)}...${currentConfig.token.substring(currentConfig.token.length - 4)}` : '';

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: t('confirmDelete', { provider: providerName }),
    initial: false,
    onCancel: () => {
      return true;
    }
  });

  if (!confirm) {
    console.log(chalk.yellow('\n' + t('deleteCancelled')));
    await mainMenu();
    return;
  }

  if (confirm) {
    // 清除 ANTHROPIC_AUTH_TOKEN，但保留其他配置
    const claudeConfig = readClaudeConfig();
    delete claudeConfig.ANTHROPIC_AUTH_TOKEN;
    delete claudeConfig.ANTHROPIC_BASE_URL;
    
    // 创建一个空的 env 配置来保存
    if (saveClaudeConfig(claudeConfig, currentConfig.provider || Object.keys(PROVIDERS)[0])) {
      console.log(chalk.green('\n' + t('configCleared') + '!'));
    }
  }

  await mainMenu();
}

// 主菜单
async function mainMenu() {
  const config = readConfig();
  
  let response;
  try {
    response = await prompts({
      type: 'select',
      name: 'action',
      message: t('selectAction'),
      choices: [
        { title: t('configKey'), value: 'config', description: t('configKeyDesc') },
        { title: t('viewConfig'), value: 'view', description: t('viewConfigDesc') },
        { title: t('verifyConfig'), value: 'verify', description: t('verifyConfigDesc') },
        { title: t('checkInstall'), value: 'check', description: t('checkInstallDesc') },
        { title: t('launchClaude'), value: 'launch', description: t('launchClaudeDesc') },
        { title: t('deleteKey'), value: 'delete', description: t('deleteKeyDesc') },
        { title: t('exitApp'), value: 'exit', description: t('exitAppDesc') }
      ],
      initial: 0,
      onCancel: () => {
        return true;
      }
    });
  } catch (error) {
    if (error.name === 'ExitPrompt' || !process.stdin.isTTY) {
      console.log(chalk.yellow('\n\n' + t('operationCancelled')));
      process.exit(0);
    }
    throw error;
  }
  
  if (!response || !response.action) {
    console.log(chalk.yellow('\n\n' + t('operationCancelled')));
    process.exit(0);
  }
  
  const { action } = response;

  switch (action) {
    case 'config':
      await configKeys(config, mainMenu);
      break;
    case 'view':
      await showConfig(mainMenu);
      await mainMenu();
      break;
    case 'verify':
      await verifyConfig(config, mainMenu);
      break;
    case 'check':
      await checkInstallation(mainMenu);
      break;
    case 'launch':
      await launchClaude(mainMenu);
      break;
    case 'delete':
      await deleteKeys(config, mainMenu);
      break;
    case 'exit':
      console.log(chalk.blue('\n' + t('goodbye') + '!'));
      process.exit(0);
  }
}

// 选择语言
async function selectLanguage() {
  const currentLang = getLanguage();
  const langChoices = getAvailableLanguages();
  
  try {
    const { language } = await prompts({
      type: 'select',
      name: 'language',
      message: t('selectLanguage'),
      choices: langChoices,
      initial: langChoices.findIndex(l => l.value === currentLang),
      onCancel: () => {
        return true;
      }
    });
    
    if (language) {
      setLanguage(language);
      return language;
    }
    return currentLang;
  } catch (error) {
    return currentLang;
  }
}

// 启动CLI
async function start() {
  // 检查是否在交互式终端中运行
  if (process.stdin.isTTY === false || process.stdout.isTTY === false) {
    console.error(chalk.red(t('errorNotTTY')));
    console.error(chalk.yellow(t('runDirectly')));
    process.exit(1);
  }

  // 选择语言
  await selectLanguage();

  console.log(chalk.blue.bold('\n╔═══════════════════════════════════════╗'));
  console.log(chalk.blue.bold(`║   ${t('title')}            ║`));
  console.log(chalk.blue.bold('╚═══════════════════════════════════════╝\n'));
  
  // 显示当前配置（不等待用户输入）
  const config = readConfig();
  const claudeConfig = readClaudeConfig();
  
  console.log(chalk.blue(t('currentConfig') + ':'));
  console.log(chalk.gray('─'.repeat(60)));
  
  if (!config.token || config.token.length === 0) {
    console.log(chalk.yellow('  ' + t('noAPIKey')));
  } else {
    let providerName;
    if (config.provider === 'custom') {
      providerName = t('customAPIName');
    } else {
      const providerInfo = PROVIDERS[config.provider] || Object.values(PROVIDERS)[0];
      providerName = providerInfo.name;
    }
    
    const displayToken = config.token ? `${config.token.substring(0, 12)}...${config.token.substring(config.token.length - 4)}` : t('notSet');
    
    console.log(chalk.cyan('  ' + t('serviceProvider') + ':'), providerName);
    console.log(chalk.cyan('  ' + t('apiEndpointLabel') + ':'), config.baseUrl);
    console.log(chalk.cyan('  ' + t('apiKey') + ':'), displayToken);
    
    if (claudeConfig.API_TIMEOUT_MS) {
      console.log(chalk.cyan('  ' + t('timeout') + ':'), `${parseInt(claudeConfig.API_TIMEOUT_MS) / 1000}${t('seconds')}`);
    }
  }
  console.log(chalk.gray('─'.repeat(60)));
  console.log('');
  
  // 启动主菜单
  mainMenu().catch(error => {
    console.error(chalk.red('\n' + t('errorOccurred') + ':'), error.message);
    process.exit(1);
  });
}

module.exports = {
  mainMenu,
  showConfig,
  configKeys,
  deleteKeys,
  start
};

