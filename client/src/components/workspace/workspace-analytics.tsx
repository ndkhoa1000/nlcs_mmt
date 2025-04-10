import AnalyticsCard from "./common/analytics-card";

const WorkspaceAnalytics = () => {
  const workspaceList = [
    {
      id: "total-task",
      title: "Tổng Số Sự Kiện",
      value: 20,
    },
    {
      id: "1234",
      title: "Số Sự Kiện Trì Hoãn",
      value: 0,
    },
    {
      id: "completed-task",
      title: "Số Sự Kiện Hoàn Thành",
      value: 4,
    },
  ];

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {workspaceList?.map((v) => (
        <AnalyticsCard
          key={v.id}
          isLoading={false}
          title={v.title}
          value={v.value}
        />
      ))}
    </div>
  );
};

export default WorkspaceAnalytics;
