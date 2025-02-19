"use client";

import cn from "@core/utils/class-names";
import TicketIcon from "@core/components/icons/ticket";
import TagIcon from "@core/components/icons/tag";
import MetricCard from "@core/components/cards/metric-card";
import TagIcon2 from "@core/components/icons/tag-2";
import TagIcon3 from "@core/components/icons/tag-3";
import { useTranslations } from "next-intl";

const ticketStats = [
  {
    id: 1,
    icon: <TicketIcon className="h-full w-full" />,
    title: "text-total-number-of-tickets",
    metric: "12,450",
  },
  {
    id: 2,
    icon: <TagIcon className="h-full w-full" />,
    title: "text-unassigned-tickets",
    metric: "3,590",
  },
  {
    id: 3,
    icon: <TagIcon2 className="h-full w-full" />,
    title: "text-open-tickets",
    metric: "7,890",
  },
  {
    id: 3,
    icon: <TagIcon3 className="h-full w-full" />,
    title: "text-solved-tickets",
    metric: "1,160",
  },
];

export default function StatCards({ className }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <div className={cn("grid grid-cols-1 gap-5 3xl:gap-8 4xl:gap-9", className)}>
      {ticketStats.map((stat) => (
        <MetricCard
          key={stat.title + stat.id}
          title={t(stat.title)}
          metric={stat.metric}
          icon={stat.icon}
          iconClassName="bg-transparent w-11 h-11"
        />
      ))}
    </div>
  );
}
