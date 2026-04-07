// Vercel環境（単一インスタンス）またはローカルテスト用のインメモリDB
const memoryStore = {
  sessions: new Map() // key: sessionId (uuid), value: { expiresAt: number, files: [ { originalname, buffer, mimetype, size } ] }
};

module.exports = memoryStore;
