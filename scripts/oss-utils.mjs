// OSS (Alibaba Cloud Object Storage Service) utility module.
// Shared by server.mjs, generate-minimax-audio.mjs, upload-audio-to-oss.mjs, and build-app-dist.mjs.
//
// Requires these env vars:
//   OSS_ENABLED=true
//   OSS_REGION=oss-cn-xxx
//   OSS_ACCESS_KEY_ID=your-key
//   OSS_ACCESS_KEY_SECRET=your-secret
//   OSS_BUCKET=your-bucket
//   OSS_BASE_URL=https://{bucket}.oss-{region}.aliyuncs.com

let _client = null;
let _config = null;
let _aliOss = null;

/**
 * Lazy-load the ali-oss SDK (only when OSS is actually enabled).
 */
async function _loadAliOss() {
  if (!_aliOss) {
    _aliOss = await import("ali-oss");
  }
  return _aliOss;
}

/**
 * Whether OSS is enabled via environment variable.
 */
export function isOSSEnabled() {
  return process.env.OSS_ENABLED === "true";
}

/**
 * Get OSS configuration from environment variables.
 */
export function getOSSConfig() {
  if (!_config) {
    _config = {
      region: process.env.OSS_REGION || "",
      accessKeyId: process.env.OSS_ACCESS_KEY_ID || "",
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || "",
      bucket: process.env.OSS_BUCKET || "",
      baseUrl: process.env.OSS_BASE_URL || ""
    };
  }
  return _config;
}

/**
 * Get (or create) a shared OSS client instance.
 * Returns null if OSS is not enabled.
 */
export async function getOSSClient() {
  if (!isOSSEnabled()) return null;
  if (_client) return _client;
  const OSS = await _loadAliOss();
  const cfg = getOSSConfig();
  _client = new OSS.default({
    region: cfg.region,
    accessKeyId: cfg.accessKeyId,
    accessKeySecret: cfg.accessKeySecret,
    bucket: cfg.bucket
  });
  return _client;
}

/**
 * Construct the public OSS URL for a relative path.
 * Example: ossUrl('audio/lesson27/words/w1.mp3') -> 'https://bucket.oss-cn-xxx.aliyuncs.com/audio/lesson27/words/w1.mp3'
 */
export function ossUrl(relativePath) {
  const cfg = getOSSConfig();
  const base = cfg.baseUrl.replace(/\/+$/, "");
  const path = relativePath.replace(/^\/+/, "");
  return `${base}/${path}`;
}

/**
 * Upload a buffer to OSS.
 * @param {string} ossKey - the OSS object key (e.g. 'audio/lesson27/words/w1.mp3')
 * @param {Buffer} buffer - the file content
 */
export async function uploadToOSS(ossKey, buffer) {
  const client = await getOSSClient();
  if (!client) throw new Error("OSS is not enabled");
  const result = await client.put(ossKey, buffer, {
    mime: "audio/mpeg",
    headers: { "Cache-Control": "public, max-age=31536000, immutable" }
  });
  return result;
}

/**
 * Check whether a file exists on OSS.
 * @param {string} ossKey - the OSS object key
 * @returns {Promise<boolean>}
 */
export async function ossFileExists(ossKey) {
  const client = await getOSSClient();
  if (!client) return false;
  try {
    await client.head(ossKey);
    return true;
  } catch (e) {
    if (e.code === "NoSuchKey" || e.status === 404) return false;
    throw e;
  }
}
