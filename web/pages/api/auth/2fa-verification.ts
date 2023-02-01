import type { NextApiRequest, NextApiResponse } from 'next'

type TwoFAVerificationRequestBody = {
  code: string,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as TwoFAVerificationRequestBody;
  if (!body.code) {
    return res.redirect("/2fa?error=InvalidCode")
  }
  return res.redirect("/settings")
}
