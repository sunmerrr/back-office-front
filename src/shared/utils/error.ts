/**
 * ky HTTPError에서 백엔드 에러 메시지를 추출합니다.
 * NestJS 응답: { statusCode, message (string | string[]), error? }
 */
export async function extractApiError(err: unknown, fallback: string): Promise<string> {
  try {
    const body = await (err as any).response?.json()
    const msg = Array.isArray(body?.message) ? body.message[0] : body?.message
    if (msg) return msg
  } catch {
    // response 파싱 실패 시 fallback
  }
  return (err as any)?.message || fallback
}
