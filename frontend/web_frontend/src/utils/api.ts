const appName = 'cop4331-g11.online'

export function buildPath(route: string): string {
  if (process.env.NODE_ENV != 'development') 
    {
        return 'http://' + appName + '/api/' + route;
    }
    else
    {        
        return 'http://localhost:5000/api/' + route;
    }
}
