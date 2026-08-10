# 翻面挑战静态落地页

这个目录不依赖特定云厂商，可以部署到任意支持 HTTPS 和路径重写的静态托管服务。

## 部署

1. 把 `/challenge` 重写到 `index.html`，静态资源仍从站点根目录读取。
2. 在 `config.js` 填入 App Store 和 Android 商店/下载页 HTTPS 地址。
3. 使用正式域名构建 App：

```bash
flutter build appbundle --release \
  --dart-define=FANMIAN_LINK_BASE=https://你的域名
```

此后 App 分享的地址形如：

```text
https://你的域名/challenge?threshold=25&break=60
```

在正式签名资料就绪后，还需要按平台提供：

- iOS `apple-app-site-association`，内容需要 Apple Team ID 和 Bundle ID。
- Android `.well-known/assetlinks.json`，内容需要 Release 签名证书 SHA-256。
- iOS Associated Domains entitlement 和 Android 带 `autoVerify` 的 HTTPS intent filter。

当前页面默认不包含统计脚本、Cookie 或身份参数。若以后加入传播漏斗，必须先更新隐私说明，并坚持只记录匿名事件。
