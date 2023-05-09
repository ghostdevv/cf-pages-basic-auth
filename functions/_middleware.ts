interface Context {
    request: Request;
    next: () => Promise<Response>;
    env: {};
}

interface User {
    username: string;
    password: string;
}

// I would recommend making this an environment variable
const users: User[] = [
    {
        username: 'ghost',
        password: 'test',
    },
];

function getUser(authorization: string) {
    const token = authorization.replace('Basic ', '');

    const [username, password] = atob(token).split(':');

    if (!username || !password || !username.length || !password.length)
        return false;

    const user = users.find(
        (u) => u.username === username && u.password === password,
    );

    if (!user) return false;

    return username;
}

export async function onRequest(context: Context): Promise<Response> {
    const authorization = context.request.headers.get('Authorization');

    if (!authorization || !authorization.startsWith('Basic '))
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Protected"',
            },
        });

    const user = getUser(authorization);

    if (!user)
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Protected"',
            },
        });

    return await context.next();
}
