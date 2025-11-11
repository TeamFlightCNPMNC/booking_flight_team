export function InstructionSheet({ content }) {
  return (
    <>
      <div className="relative">
        <div className="flex items-center w-fit">
          <div className="cursor-pointer icon-hover-trigger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#0194F3"
              className="size-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>
          <div
            className={`absolute font-semibold overflow-hidden left-[50px] z-10 w-0 text-sm text-white bg-gray-700 rounded transition-opacity duration-300 opacity-0 hover-note`}>
            <p>{content}</p>

            <div className="absolute top-[10px] z-50 w-0 h-0 border-t-8 border-l-8 border-r-8 -left-[10px] border-l-transparent border-r-transparent border-t-gray-700 rotate-90"></div>
          </div>
        </div>
      </div>
      <style jsx="true">{`
        .icon-hover-trigger:hover + .hover-note {
          opacity: 1;
          width: fit-content;
          padding: 3px;
          overflow: auto;
        }
      `}</style>
    </>
  );
}
