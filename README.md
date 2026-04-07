# Web版 Wi-Fi File Transfer

インストール不要でブラウザから直接利用できるファイル転送Webアプリです。Node.js + Expressで構築されており、ローカル実行とVercel（サーバーレス）へのデプロイの双方に対応しています。

## 特徴
- アップロード後に一意の共有URLとQRコードを発行
- 個別ファイルダウンロード ＆ 一括ZIPダウンロード
- モダンでレスポンシブなダークテーマUI

## 【重要】Vercel(無料版)での制約事項
Vercelの無料枠（Serverless Functions）で動かす場合、Vercelの仕様により**アップロードファイルの上限サイズは 4.5MB** となります。大容量の動画などを転送する場合はローカルPCで `npm start` して運用するか、VercelからAWS S3 / Vercel Blobなどへストレージを分離するカスタマイズが必要になります。

また、今回はMVP（データベース不要のメモリ管理）のため、Vercel上では無アクセス時間が続くとセッションが消滅する可能性があります。

## 手順1: ローカルでの実行方法（制限なし）

Windows/Mac問わず、Node.js がインストールされたPCで以下を実行してください。ローカルであれば4.5MB制限なく大容量ファイルをやりとり可能です。

1. **パッケージのインストール**
   ```bash
   npm install
   ```

2. **サーバーの起動**
   ```bash
   npm start
   ```
   > 起動すると `http://localhost:8080` およびローカルIP（例: `http://192.168.x.x:8080`）が表示されます。スマホなど同じWi-Fi圏内の端末からそのローカルIPにアクセスしてください。

## 手順2: Vercelへのデプロイ方法

すでに `vercel.json` が配置されているため、簡単なコマンドでデプロイ可能です。

1. **Vercel CLIのインストール**（入っていない場合）
   ```bash
   npm i -g vercel
   ```

2. **Vercelへデプロイ**
   プロジェクトフォルダで以下のコマンドを実行します。
   ```bash
   vercel
   ```
   * 最初の質問にはすべてEnterか「Y」で答えてOKです。
   * Vercel上でビルドが完了すると、`https://wifi-web-transfer-xxx.vercel.app` のようなURLが発行されます。

## 機能の仕様
- **フロントエンド**: Vanilla JS と `qrcode.js` を活用したSPAライクな動作
- **バックエンド**: Node `express`, `multer` (メモリバッファ保存), `uuid`, `archiver` (ZIP生成) を使用
- **Vercel対応**: Vercelの分離制約に対応するため、`vercel.json` で `/api/*` のルーティングを一つのExpressエントリポイント（`api/index.js`）へ統合しています。
