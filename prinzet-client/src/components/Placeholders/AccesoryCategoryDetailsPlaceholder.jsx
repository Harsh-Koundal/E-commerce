const AccessoryCategoryDetailsPlaceholder = () => {
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-[10vh] px-4">
      <div className="w-full max-w-7xl space-y-8">
        {/* breadcrumb placeholder */}
        <div className="bg-gray-200 animate-pulse h-5 w-[45vw] md:w-[25vw] lg:w-[15vw]" />
        {/* category header placeholder */}
        <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col lg:flex-row justify-between gap-6 lg:h-[350px]">
          <div className="h-[200px] w-full lg:h-full lg:w-[35%] rounded-lg bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-[45%] bg-gray-200" />
            <div className="h-5 w-[90%] bg-gray-200 animate-pulse mt-4" />
            <div className="h-4 w-[50%] bg-gray-200 animate-pulse mt-10" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-2 w-[90%] bg-gray-200 animate-pulse ml-5" />
            <div className="h-4 w-[90%] bg-gray-200 animate-pulse mt-10" />
          </div>
        </div>

        {/* fake category card placeholders */}
        <div className="bg-gray-200 animate-pulse h-10 w-[35vw] mt-15" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-[350px] bg-white rounded-lg shadow-lg"
            >
              <div className="h-[60%] w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-5 w-[45%] bg-gray-200 mt-4" />
                <div className="h-3 w-[90%] bg-gray-200 animate-pulse mt-4" />
                <div className="flex items-center gap-2 mt-4 justify-center">
                  <div className="h-8 rounded-full w-[40%] bg-gray-200" />
                  <div className="h-8 rounded-full w-[40%] bg-gray-200" />
                  <div className="h-8 rounded-full w-[15%] bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* bulk ordering card placeholder */}
        <div className="bg-blue-100 rounded-lg flex flex-col items-center shadow-lg space-y-4 p-4">
          <div className="h-8 w-[45%] bg-white" />
          <div className="h-5 w-[40%] bg-white animate-pulse" />
          <div className="h-4 w-[53%] bg-white animate-pulse mt-4" />
          <div className="h-2 w-[20%] bg-white animate-pulse" />
          <div className="h-2 w-[20%] bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default AccessoryCategoryDetailsPlaceholder;