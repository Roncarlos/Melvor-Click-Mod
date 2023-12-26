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
};

export function WoodCuttingMiniGame({
  skillData,
  tickManager,
  shouldIncrementCallback,
}) {
  const treeMinigameObject = {
    debug: typeof mod === "undefined",
    tickTimer: null,
    $template: "#woodcutting-minigame",
    weakSpot: null,
    selectedTree: {
      image:
        "https://cdn2-main.melvor.net/assets/media/skills/woodcutting/oak_tree.svg",
      collisions: [
        {
          x: 175,
          y: 220,
          width: 60,
          height: 180,
        },
      ],
    },
    cut(numberOfTicks) {
      if (skillData === undefined) {
        return;
      }

      if (shouldIncrementCallback != null && !shouldIncrementCallback()) {
        return;
      }

      // Should be more than 1 and less than 100
      const ticksPerClick = Math.max(Math.min(numberOfTicks, 100), 1);

      const activeActionTimer = skillData.actionTimer;

      activeActionTimer._ticksLeft = Math.max(
        activeActionTimer._ticksLeft - ticksPerClick,
        0
      );
    },

    defaultCut() {
      const ticksPerClickSetting =
        typeof mod !== "undefined"
          ? mod
              .getContext(import.meta)
              .settings.section("Fanatic Clicker")
              .get("tick-per-click")
          : 5;
      this.cut(ticksPerClickSetting);
      this.createWeakSpot();
    },

    weakspotCut() {
      this.cut(this.weakSpot.damage);
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
        this.selectedTree.collisions[
          Math.floor(Math.random() * this.selectedTree.collisions.length)
        ];

      const widht = 30;
      const height = 30;

      const randomX =
        randomCollision.x +
        Math.floor(Math.random() * (randomCollision.width - widht));
      const randomY =
        randomCollision.y +
        Math.floor(Math.random() * (randomCollision.height - height));

      const context =
        typeof mod !== "undefined" ? mod?.getContext(import.meta) : null;

      const weakSpot = {
        x: randomX,
        y: randomY,
        width: widht,
        height: height,
        damage: Math.floor(Math.random() * 10) + 10,
        image:
          context?.getResourceUrl("minigames/minigame_hit_critical.png") ??
          "/mod/minigames/minigame_hit_critical.png",
      };

      this.weakSpot = weakSpot;
    },

    onTick() {
      if (skillData === undefined) {
        return;
      }

      const activeTrees = skillData.activeTrees;

      if (activeTrees.size === 0) {
        this.selectedTree.image = "";
        return;
      }

      const [selectedTree] = activeTrees;

      if (
        activeTrees.size > 0 &&
        selectedTree._media !== this.selectedTree.image
      ) {
        const possibleTree = possibleTrees[selectedTree._media];
        if (possibleTree === undefined) {
          console.error("Unknown tree", selectedTree._media);
          return;
        }

        this.selectedTree.image =
          "https://cdn2-main.melvor.net/" + selectedTree._media;
        this.selectedTree.collisions = possibleTree.collisions;

        this.selectedTree = { ...this.selectedTree };
      }
    },
  };

  if (tickManager) {
    tickManager.onTick("woodcutting", () => {
      console.log("Woodcutting tick");
      treeMinigameObject.onTick();
    });
  }

  return treeMinigameObject;
}
