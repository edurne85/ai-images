const pathMappers = {
    ident(path: string): string {
        return path;
    },
    win2wsl(path: string): string {
        // return execSync(`wslpath -u "${path}"`).toString().trim();
        const slashes = path.replaceAll('\\', '/');
        const driveLetterRegExp = /^([a-zA-Z]):/;
        const driveLetterMatches = driveLetterRegExp.exec(slashes);
        if (driveLetterMatches) {
            const driveLetter = driveLetterMatches[1].toLowerCase();
            return `/mnt/${driveLetter}${slashes.slice(2)}`;
        }
        return slashes;
    },
    wsl2win(path: string): string {
        const wslPathRegExp = /^\/mnt\/([a-zA-Z])\//;
        const wslPathMatches = wslPathRegExp.exec(path);
        if (wslPathMatches) {
            const driveLetter = wslPathMatches[1].toUpperCase();
            return `${driveLetter}:${path.slice(6)}`.replaceAll('/', '\\');
        }
        return path.replaceAll('/', '\\');
    },
};

type PathMapperKey = keyof typeof pathMappers;
type PathMapper = (path: string) => string;

export { pathMappers, type PathMapperKey, type PathMapper };
