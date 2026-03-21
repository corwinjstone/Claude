import { useState } from "react";

export function useSearchTab(defaultTab = "flights") {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = ["flights", "hotels", "packages", "cars"];
  return { activeTab, setActiveTab, tabs };
}
