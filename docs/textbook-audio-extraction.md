# 获取《新版中日交流标准日本语 初级》原版音频

本流程用于从人教社官方 iOS app 的离线资源包中提取个人学习用音频。不要公开分发提取出的音频文件。

## 关键发现

- 资源包 URL 通常类似：`http://ebookres.mypep.cn/resource/rjsnsj/book1-unit1.pep`
- `.pep` 文件本质是 zip 容器。
- `.pepm` 文件可直接复制为 `.mp3`。
- `.pepp` 文件可直接复制为 `.png`。
- `.dat` 文件是索引或加密二进制，本项目暂不需要处理。

## 抓取步骤

1. 在 Mac 上安装并启动 `mitmproxy` 或 `mitmweb`。
2. 让 iPhone 的 Wi-Fi 代理指向 Mac 的局域网 IP 和 mitmproxy 端口。
3. 在人教社官方 app 中下载目标 unit。
4. 在 mitmweb 中按响应大小倒序查找 `.pep` 请求，并保存 response body。
5. 用项目脚本解包：

```bash
./scripts/extract-pep-audio.sh ~/Downloads/book1-unit1.pep ./audio/lesson1
```

## 脚本输出

脚本会把包内文件按原目录结构复制到输出目录，并执行后缀转换：

- `*.pepm` -> `*.mp3`
- `*.pepp` -> `*.png`

## 常见问题

- 看不到 `.pep` 请求：确认 iPhone 代理已生效，并且 app 正在下载未缓存的章节。
- 解压失败：通常是 `.pep` 没保存完整，重新保存 response body。
- `.pepm` 无法播放：先用 `file` 检查真实格式，少数版本可能不再是 MP3。

## 相关文件

- `scripts/extract-pep-audio.sh`
- `data/lessons/lesson{n}.json`
- `JapaFlow-PRD-v0.1.10-audio-oss-migration.md`
