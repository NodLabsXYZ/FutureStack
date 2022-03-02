import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { formatBytes } from '../../utils/formatters';

export default class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      console.log('files pre-map', files)
      files.sort(function (a, b) {
        const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
      });
      console.log('files post sort :>> ', files);
      files = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
      let totalBytes = 0;
      files.forEach(file => {
        totalBytes += file.size;
      });
      console.log('files post-map', files)
      props.setImageFiles(files);
      props.updateImageBytes(totalBytes);
      this.setState({ files, isDropComplete: true })
    };
    this.state = {
      files: [],
      isDropComplete: false
    };
  }

  render() {
    const files = (
      <ul role="list" className="grid grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-7 sm:gap-x-6 lg:grid-cols-10 xl:gap-x-8">
        {this.state.files.map((file) => (
          <li key={file.name} className="relative">
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
              <img src={file.preview} alt="" className="object-cover pointer-events-none" />
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{file.name}</p>
            <p className="block text-sm font-medium text-gray-500 pointer-events-none">{formatBytes(file.size)}</p>
          </li>
        ))}
      </ul>
    );
    return (
      <Dropzone onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
              {this.state.isDropComplete ?
                (
                  <aside>
                    <h4 className='text-xl'>Images</h4>
                    <br />
                    <ul>{files}</ul>
                  </aside>
                )
                :
                (
                  <button
                    type="button"
                    className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Drag and drop or click to select image folder
                    <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
                  </button>

                )
              }
            </div>
          </section>
        )
        }
      </Dropzone>
    );
  }
}
