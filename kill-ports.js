import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ports = [3000, 3001];

async function killPort(port) {
  try {
    // Windows command to find and kill process on port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);

    if (stdout) {
      // Extract PIDs from netstat output
      const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
      const pids = new Set();

      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') {
          pids.add(pid);
        }
      });

      // Kill each PID
      for (const pid of pids) {
        try {
          await execAsync(`taskkill /PID ${pid} /F`);
          console.log(`✅ Killed process ${pid} on port ${port}`);
        } catch (error) {
          // Process might already be dead, ignore error
        }
      }
    }
  } catch (error) {
    // No process on this port, that's fine
    console.log(`✅ Port ${port} is available`);
  }
}

async function killAllPorts() {
  console.log('🔍 Checking for processes on ports 3000 and 3001...\n');

  for (const port of ports) {
    await killPort(port);
  }

  console.log('\n✅ All ports are ready!\n');
}

killAllPorts().catch(console.error);
