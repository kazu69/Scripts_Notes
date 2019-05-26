import cookie from 'cookie';
import crypto from 'crypto';
import fs from 'fs';
import { OutgoingHttpHeaders } from 'http';
import http2, { Http2ServerRequest, Http2ServerResponse, ServerHttp2Stream } from 'http2';
import mime from 'mime-types';
import path from 'path';

interface IFilesProps {
  fileDescriptor: number,
  headers: OutgoingHttpHeaders,
}

interface IClients {
  [clientId: string]: http2.Http2ServerResponse;
}

const { HTTP2_HEADER_PATH }: { HTTP2_HEADER_PATH: string } = http2.constants;
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const PUBLIC_PATH: string = path.join(__dirname, '../public');
const HOST_NAME: string = '0.0.0.0';

const publicFileMap: Map<string, IFilesProps> = createFileMap(PUBLIC_PATH);
const clients: IClients = {};

function createFileMap(baseDir: string): Map<string, IFilesProps> {
  const files: Map<string, IFilesProps> = new Map();
  fs.readdirSync(baseDir).forEach(fileName => {
    const filePath: string = path.join(baseDir, fileName);
    const fileDescriptor: number = fs.openSync(filePath, 'r');
    const stat: fs.Stats = fs.fstatSync(fileDescriptor);
    const contentType: string = mime.lookup(filePath) || '';
    const headers: OutgoingHttpHeaders = {
      'content-length': stat.size,
      'content-type': contentType,
    };
    const filesProps: IFilesProps = {
      fileDescriptor, headers
    }
    files.set(`/${fileName}`, filesProps);
  });

  return files;
}

function push(stream: ServerHttp2Stream, responsePath: string): void {
  const file = publicFileMap.get(responsePath);
  if (!file) {
    return
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: responsePath }, (error, pushStream) => {
    if (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    pushStream.respondWithFD(file.fileDescriptor, file.headers);
  })
}

function publish(user: string, message: string) {
  const id:string = crypto.randomBytes(16).toString('hex');
  const responseMessage: string = `
event: info
data: { "id": "${id}", "sender": "${user}", "message": "${message}" }

`;
  Object.entries(clients).forEach(([_, response]) => response.write(responseMessage, 'utf8'));
}

function addUser(user: string) {
  const responseMessage: string = `
event: oper
data: {"oper":"add","user":"${user}"}

`;
  Object.entries(clients).forEach(([_, res]) => res.write(responseMessage, 'utf8'));
}

function removeUser(user: string) {
  const responseMessage: string = `
event: oper
data: {"oper":"del", "user":"${user}"}

`;
  Object.entries(clients).forEach(([_, res]) => res.write(responseMessage, 'utf8'));
}

function isHttpMethod(method: string, headers: http2.IncomingHttpHeaders): boolean {
  return method === headers[':method'];
}

function isRequestPath(incomingPath: string, headers: http2.IncomingHttpHeaders): boolean {
  const requestPath = !headers[':path'] ? '' : headers[':path'] === '/' ? '/index.html' : headers[':path'];
  return incomingPath === requestPath;
}

function onRequestHandler(request: Http2ServerRequest, response: Http2ServerResponse) {
  const requestPath = !request.headers[':path'] ? '' : request.headers[':path'] === '/' ? '/index.html' : request.headers[':path'] ;
  const file = publicFileMap.get(requestPath);

  if (isHttpMethod('GET', request.headers) && requestPath === '/users') {
    response.stream.respond({ 'content-type': 'text/html', ':status': 200 });
    response.stream.end(JSON.stringify({ userList: Object.keys(clients) }));
    return;
  }

  if (isHttpMethod('POST', request.headers) && requestPath === '/message') {
    if (request.headers && request.headers.cookie) {
      const cookies = cookie.parse(request.headers.cookie);
      if (!cookies.user) {
        response.stream.respond({ 'content-type': 'text/html', ':status': 401 });
        response.stream.end();
        return;
      }

      let jsonString = '';
      request.on('data', (data) => {
        jsonString += data;
      });
      request.on('end', () => {
        const json = JSON.parse(jsonString);
        publish(cookies.user, json.msg);
      });
    }

    response.stream.respond({ 'content-type': 'text/html', ':status': 204 });
    response.stream.end();
    return;
  }

  if (isRequestPath('/register', request.headers)) {
    if (request.headers && request.headers.cookie) {
      const cookies = cookie.parse(request.headers.cookie);

      request.socket.setTimeout(2000);
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-type': 'text/event-stream',
        'access-control-allow-origin': HOST_NAME,
      });

      clients[cookies.user] = response;
      addUser(cookies.user);
      request.on('close', () => {
        delete clients[cookies.user];
        removeUser(cookies.user);
      });  
      return;
    }

    response.stream.respond({ 'content-type': 'text/html', ':status': 204 });
    response.stream.end();
    return;
  }

  if (requestPath === '/index.html') {
    push(response.stream, '/style.css');
    push(response.stream, '/script.js');
  }

  if (!file) {
    response.stream.respond({ 'content-type': 'text/html', ':status': 404 });
    response.stream.end('<h1>Page Not Found</h1>');
    return
  }

  response.stream.respondWithFD(file.fileDescriptor, file.headers);
  // tslint:disable-next-line:no-console
  request.on('finish', () => console.log('connection closed'));
}

const server: any = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, '../ssl/server.cert')),
  key: fs.readFileSync(path.join(__dirname, '../ssl/server.key'))
}, onRequestHandler);

server.listen(PORT, HOST_NAME, (error: Error) => {
  if (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    return;
  }
  // tslint:disable-next-line:no-console
  console.log(`Server listening on open https://${HOST_NAME}:${PORT}`);
});
