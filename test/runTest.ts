import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main(): Promise<void> {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      // Open the project as a workspace so ConfigurationTarget.Workspace
      // works in tests. Also disables other extensions for isolation.
      launchArgs: [extensionDevelopmentPath, '--disable-extensions']
    });
  } catch (err) {
    console.error('Failed to run tests:', err);
    process.exit(1);
  }
}

main();
