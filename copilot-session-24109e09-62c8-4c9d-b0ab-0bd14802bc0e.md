# Copilot session transcript

## User

これまでのチャットのやり取りの履歴ってデータ残っていますか？

## Assistant

はい。Copilot CLIでは会話はセッションとして保存され、プロンプトや返答、実行したツールの履歴も記録されます。ローカルでは通常 `~/.copilot/session-state/`（`COPILOT_HOME` を設定している場合はその配下）に保存され、削除するまで保持されます。セッションデータは暗号化されていません。

## User

それって出力できますか？

## Assistant

はい。Copilot CLIで `/share file` を実行すると、現在の会話履歴をMarkdownファイルに出力できます。HTMLなら `/share html` です。既定のファイル名は `copilot-session-<セッションID>.md` または `.html` です。

## User

出力して
