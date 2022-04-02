import { getTotalSizeInBytesFromFileList } from "../../lib";

describe('getTotalSizeInBytesFromFileList', () => {
    it('should return 0 if list is empty', () => {
        const files = [];
        const expectedBytes = 0;

        const result = getTotalSizeInBytesFromFileList(files);

        expect(result).toBe(expectedBytes);
    });

    it('should return 0 if list is empty', () => {
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const file2 = new File(['blah'], 'blah.json', { type: 'application/json' });
        const file3 = new File(['there'], 'there.png', { type: 'image/png' });
        const file4 = new File(['blah1'], 'blah1.json', { type: 'application/json' });

        const files = [file, file2, file3, file4];
        const expectedBytes = file.size + file2.size + file3.size + file4.size;

        const result = getTotalSizeInBytesFromFileList(files);

        expect(result).toBe(expectedBytes);
    });
});
