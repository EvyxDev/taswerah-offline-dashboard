import Image from "next/image";

export default function Receipt() {
  return (
    <div className="bg-[#ffffff] min-h-screen p-8 font-mono">
      <div className="max-w-md mx-auto bg-[#ffffff] text-[#000000]">
        {/* Header */}
        <div className="text-center mb-6 flex-col flex justify-center items-center gap-4">
          <Image
            src={"/assets/logo.png"}
            alt="Logo"
            width={150}
            height={0}
            className=""
          />{" "}
          <p className="text-sm text-[#6d7278]">
            Wed, May 27, 2020 • 9:27:53 AM
          </p>
        </div>

        <div className="relative p-4 mb-6 text-center">
          <div
            className="absolute inset-0 border-2 border-dashed border-[#000000] rounded-2xl"
            style={{
              borderRadius: "10px",
              borderStyle: "dashed",
              borderWidth: "2px",
            }}
          ></div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-lg -mt-[30px] font-semibold bg-white w-fit text-center px-8">
              Token
            </p>
            <p className="text-lg font-bold tracking-wider">
              0237-7746-8981-9028-5626
            </p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-4">
          {/* Token Type and Credit */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Token Type</span>
            <span className="font-medium">Credit</span>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>

          {/* Customer Details */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Customer Code</span>
            <span className="font-medium">123456</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Customer Type</span>
            <span className="font-medium">R3</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#6d7278]">Address</span>
            <div className="text-right font-medium">
              <div>7953 Oakland St.</div>
              <div>Honolulu, HI 96815</div>
            </div>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>

          {/* Meter Number */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Meter Number</span>
            <span className="font-medium">04172997324</span>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>

          {/* Payment Details */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Amount</span>
            <span className="font-medium">950 NGN</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Tax</span>
            <span className="font-medium">50 NGN</span>
          </div>

          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span>1000 NGN</span>
          </div>

          <div className="border-t border-dotted border-[#d8d8d8] my-4"></div>

          {/* Operator */}
          <div className="flex justify-between items-center">
            <span className="text-[#6d7278]">Operator</span>
            <span className="font-medium">Ade</span>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 mb-8 text-sm text-[#6d7278] leading-relaxed">
          <p>
            Thanks for fueling our passion. Drop by again, if your wallet
            isn&apos;t still sulking. You&apos;re always welcome here!
          </p>
        </div>

        {/* Footer Logo */}
        <div className="flex items-center justify-center mt-12">
          <Image
            src={"/assets/logo.png"}
            alt="Logo"
            width={200}
            height={0}
            className=""
          />{" "}
        </div>
      </div>
    </div>
  );
}
