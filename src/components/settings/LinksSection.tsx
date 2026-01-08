import { useMemo, useState } from 'react';
import Icon from '@mdi/react';
import { useUserConfigStore } from '../../store/userConfigStore';
import { LINK_ICON_OPTIONS, LINK_ICON_MAP } from '../../config/links.config';
import type { LinkIconKey } from '../../types/links';
import { generateUUID } from '../../utils/uuid';

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
};

const getFaviconUrl = (value: string) => {
  try {
    const normalized = normalizeUrl(value);
    const url = new URL(normalized);
    return `${url.origin}/favicon.ico`;
  } catch {
    return '';
  }
};

const LinkPreviewIcon = ({
  url,
  fallbackIconPath,
}: {
  url: string;
  fallbackIconPath: string;
}) => {
  const [failed, setFailed] = useState(false);
  const faviconUrl = getFaviconUrl(url);

  if (!faviconUrl || failed) {
    return <Icon path={fallbackIconPath} size={0.9} />;
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className="w-5 h-5 object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

export const LinksSection = () => {
  const { userLinks, addLink, updateLink, removeLink } = useUserConfigStore();
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIconKey, setNewIconKey] = useState<LinkIconKey>('link');

  const iconOptions = useMemo(() => LINK_ICON_OPTIONS, []);

  const handleAdd = () => {
    const name = newName.trim();
    const url = normalizeUrl(newUrl);

    if (!name || !url) {
      return;
    }

    addLink({
      id: generateUUID(),
      name,
      url,
      iconKey: newIconKey,
    });

    setNewName('');
    setNewUrl('');
    setNewIconKey('link');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h2 text-text-primary font-bold">Links</h3>
        <span className="text-sm text-text-secondary">{userLinks.length} saved</span>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.2fr_2fr_1fr_auto]">
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Label"
          className="px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <input
          value={newUrl}
          onChange={(event) => setNewUrl(event.target.value)}
          placeholder="http://192.168.1.100"
          className="px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <select
          value={newIconKey}
          onChange={(event) => setNewIconKey(event.target.value as LinkIconKey)}
          className="px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        >
          {iconOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
        >
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {userLinks.length === 0 ? (
          <div className="text-center py-10 bg-neutral-surface2 rounded-lg border border-stroke-subtle">
            <p className="text-text-secondary">No links saved yet.</p>
          </div>
        ) : (
          userLinks.map((link) => (
            <div
              key={link.id}
              className="grid gap-3 items-center md:grid-cols-[auto_1.2fr_2fr_1fr_auto] bg-neutral-surface2 border border-stroke-default rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-surface3 flex items-center justify-center">
                <LinkPreviewIcon url={link.url} fallbackIconPath={LINK_ICON_MAP[link.iconKey].path} />
              </div>
              <input
                value={link.name}
                onChange={(event) => updateLink(link.id, { name: event.target.value })}
                className="px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
              <input
                value={link.url}
                onChange={(event) => updateLink(link.id, { url: event.target.value })}
                className="px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              />
              <select
                value={link.iconKey}
                onChange={(event) => updateLink(link.id, { iconKey: event.target.value as LinkIconKey })}
                className="px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              >
                {iconOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeLink(link.id)}
                className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
