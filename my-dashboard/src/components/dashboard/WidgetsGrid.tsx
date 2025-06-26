"use client";

import { IoCarOutline } from "react-icons/io5";
import { SimpleWidget } from "./SimpleWidget";
import { useAppSelector } from "@/store";

export const WidgetsGrid = () => {
  const inCart = useAppSelector((state) => state.counter.count);

  return (
    <div className="flex flex-wrap p-2 items-center">
      <SimpleWidget
        title={`${inCart}`}
        subtitle="Productos Agregados"
        label="Contador"
        icon={<IoCarOutline size={70} className="text-blue-600" />}
        href="/dashboard/counter"
      />
    </div>
  );
};
