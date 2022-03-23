import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { formatBytes } from '../../utils/formatters';

export default class UploadMetadata extends Component {
  constructor(props) {
    super(props);
    this.onDrop = (files) => {
      files = files.filter(file => file.name !== '.DS_Store');
      files.sort(function (a, b) {
        const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) //sort string ascending
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; //default return value (no sorting)
      });
      console.log('metadata files post-sort :>> ', files);
      let totalBytes = 0;
      files.forEach(file => {
        totalBytes += file.size;
      });
      props.setMetadataFiles(files);
      props.updateMetadataBytes(totalBytes);
      this.setState({ files, isDropComplete: true })
    };
    this.state = {
      files: [],
      isDropComplete: false
    };
  }

  render() {
    const files = (

      <>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Size
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.files.slice(0, 12).map((file, fileIdx) => (
                      <tr key={file.name} className={fileIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatBytes(file.size)}
                        </td>
                      </tr>
                    ))}
                    {this.state.files.length > 12 && (
                      <tr className="">
                        <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Plus {this.state.files.length - 12} more files...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    if (this.state.isDropComplete) {
      return (
        <aside className='w-full'>
          <h4 className='text-xl'>Metadata</h4>
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
                  Drag and drop or click to select metadata JSON folder
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
