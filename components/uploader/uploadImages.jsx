import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { formatBytes } from '../../utils/formatters';
import Image from 'next/image'

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
              <Image 
                src={file.preview} 
                alt="" 
                className="object-cover pointer-events-none" 
                layout="fill"
              />
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{file.name}</p>
            <p className="block text-sm font-medium text-gray-500 pointer-events-none">{formatBytes(file.size)}</p>
          </li>
        ))}
      </ul>
    );

    if (this.state.isDropComplete) {
      return (
        <aside>
          <h4 className='text-xl'>Images</h4>
          <br />
          <ul>{files}</ul>
        </aside>

      )
    } else {
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
                  Drag and drop or click to select image folder
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
}
