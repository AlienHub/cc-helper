const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const os = require('os');
const chalk = require('chalk');
const { readClaudeConfig } = require('./config');
const PROVIDERS = require('./providers');
const { t } = require('./i18n');

const execAsync = promisify(exec);

// 检查 claude 命令是否可用
async function checkClaudeCommand() {
  return new Promise((resolve) => {
    exec('which claude', (error) => {
      resolve(!error);
    });
  });
}

// 检查 Claude Code 安装状态并显示详细信息
async function checkClaudeInstallation() {
  const { t } = require('./i18n');
  const isInstalled = await checkClaudeCommand();
  
  if (isInstalled) {
    try {
      // 尝试获取 claude 版本信息
      const { stdout } = await execAsync(`claude --version 2>&1 || claude -v 2>&1 || echo "${t('installed')}"`);
      const version = stdout.trim();
      return {
        installed: true,
        version: version || t('installed'),
        message: t('installed')
      };
    } catch (error) {
      return {
        installed: true,
        version: t('installed') + ' (' + t('error') + ')',
        message: t('installed')
      };
    }
  } else {
    return {
      installed: false,
      version: null,
      message: t('notInstalled')
    };
  }
}

// 启动 Claude Code
async function launchClaudeCode() {
  const { t } = require('./i18n');
  const isInstalled = await checkClaudeCommand();
  
  if (!isInstalled) {
    console.log(chalk.red('\n' + t('notInstalled')));
    console.log(chalk.yellow('   ' + t('installClaude') + ':'));
    console.log(chalk.gray('   ' + t('installCommand')));
    return false;
  }
  
  console.log(chalk.blue('\n' + t('launching')));
  console.log(chalk.gray('   ' + t('launchTip') + '\n'));
  
  // 使用 spawn 启动 claude，保持交互式终端
  const child = spawn('claude', [], {
    stdio: 'inherit', // 继承 stdin/stdout/stderr，保持交互式
    env: process.env
  });
  
  // 等待进程退出
  return new Promise((resolve) => {
    const { t } = require('./i18n');
    child.on('exit', (code) => {
      console.log(chalk.gray('\n' + t('launchExited')));
      resolve(code === 0);
    });
    
    child.on('error', (error) => {
      console.error(chalk.red('\n' + t('launchFailed') + ':'), error.message);
      resolve(false);
    });
  });
}

// 通过 Claude Code 命令测试配置
async function testClaudeCode(customEnv = null) {
  return new Promise((resolve) => {
    // 使用 claude 命令的 -p 参数发送一个简单的提示来测试
    const testPrompt = 'hi';
    const tempDir = os.tmpdir();
    
    // 使用传入的环境变量，如果没有则使用 process.env
    // 确保 PATH 正确传递，以便能找到 claude 命令
    const execEnv = customEnv ? {
      ...customEnv,
      PATH: customEnv.PATH || process.env.PATH
    } : process.env;
    
    // 设置超时时间（30秒）
    const timeout = 30000;
    
    // 使用 spawn 执行命令
    let output = '';
    const startTime = Date.now();
    
    const child = spawn('claude', ['-p', testPrompt], {
      cwd: tempDir,
      env: execEnv,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    // 设置超时
    const timeoutId = setTimeout(() => {
      child.kill('SIGTERM');
      const lowerOutput = output.toLowerCase();
      const authErrors = [
        'authentication',
        'api key',
        'invalid',
        'unauthorized',
        'forbidden',
        '401',
        '403',
        'authentication_error',
        'invalid_api_key',
        'invalid api key',
        'api key is invalid'
      ];
      const hasAuthError = authErrors.some(err => lowerOutput.includes(err));
      
      if (hasAuthError) {
        resolve({ success: false, error: 'API 密钥认证失败' });
      } else if (output.trim().length > 0) {
        resolve({ 
          success: true, 
          message: '请求已发送，收到部分响应（配置可能有效，但响应较慢）' 
        });
      } else {
        resolve({ 
          success: true, 
          message: `配置验证超时（${timeout/1000}秒），但未检测到认证错误。配置可能有效，但 API 响应较慢。如果手动运行 \`claude -p "test"\` 能正常工作，说明配置是正确的。` 
        });
      }
    }, timeout);
    
    // 收集输出
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    // 处理进程退出
    child.on('exit', (code, signal) => {
      clearTimeout(timeoutId);
      const lowerOutput = output.toLowerCase();
      
      const authErrors = [
        'authentication',
        'api key',
        'invalid',
        'unauthorized',
        'forbidden',
        '401',
        '403',
        'authentication_error',
        'invalid_api_key',
        'invalid api key',
        'api key is invalid'
      ];
      
      const hasAuthError = authErrors.some(err => lowerOutput.includes(err));
      
      if (hasAuthError) {
        resolve({ success: false, error: 'API 密钥认证失败' });
        return;
      }
      
      if (signal === 'SIGTERM') {
        // 超时处理已在 timeoutId 中处理
        return;
      }
      
      if (code !== 0) {
        if (output.trim().length > 0) {
          if (lowerOutput.includes('connection') || lowerOutput.includes('network')) {
            resolve({ success: false, error: '网络连接问题' });
          } else {
            resolve({ success: false, error: `命令执行失败，退出码: ${code}` });
          }
        } else {
          resolve({ success: false, error: `命令执行失败，退出码: ${code}` });
        }
      } else {
        const response = output.trim();
        if (response.length > 0) {
          if (response.length > 10 && !lowerOutput.includes('error') && !lowerOutput.includes('failed')) {
            resolve({ 
              success: true, 
              message: response.substring(0, 150) 
            });
          } else {
            resolve({ success: true, message: 'Claude Code 响应成功（收到响应）' });
          }
        } else {
          resolve({ success: true, message: 'Claude Code 响应成功' });
        }
      }
    });
    
    child.on('error', (error) => {
      clearTimeout(timeoutId);
      if (error.code === 'ENOENT') {
        resolve({ success: false, error: 'Claude Code 命令不可用或未正确安装' });
      } else {
        resolve({ success: false, error: `执行失败: ${error.message}` });
      }
    });
  });
}

// 验证配置
async function verifyConfig(currentConfig, mainMenu) {
  if (!currentConfig.token || currentConfig.token.length === 0) {
    console.log(chalk.yellow('\n' + t('noKeyToVerify')));
    await mainMenu();
    return;
  }

  // 检查 claude 命令是否可用
  try {
    await execAsync('which claude');
  } catch (error) {
    console.log(chalk.red('\n' + t('claudeNotInstalled')));
    console.log(chalk.yellow('   ' + t('installClaude') + ':'));
    console.log(chalk.gray('   ' + t('installCommand')));
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
  const baseUrl = currentConfig.baseUrl;

  console.log(chalk.blue(`\n${t('validating')}`));
  console.log(chalk.gray(`  ${t('serviceProvider')}: ${providerName}`));
  console.log(chalk.gray(`  ${t('apiEndpointLabel')}: ${baseUrl}`));
  console.log(chalk.gray(`  ${t('apiKey')}: ${currentConfig.token.substring(0, 12)}...\n`));

  try {
    process.stdout.write(chalk.yellow(t('testing')));
    
    const claudeConfig = readClaudeConfig();
    const envForTest = { 
      ...process.env, 
      ...claudeConfig,
      PATH: process.env.PATH
    };
    
    const testResult = await testClaudeCode(envForTest);
    process.stdout.write('\r' + ' '.repeat(50) + '\r');
    
    if (testResult.success) {
      console.log(chalk.green(t('validationSuccess')));
      console.log(chalk.green('   ' + t('validationSuccessDesc')));
      if (testResult.message) {
        console.log(chalk.gray(`   ${t('response')}: ${testResult.message.substring(0, 100)}...`));
      }
    } else {
      console.log(chalk.red(t('validationFailed')));
      if (testResult.error) {
        console.log(chalk.red(`   ${t('error')}: ${testResult.error}`));
      }
      console.log(chalk.yellow('\n   ' + t('validationFailedDesc')));
    }
  } catch (error) {
    process.stdout.write('\r' + ' '.repeat(40) + '\r');
    console.log(chalk.red(`${t('error')}:`));
    console.log(chalk.red(`   ${error.message}`));
  }

  await mainMenu();
}

module.exports = {
  verifyConfig,
  testClaudeCode,
  checkClaudeCommand,
  checkClaudeInstallation,
  launchClaudeCode
};

