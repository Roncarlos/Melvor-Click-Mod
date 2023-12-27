export const FanaticClickerSettingsManager = {
  getSetting({ section = "Fanatic Clicker", name }) {
    return mod
      .getContext(import.meta)
      .settings.section(section)
      .get(name);
  },
  getResourceUrl(path) {
    return mod.getContext(import.meta).getResourceUrl(path);
  },
};
