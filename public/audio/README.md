# 背景音乐 / Audio

首页右下角的音乐播放器会读取这个目录里的音轨。

## 当前文件

- `Born a Stranger.m4a`
- `For River.m4a`
- `To the Moon.m4a`

## 如何替换

1. 把你的音频文件（建议 `.m4a` 或 `.mp3`，每首几 MB 以内）放进这个目录。
2. 打开 `src/config.ts`，修改 `music.tracks` 数组里的 `title` 和 `src`：

   ```ts
   music: {
       enable: true,
       tracks: [
           { title: '你的曲名', src: '/audio/your-file.m4a' },
       ]
   }
   ```

3. 播放器默认静音、暂停，永不自动播放——访客点击后才会出声。

## 版权提醒

请只使用你拥有版权或获得授权（含 CC0 / 知识共享）的音乐。
