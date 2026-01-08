import Icon from '@mdi/react';
import { Card } from '../components/ui/Card';
import { useUserConfigStore } from '../store/userConfigStore';
import { LINK_ICON_MAP } from '../config/links.config';

const formatUrl = (url: string) => url.replace(/^https?:\/\//i, '');

const normalizeUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return `http://${value}`;
};

export const Links = () => {
  const { userLinks } = useUserConfigStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h1 text-text-primary font-bold">Links</h2>
          <p className="text-text-secondary">Quick access to your smart home services.</p>
        </div>
        <span className="text-sm text-text-secondary">{userLinks.length} links</span>
      </div>

      {userLinks.length === 0 ? (
        <Card className="text-center py-12">
          <h3 className="text-h2 text-text-primary mb-2">No links yet</h3>
          <p className="text-body text-text-secondary">
            Add your internal URLs in the Settings menu.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userLinks.map((link) => {
            const icon = LINK_ICON_MAP[link.iconKey] || LINK_ICON_MAP.link;
            const href = normalizeUrl(link.url);

            return (
              <a
                key={link.id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <Card className="h-full transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-400/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-surface2 flex items-center justify-center text-cyan-200 group-hover:text-cyan-100 transition-colors">
                      <Icon path={icon.path} size={1.1} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-body font-semibold text-text-primary truncate">
                        {link.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {formatUrl(link.url)}
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
