import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { FileListDisplay } from "./FileListDisplay";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      files = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
      let totalBytes = 0;
      files.forEach(file => {
        totalBytes += file.size;
      });
      props.addFiles(files);
      props.updateFilesBytes(totalBytes);
      this.setState({ files, isDropComplete: true })
    };
    this.state = {
      files: [],
      isDropComplete: false
    };
  }

  render() {

    if (this.state.isDropComplete) {
      return (
        <aside>
          <FileListDisplay files={this.state.files} />
        </aside>
      )
    }

    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Drag and drop or click to select files
                <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
              </button>
            </div>
          </section>
        )
        }
      </Dropzone>
    );
  }
}
