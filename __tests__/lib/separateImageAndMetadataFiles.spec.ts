import { separateImageAndMetadataFiles } from "../../lib";
import { FileWithPreview } from "../../types/FileWithPreview";
import { SeparateImageAndMetadataFilesResult } from "../../types/SeparateImageAndMetadataFilesResult";

describe('separateImageAndMetadataFiles', () => {
    it('should return an empty list if it gets an empty list', () => {
        const files = [];
        const expected: SeparateImageAndMetadataFilesResult = {
            imageFiles: [],
            metadataFiles: []
        }

        const result = separateImageAndMetadataFiles(files);

        expect(result).toEqual(expected);
    });

    it('should separate images and metadata files', () => {
        const file = createTestFileWithPreview(new File(['1'], '1.png', { type: 'image/png' }));
        const file2 = createTestFileWithPreview(new File(['1'], '1.json', { type: 'application/json' }));
        const file3 = createTestFileWithPreview(new File(['2'], '2.png', { type: 'image/png' }));
        const file4 = createTestFileWithPreview(new File(['2'], '2.json', { type: 'application/json' }));
        const files = [file, file2, file3, file4];
        const expected: SeparateImageAndMetadataFilesResult = {
            imageFiles: [file, file3],
            metadataFiles: [file2, file4]
        }

        const result = separateImageAndMetadataFiles(files);

        expect(result).toEqual(expected);
    });
});

const createTestFileWithPreview = (file: File): FileWithPreview => {
    return Object.assign(file, { preview: 'http://' + file.name });
}