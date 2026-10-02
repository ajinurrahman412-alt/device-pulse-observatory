import { useState } from "react";
import ownerReference from "@/assets/ajinur-owner-reference.png";
import userReference from "@/assets/ajinur-user-reference.png";

type DashboardMode = "owner" | "user";

export function ReferenceDashboard() {
  const [mode, setMode] = useState<DashboardMode>("owner");
  const image = mode === "owner" ? ownerReference : userReference;

  return (
    <div className="relative min-h-screen w-full overflow-x-auto bg-background">
      <div className="relative mx-auto min-w-[320px] w-full max-w-[1536px]">
        <img
          src={image}
          alt={`${mode === "owner" ? "Owner" : "User"} AJINUR2.0 dashboard reference`}
          width={1536}
          height={1024}
          className="block h-auto w-full select-none"
          draggable={false}
          fetchPriority="high"
        />

        <button
          type="button"
          aria-label="Show Owner Dashboard"
          title="Owner Dashboard"
          onClick={() => setMode("owner")}
          className="absolute left-[14%] top-[0.4%] h-[8%] w-[18%] cursor-pointer bg-transparent"
        />
        <button
          type="button"
          aria-label="Show User Dashboard"
          title="User Dashboard"
          onClick={() => setMode("user")}
          className="absolute left-[61%] top-[0.4%] h-[8%] w-[10%] cursor-pointer bg-transparent"
        />
      </div>
    </div>
  );
}