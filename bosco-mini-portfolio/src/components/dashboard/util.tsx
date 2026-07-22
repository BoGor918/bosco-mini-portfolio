export const normalizeImageSource = (logoSource: string) => {
    const source = logoSource.trim();

    if (!source) {
        return '';
    }

    if (
        source.startsWith('data:') ||
        source.startsWith('http://') ||
        source.startsWith('https://') ||
        source.startsWith('blob:') ||
        source.startsWith('/')
    ) {
        return source;
    }

    if (/^image\/[a-zA-Z0-9.+-]+;base64,/.test(source)) {
        return `data:${source}`;
    }

    if (source.startsWith('base64,')) {
        return `data:image/png;${source}`;
    }

    return `data:image/png;base64,${source}`;
};

export const convertFileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== 'string') {
                reject(new Error('Failed to read file'));
                return;
            }

            const [, base64Content] = result.split(',');

            if (!base64Content) {
                reject(new Error('Invalid base64 file content'));
                return;
            }

            resolve(base64Content);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

export const generateId = (dataName: string) => {
    const today = new Date();
    const id = `${dataName.replace(/\s+/g, '-')}-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

    return id;
};

export const toDateOrNull = (value: Date | string | null): Date | null => {
    if (value instanceof Date) {
        return value;
    }

    if (!value) {
        return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};