import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { validPort } from './project';

export interface RunningServer { origin: string; token: string; root: string }

export class PreviewServer {
  private child: ChildProcess | null = null;
  private pending: Promise<RunningServer> | null = null;
  running: RunningServer | null = null;
  private cancelStart: (() => void) | null = null;
  readonly logs: string[] = [];
  private logLength = 0;

  constructor(private onStatus: (text: string) => void = () => {}) {}

  private log(text: string): void {
    const clean = text.replace(/\u001b\[[0-9;]*m/g, '').slice(-18000);
    this.logs.push(clean);
    this.logLength += clean.length;
    while (this.logLength > 18000) this.logLength -= this.logs.shift()!.length;
  }

  start(root: string, nodePath: string, port: number): Promise<RunningServer> {
    if (this.running?.root === root) return Promise.resolve(this.running);
    if (this.pending) return this.pending;
    validPort(port);
    if (!existsSync(path.join(root, 'node_modules/astro/package.json'))) {
      return Promise.reject(new Error('Blog 尚未安装依赖。请先在 Blog 根目录运行 pnpm install。'));
    }
    this.stop();
    const token = randomBytes(24).toString('hex');
    this.logs.length = 0;
    this.logLength = 0;
    this.onStatus('正在启动 Blog 预览，首次编译需要一些时间…');
    const operation = new Promise<RunningServer>((resolve, reject) => {
      let ready = false;
      const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: 'development', ASTRO_TELEMETRY_DISABLED: '1' };
      // Use a separate Node executable, never Obsidian's Electron executable or a shell.
      delete env.ELECTRON_RUN_AS_NODE;
      delete env.NODE_OPTIONS;
      const child = spawn(nodePath.trim() || 'node', ['--input-type=module', '-e', __PREVIEW_RUNNER__, root, String(port), token], {
        cwd: root, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      });
      this.child = child;
      const fail = (error: Error) => { clearTimeout(timeout); reject(error); };
      const timeout = setTimeout(() => {
        fail(new Error('启动超过 90 秒。请查看日志，确认 Node.js 版本、项目依赖和端口设置。'));
        if (this.child === child) this.stop();
      }, 90000);
      this.cancelStart = () => fail(new Error('预览服务已停止。'));
      child.stdout?.on('data', data => this.log(data.toString()));
      child.stderr?.on('data', data => this.log(data.toString()));
      child.once('error', error => {
        this.log(error.message);
        fail(new Error(`无法运行 Node.js：${error.message}。可在设置中填写 node.exe 的完整路径。`));
      });
      child.on('message', (message: unknown) => {
        const data = message as { type?: string; origin?: string; message?: string };
        if (data.type === 'error') {
          this.log(data.message ?? '启动失败');
          fail(new Error(data.message ?? '启动失败，请查看日志。'));
        }
        if (data.type !== 'ready' || this.child !== child) return;
        // The runner binds strictly to loopback and never silently switches ports.
        if (data.origin !== `http://127.0.0.1:${port}`) {
          fail(new Error('预览服务返回了非预期地址。'));
          this.stop();
          return;
        }
        ready = true;
        clearTimeout(timeout);
        this.cancelStart = null;
        this.running = { root, token, origin: data.origin };
        resolve(this.running);
      });
      child.once('exit', (code) => {
        if (this.child === child) {
          this.child = null;
          this.running = null;
          this.onStatus(ready ? '预览服务已停止，可点击刷新重新启动。' : '启动失败，请查看日志。');
        }
        fail(new Error(`预览服务退出（${code ?? '被终止'}）。${this.logs.join('').slice(-1200)}`));
      });
    });
    this.pending = operation;
    void operation.finally(() => { if (this.pending === operation) this.pending = null; }).catch(() => {});
    return operation;
  }

  stop(): void {
    const child = this.child;
    this.child = null;
    this.running = null;
    this.cancelStart?.();
    this.cancelStart = null;
    this.pending = null;
    if (!child || child.exitCode !== null) return;
    if (child.connected) child.send({ type: 'stop' }, () => {});
    else child.kill();
    // Only terminate the process we created; never reuse/stop the visitor's server on 4321.
    const fallback = setTimeout(() => { if (child.exitCode === null) child.kill(); }, 8000);
    fallback.unref();
    child.once('exit', () => clearTimeout(fallback));
  }
}
