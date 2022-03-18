const FutureStackFooter = ({ darkMode=false }) => {
  return (
    <footer className="mt-36">
      <div className={`${darkMode ? 'text-white' : 'text-slate-900'} text-sm text-right px-12 pt-3 pb-9`}>
        © 2022 Copyright
        &nbsp;
        <a href="https://futurestack.xyz/">Future<span className='font-semibold'>Stack</span></a>
      </div>
    </footer>
  )
}

export default FutureStackFooter;