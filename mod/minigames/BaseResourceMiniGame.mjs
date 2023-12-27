/**
 * Represents a Mini Game.
 *
 * @param {Object} options - The options for the Mini Game.
 * @param {Object} options.gameData - The data for the game.
 * @param {Object} options.tickManager - The tick manager for the game.
 * @param {Function} options.shouldIncrementCallback - The callback function to determine if the game should increment.
 * @param {{getSetting: (setting: {section: string?, name: string}) => any}} options.settingsManager - The settings manager for the game.
 * @returns {Object} - The Mini Game object.
 */

export function BaseResourceMiniGame({
  getActionTimer = () => undefined,
  tickManager,
  shouldIncrementCallback,
  settingsManager,
  possibleItems,
  sectionName,
}) {
  const minigameObject = {
    debug: typeof mod === "undefined",
    tickTimer: null,
    $template: `#${sectionName}-minigame`,
    width:
      settingsManager?.getSetting({ section: sectionName, name: "size" }) ??
      400,
    height:
      settingsManager?.getSetting({ section: sectionName, name: "size" }) ??
      400,
    weakSpot: null,
    selectedItem: {
      image: "https://cdn2-main.melvor.net/" + Object.keys(possibleItems).at(0),
      collisions: Object.values(possibleItems).at(0).collisions,
    },
    tap(numberOfTicks) {
      const activeActionTimer = getActionTimer();
      if (activeActionTimer === undefined) {
        return;
      }

      if (shouldIncrementCallback != null && !shouldIncrementCallback()) {
        return;
      }

      // Should be more than 1 and less than 100
      const ticksPerClick = Math.max(Math.min(numberOfTicks, 100), 1);

      activeActionTimer._ticksLeft = Math.max(
        activeActionTimer._ticksLeft - ticksPerClick,
        0
      );
    },
    defaultTap() {
      const ticksPerClickSetting =
        settingsManager?.getSetting({
          name: "tick-per-click",
        }) ?? 5;
      this.tap(ticksPerClickSetting);
      this.createWeakSpot();
    },
    onTick() {
      throw new Error("Not implemented");
    },
    weakspotTap() {
      this.tap(this.weakSpot.damage);
      // Random  weakspot (50% test)
      if (Math.random() > 0.5) {
        this.createWeakSpot();
      } else {
        this.weakSpot = null;
      }
    },
    createWeakSpot() {
      if (this.weakSpot !== null) {
        return;
      }

      const randomCollision =
        this.selectedItem.collisions[
          Math.floor(Math.random() * this.selectedItem.collisions.length)
        ];

      const widht = 30;
      const height = 30;

      const randomX =
        randomCollision.x +
        Math.floor(Math.random() * (randomCollision.width - widht));
      const randomY =
        randomCollision.y +
        Math.floor(Math.random() * (randomCollision.height - height));

      const weakSpot = {
        x: randomX,
        y: randomY,
        width: widht,
        height: height,
        damage: Math.floor(Math.random() * 10) + 10,
        image:
          settingsManager?.getResourceUrl(
            "minigames/minigame_hit_critical.png"
          ) ?? "/mod/minigames/minigame_hit_critical.png",
      };

      this.weakSpot = weakSpot;
    },
  };

  if (tickManager) {
    tickManager.onTick(sectionName, () => {
      minigameObject.onTick();
    });
  }

  return minigameObject;
}
