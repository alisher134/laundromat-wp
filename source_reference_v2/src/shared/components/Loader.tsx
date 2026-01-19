export const Loader = () => {
  return (
    <div className="border-brand h-[55px] w-[50px] rounded-[9px] border-[2.5px]">
      <div className="flex items-center justify-between p-1">
        <div className="bg-brand h-[3px] w-[20px] rounded-full"></div>

        <div className="flex items-center justify-between gap-0.5">
          <div className="bg-brand size-[5px] rounded-full"></div>
          <div className="bg-brand size-[5px] rounded-full"></div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="border-brand size-[30px] rounded-full border-4"></div>
      </div>
    </div>
  );
};
