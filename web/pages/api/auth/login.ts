import type { NextApiRequest, NextApiResponse } from 'next'

type LoginRequestBody = {
  username: string,
  password: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as LoginRequestBody;
  if (!body.username || !body.password) {
    return res.redirect("/?error=WrongAccount")
  }
  return res.redirect("/2fa")
}
