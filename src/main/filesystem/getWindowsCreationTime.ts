import fs from 'fs';
import { execSync } from 'child_process';

/**
 * @warning This function provides best interoperability at the cost of performance. Use only when other methods fail.
 */
function getWindowsCreationTime(linuxPath: string): Date | null {
    try {
        // 1. Convert the WSL path (/mnt/c/...) to a Windows path (C:\...)
        const winPath = execSync(`wslpath -w "${linuxPath}"`).toString().trim();

        // 2. Build a PowerShell command to get the CreationTime in ISO 8601 format
        // -NoProfile speeds up the execution by skipping PowerShell profile loading
        // -LiteralPath ensures filenames with special characters (like brackets) don't break the command
        const psCommand = `powershell.exe -NoProfile -Command "(Get-Item -LiteralPath '${winPath}').CreationTime.ToString('o')"`;

        // 3. Execute and parse the result
        const creationTimeStr = execSync(psCommand).toString().trim();

        // Convert the ISO string back into a native JavaScript Date object
        return new Date(creationTimeStr);
        // Note: catch requires an identifier for the error but we are just suppressing it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
        return null;
    }
}

function getReliableBirthTime(stats: fs.Stats, path: string): Date {
    let { birthtime } = stats;
    if (birthtime.getTime() === 0) {
        // If birthtime is not available, try to get it from Windows (much slower!)
        const winBirthtime = getWindowsCreationTime(path);
        if (winBirthtime) {
            birthtime = winBirthtime;
        }
    }
    return birthtime;
}

export { getWindowsCreationTime, getReliableBirthTime };
