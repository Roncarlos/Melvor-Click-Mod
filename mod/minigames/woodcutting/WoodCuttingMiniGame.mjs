const possibleTrees = {
  "assets/media/skills/woodcutting/normal_tree.svg": {
    collisions: [
      {
        x: 130,
        y: 200,
        width: 100,
        height: 200,
      },
      {
        x: 100,
        y: 220,
        width: 200,
        height: 60,
      },
    ],
  },
  "assets/media/skills/woodcutting/oak_tree.svg": {
    collisions: [
      {
        x: 175,
        y: 220,
        width: 60,
        height: 180,
      },
    ],
  },
  "assets/media/skills/woodcutting/willow_tree.svg": {
    collisions: [
      {
        x: 78,
        y: 245,
        width: 260,
        height: 155,
      },
      {
        x: 242,
        y: 177,
        width: 98,
        height: 68,
      },
    ],
  },
  "assets/media/skills/woodcutting/teak_tree.svg": {
    collisions: [
      {
        x: 169,
        y: 292,
        width: 62,
        height: 90,
      },
    ],
  },
  "assets/media/skills/woodcutting/unholy_tree.svg": {
    collisions: [
      {
        x: 150,
        y: 160,
        width: 150,
        height: 200,
      },
      {
        x: 80,
        y: 310,
        width: 220,
        height: 50,
      },
      {
        x: 30,
        y: 130,
        width: 130,
        height: 130,
      },
      {
        x: 138,
        y: 0,
        width: 80,
        height: 160,
      },
      {
        x: 265,
        y: 58,
        width: 120,
        height: 130,
      },
    ],
  },
  "assets/media/skills/woodcutting/maple_tree.svg": {
    collisions: [
      {
        x: 135,
        y: 102,
        width: 130,
        height: 280,
      },
    ],
  },
  "assets/media/skills/woodcutting/mahogany_tree.svg": {
    collisions: [
      {
        x: 160,
        y: 262,
        width: 80,
        height: 120,
      },
    ],
  },
  "assets/media/skills/woodcutting/yew_tree.svg": {
    collisions: [
      {
        x: 190,
        y: 302,
        width: 80,
        height: 80,
      },
      {
        x: 100,
        y: 105,
        width: 240,
        height: 200,
      },
    ],
  },
  "assets/media/skills/woodcutting/cursed_tree.svg": {
    collisions: [
      {
        x: 90,
        y: 130,
        width: 180,
        height: 270,
      },
    ],
  },
  "assets/media/skills/woodcutting/magic_tree.svg": {
    collisions: [
      {
        x: 150,
        y: 203,
        width: 100,
        height: 160,
      },
    ],
  },
  "assets/media/skills/woodcutting/redwood_tree.svg": {
    collisions: [
      {
        x: 140,
        y: 202,
        width: 120,
        height: 180,
      },
      {
        x: 60,
        y: 110,
        width: 280,
        height: 100,
      },
    ],
  },
  "assets/media/skills/woodcutting/spruce_tree.svg": {
    collisions: [
      {
        x: 150,
        y: 240,
        width: 100,
        height: 160,
      },
    ],
  },
  "assets/media/skills/woodcutting/hornbeam_tree.svg": {
    collisions: [
      {
        x: 150,
        y: 240,
        width: 100,
        height: 160,
      },
      {
        x: 100,
        y: 240,
        width: 200,
        height: 100,
      },
    ],
  },
  "assets/media/skills/woodcutting/grove_tree.svg": {
    collisions: [
      {
        x: 140,
        y: 180,
        width: 100,
        height: 180,
      },
      {
        x: 105,
        y: 290,
        width: 170,
        height: 70,
      },
    ],
  },
  "assets/media/skills/woodcutting/linden_tree.svg": {
    collisions: [
      {
        x: 175,
        y: 235,
        width: 80,
        height: 160,
      },
      {
        x: 115,
        y: 170,
        width: 190,
        height: 70,
      },
    ],
  },
  "assets/media/skills/woodcutting/elderwood_tree.svg": {
    collisions: [
      {
        x: 140,
        y: 70,
        width: 170,
        height: 300,
      },
    ],
  },
  "assets/media/skills/woodcutting/red_oak_tree.svg": {
    collisions: [
      {
        x: 95,
        y: 100,
        width: 210,
        height: 300,
      },
    ],
  },
  "assets/media/skills/woodcutting/revenant_tree.svg": {
    collisions: [
      {
        x: 105,
        y: 270,
        width: 100,
        height: 120,
      },
      {
        x: 145,
        y: 150,
        width: 100,
        height: 120,
      },
    ],
  },
  "assets/media/skills/woodcutting/mystic_tree.svg": {
    collisions: [
      {
        x: 75,
        y: 210,
        width: 130,
        height: 150,
      },
    ],
  },
  "assets/media/skills/woodcutting/carrion_tree.svg": {
    collisions: [
      {
        x: 110,
        y: 320,
        width: 200,
        height: 80,
      },
      {
        x: 150,
        y: 200,
        width: 160,
        height: 120,
      },
      {
        x: 60,
        y: 20,
        width: 160,
        height: 160,
      },
      {
        x: 160,
        y: 120,
        width: 160,
        height: 80,
      },
    ],
  },
};

/**
 * Represents a Wood Cutting Mini Game.
 *
 * @param {Object} options - The options for the Wood Cutting Mini Game.
 * @param {Object} options.skillData - The skill data for the Wood Cutting skill.
 * @param {Object} options.tickManager - The tick manager for the game.
 * @param {Function} options.shouldIncrementCallback - The callback function to determine if the game should increment.
 * @param {{getSetting: (setting: {section: string?, name: string}) => any}} options.settingsManager - The settings manager for the game.
 * @returns {Object} - The Wood Cutting Mini Game object.
 */
export function WoodCuttingMiniGame({
  skillData,
  tickManager,
  shouldIncrementCallback,
  settingsManager,
  BaseResourceMiniGame,
}) {
  const treeMinigameObject = BaseResourceMiniGame({
    getActionTimer: () => skillData?.actionTimer,
    tickManager,
    shouldIncrementCallback,
    settingsManager,
    possibleItems: possibleTrees,
    sectionName: "woodcutting",
  });

  console.log("settings manager", settingsManager);

  treeMinigameObject.onTick = function () {
    if (skillData === undefined) {
      return;
    }

    const activeTrees = skillData.activeTrees;

    if (activeTrees.size === 0) {
      this.selectedItem.image = "";
      return;
    }

    const [selectedTree] = activeTrees;

    if (
      activeTrees.size > 0 &&
      selectedTree._media !== this.selectedItem.image
    ) {
      const possibleTree = possibleTrees[selectedTree._media];
      if (possibleTree === undefined) {
        console.error("Unknown tree", selectedTree._media);
        return;
      }

      this.selectedItem.image =
        "https://cdn2-main.melvor.net/" + selectedTree._media;
      this.selectedItem.collisions = possibleTree.collisions;

      this.selectedItem = { ...this.selectedItem };
    }
  };

  return treeMinigameObject;
}
