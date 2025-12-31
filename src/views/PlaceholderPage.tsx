import { Card } from '../components/ui/Card';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <Card className="text-center py-12">
      <h2 className="text-h1 text-text-primary mb-2">{title}</h2>
      <p className="text-body text-text-secondary">This page will be configured later</p>
    </Card>
  );
};
