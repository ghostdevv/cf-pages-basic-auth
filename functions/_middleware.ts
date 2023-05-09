interface Context {
    request: Request;
    next: () => Promise<Response>;
    env: {
        USERS: string;
    };
}

interface User {
    username: string;
    password: string;
}

function getUser(users: User[], authorization: string) {
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

    const users: User[] = JSON.parse(context.env.USERS ?? '[]');

    const user = getUser(users, authorization);

    if (!user)
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Protected"',
            },
        });

    return await context.next();
}
