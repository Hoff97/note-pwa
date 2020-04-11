export function previousLine(str: string, position: number): string | undefined {
    const lines = str.split('\n');
    let i = 0;
    while(position > lines[i].length) {
        position -= lines[i].length;
        position -= 1;
        i += 1;
    }
    if (i > 0) {
        return lines[i-1];
    }
    return undefined;
}

export function currentLine(str: string, position: number): string | undefined {
    const lines = str.split('\n');
    let i = 0;
    while(position > lines[i].length) {
        position -= lines[i].length;
        position -= 1;
        i += 1;
    }
    if (i < lines.length) {
        return lines[i];
    }
    return undefined;
}

export function lineStart(str: string, position: number): number {
    const lines = str.split('\n');
    let i = 0;
    let start = 0;
    while(position > lines[i].length) {
        position -= lines[i].length;
        position -= 1;
        start += lines[i].length + 1;
        i += 1;
    }
    return start;
}

export const listRegExp = /^([\s>]*)(([-*]|(([0-9]+)\.))\s(\[[ x]\])?)?/;