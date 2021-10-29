import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(function ProtectedRoute(req, res) {
    const session = getSession(req, res);

    res.status(200).json({ echoId: session?.user.sub });
});