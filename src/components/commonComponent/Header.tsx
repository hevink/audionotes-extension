import { useGetUserPlan } from "../../queries";
import { Skeleton } from "../ui/skeleton";

const Header = ({ setUpgradePlan, isAuthentications }: any) => {
  const { data: userPlan } = useGetUserPlan() as any;  

  return (
    <div className="flex justify-between items-center px-5 py-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-5 h-5" />
        <h1 className="font-semibold text-base">
          Audionotes<span className="text-primary">.app</span>
        </h1>
      </div>

      {isAuthentications === null  ? (
        <Skeleton className="w-24 h-7 rounded-full" />
      ) : (
        <>
          {isAuthentications && ["pro", "ultra"].includes(userPlan?.plan) ? (
            <button
              onClick={() =>
                window.open("https://home.audionotes.app/account", "_blank")
              }
              className="bg-[#F8F8F8] text-foreground px-3 py-1 rounded-full font-semibold text-sm"
            >
              My Account
            </button>
          ) : (
            <button
              onClick={() => setUpgradePlan("upgradePlan")}
              className="bg-[#FFE9DF] text-primary px-3 py-1 rounded-full font-semibold text-sm"
            >
              Upgrade Plan
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
