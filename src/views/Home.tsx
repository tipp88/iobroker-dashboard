import { GRAFANA_DASHBOARDS } from '../config/grafana.config';

export const Home = () => {
  const homeOverviewDashboard = GRAFANA_DASHBOARDS[0];

  return (
    <div className="h-[calc(100vh-6rem)] rounded-lg overflow-hidden">
      <iframe
        src={homeOverviewDashboard.url}
        width="100%"
        height="100%"
        className="border-0"
        title={homeOverviewDashboard.name}
      />
    </div>
  );
};
