const Header = ({ setUpgradePlan }: any) => {
  return (
    <div className="flex justify-between items-center mb-4 px-4 pt-2">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-1 rounded-lg">
          <img src="/logo.png" alt="logo" className="w-5 h-5" />
        </div>
        <h1 className="text-sm font-semibold">
          Audionotes<span className="text-primary">.app</span>
        </h1>
      </div>
      <button
        onClick={() => setUpgradePlan("upgradePlan")}
        className="bg-[#FFE9DF] text-primary px-3 py-1 rounded-full font-semibold text-sm"
      >
        Upgrade Plan
      </button>
    </div>
  );
};

export default Header;
