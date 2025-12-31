import { Card } from '../ui/Card';

interface GrafanaEmbedProps {
  dashboardUrl: string;
  height?: number;
  title: string;
}

export const GrafanaEmbed = ({ dashboardUrl, height = 600, title }: GrafanaEmbedProps) => {
  return (
    <Card>
      <h3 className="text-h2 text-text-primary font-semibold mb-3">{title}</h3>
      <div className="rounded-lg overflow-hidden" style={{ height: `${height}px` }}>
        <iframe
          src={dashboardUrl}
          width="100%"
          height="100%"
          className="border-0"
          title={title}
        />
      </div>
    </Card>
  );
};
