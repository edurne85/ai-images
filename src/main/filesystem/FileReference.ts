type FileReference = {
    fullPath: string;
    group: string;
    basename: string;
    size: number;
    mtime: Date;
    birthtime: Date;
};

function fileReferenceToString(fileRef: FileReference, indent: string = ''): string {
    const lines = [
        `${indent}${fileRef.fullPath}`,
        `${indent}  Group: ${fileRef.group}`,
        `${indent}  Basename: ${fileRef.basename}`,
        `${indent}  Size: ${fileRef.size}`,
        `${indent}  Modified: ${fileRef.mtime.toISOString()}`,
        `${indent}  Birth: ${fileRef.birthtime.toISOString()}`,
    ];
    return lines.join('\n');
}
function oldestFileReference(fileReferences: FileReference[]): FileReference {
    if (fileReferences.length === 0) {
        throw new Error('No file references provided');
    }
    return fileReferences.reduce((oldest, current) => {
        return current.birthtime < oldest.birthtime ? current : oldest;
    });
}

function allButOldestFileReferences(fileReferences: FileReference[]): FileReference[] {
    if (fileReferences.length < 2) {
        throw new Error('At least two file references are required to find all but the oldest');
    }
    const oldest = oldestFileReference(fileReferences);
    return fileReferences.filter((ref) => ref !== oldest);
}

export {
    type FileReference,
    fileReferenceToString,
    oldestFileReference,
    allButOldestFileReferences,
};
