import { getFilesOfTypeFromList } from "../../lib";

describe('getFilesOfTypeFromList', () => {
    it('should return empty array if no files of that type in list', () => {
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const file2 = new File(['there'], 'there.png', { type: 'image/png' });    
        const fileList = [file, file2];
        const fileType = 'json';
        const expected = [];

        const result = getFilesOfTypeFromList(fileType, fileList);

        expect(result).toEqual(expected);
    });

    it('should return files of that type', () => {
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const file2 = new File(['blah'], 'blah.json', { type: 'application/json' });    
        const file3 = new File(['there'], 'there.png', { type: 'image/png' });    
        const file4 = new File(['blah1'], 'blah1.json', { type: 'application/json' });    
        const fileList = [file, file2, file3, file4];
        const fileType = 'json';
        const expected = [file2, file3];

        const result = getFilesOfTypeFromList(fileType, fileList);

        expect(result).toEqual(expected);
    });
});