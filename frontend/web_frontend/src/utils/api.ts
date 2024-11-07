const processEnv = /*process.env.NODE_ENV || */'development';
const appName = /*process.env.REACT_APP_APP_NAME ||*/ 'localhost';

export function buildPath(route: string): string {
  const protocol = processEnv !== 'development' ? 'https' : 'http';
  const host = processEnv !== 'development' ? `${appName}` : 'localhost:5000';
  return `${protocol}://${host}/api/${route}`;
}
