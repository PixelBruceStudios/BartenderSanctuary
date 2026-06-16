import type { NextApiRequest, NextApiResponse } from 'next';

export function withAsyncSafety(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse<any>>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('[api] unhandled error:', error);
      if (res.headersSent) {
        console.error('[api] headers already sent — error not reported to client');
        return;
      }
      const status = res.statusCode >= 400 ? res.statusCode : 500;
      res.status(status).json({
        error: 'Server error',
        detail: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      });
    }
  };
}
