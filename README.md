# traQing

![](./apps/client/public/og.png)

## 使いかた

- `client.Dockerfile` と `server.Dockerfile` があるのでそれぞれビルドする
  - `docker-compose.yaml` を使っても良い
- 起動するときにサーバー側に次の環境変数を指定する
  - `TRAQ_AUTH_CLIENT_ID` traQ の認証に使う OAuth Client の ClientID
    - 読み取り / 書きこみ の権限が必要で、リダイレクト先は `/api/auth/callback` のフルパス (ドメイン名とかも含めたパス) にする
  - `TRAQ_TOKEN` 適当な Bot の Access Token
    - バックグラウンドでのメッセージの取得に使う
  - `DATABASE_URL` データベースに接続するためのURL
    - PostgreSQL です

## APIドキュメント

TODO: 後で整備する

`apps/server/src/index.ts` に本質的な実装はまとまっているので、そこを見るとわかります。
