import { fileHasVisualPreview } from "../../lib";

describe('fileHasVisualPreview', () => {
    const fileTypesWithVisualPreview = [
        'apng',
        'avif',
        'gif',
        'jpg',
        'jpeg',
        'jfif',
        'pjpeg',
        'pjp',
        'svg',
        'webp',
        'ico',
        'cur',
        'tif',
        'tiff',
    ];

    const someFileTypesWithoutVisualPreview = [
        'json',
        'docx',
        'txt',
    ]

    it('should return true if an image or gif', () => {
        for (let index = 0; index < fileTypesWithVisualPreview.length; index++) {
            const fileType = fileTypesWithVisualPreview[index];
            const fileName = 'test.' + fileType;
            
            expect(fileHasVisualPreview(fileName)).toBe(true);
        }
    });

    it('should return false if NOT an image or gif', () => {

        for (let index = 0; index < someFileTypesWithoutVisualPreview.length; index++) {
            const fileType = someFileTypesWithoutVisualPreview[index];
            const fileName = 'test.' + fileType;
            
            expect(fileHasVisualPreview(fileName)).toBe(false);
        }
    });
});