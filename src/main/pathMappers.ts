const pathMappers = {
  ident(path: string): string {
    return path;
  },
  win2wsl(path: string): string {
    // return execSync(`wslpath -u "${path}"`).toString().trim();
    const slashes = path.replaceAll("\\", "/");
    const driveLetterRegExp = /^([a-zA-Z]):/;
    const driveLetterMatches = driveLetterRegExp.exec(slashes);
    if (driveLetterMatches) {
      const driveLetter = driveLetterMatches[1].toLowerCase();
      return `/mnt/${driveLetter}${slashes.slice(2)}`;
    }
    return slashes;
  },
};

type PathMapperKey = keyof typeof pathMappers;
type PathMapper = (path: string) => string;

export { pathMappers, type PathMapperKey, type PathMapper };
