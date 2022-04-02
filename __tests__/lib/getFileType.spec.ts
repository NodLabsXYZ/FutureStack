import { getFileType } from "../../lib";

describe('getFileType', () => {
    it('should return correct file type', () => {
        const fileName = 'test.json';
        const expectedFileType = 'json';

        const result = getFileType(fileName);

        expect(result).toBe(expectedFileType);
    });
});