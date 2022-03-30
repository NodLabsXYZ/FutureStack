import FileDropzone from '../../../components/uploader/FileDropzone';
import userEvent from '@testing-library/user-event';
import { render, RenderResult } from '@testing-library/react'

describe('File Dropzone', () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const file2 = new File(['there'], 'there.png', { type: 'image/png' });
    const examplePreviewUrl = 'some/file/url';
    global.URL.createObjectURL = jest.fn(() => examplePreviewUrl);;
    let component: RenderResult = null;
    let addFilesMock = jest.fn();
    let addBytesMock = jest.fn();
    

    beforeEach(() => {
        component = render(
            <FileDropzone
                addFiles={addFilesMock}
                addBytes={addBytesMock}
            />
        );
        addFilesMock.mockClear();
        addBytesMock.mockClear();
    });

    it('should render', () => {
        expect(component).toBeTruthy()
    })

    it('should upload one file', async () => {
        const input = getFileDropzoneInputElement(component);

        await userEvent.upload(input, file);

        expect(input.files[0]).toBe(file)
        expect(input.files.item(0)).toBe(file)
        expect(input.files).toHaveLength(1)
    });

    it('should upload multiple files at the same time', async () => {
        const input = getFileDropzoneInputElement(component);

        await userEvent.upload(input, [file, file2]);

        expect(input.files[0]).toBe(file)
        expect(input.files.item(0)).toBe(file)
        expect(input.files[1]).toBe(file2)
        expect(input.files.item(1)).toBe(file2)
        expect(input.files).toHaveLength(2)
    });

    it('should call addFiles function prop on file add', async () => {
        const expectedFileWithPreview = Object.assign(file, { preview: examplePreviewUrl });
        const input = getFileDropzoneInputElement(component);

        await userEvent.upload(input, file);

        expect(addFilesMock).toBeCalledWith([expectedFileWithPreview]);
    });

    it('should call addBytes function prop on file add', async () => {
        const input = getFileDropzoneInputElement(component);

        await userEvent.upload(input, file);

        expect(addBytesMock).toBeCalledWith(file.size);
    });

    it('should call addBytes function prop on multiple file add', async () => {
        const input = getFileDropzoneInputElement(component);

        await userEvent.upload(input, [file, file2]);

        const expectedBytes = file.size + file2.size;;
        expect(addBytesMock).toBeCalledWith(expectedBytes);
    });

});

function getFileDropzoneInputElement(component: RenderResult): HTMLInputElement {
    return component.getByTestId(/fileDropzoneInput/i) as HTMLInputElement;
}
