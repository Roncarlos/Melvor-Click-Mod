export function setup({
    onModsLoaded,
    onCharacterLoaded,
    onInterfaceReady,
    settings,
    ctx,
    patch,
    loadTemplates,
}) {
    console.log('Hello From My Mod!');
    onModsLoaded(() => console.log('Mods Loaded!'));
    onCharacterLoaded(() => console.log('Character Loaded!'));

    const myModSection = settings.section("Fanatic Clicker");
    // myModSection.add({
    //     type: 'switch',
    //     name: 'awesomeness-detection',
    //     label: 'Awesomeness Detection',
    //     hint: 'Determines if you are awesome or not.',
    //     default: false
    // });
    myModSection.add({
        type: 'switch',
        name: 'enable-idle',
        label: 'Enable Idle',
        hint: 'Determines if you still want to have the default idle behavior in addition to the clicker.',
        default: false
    });

    // Add input number for clicker speed (default 5)
    myModSection.add({
        type: 'number',
        name: 'tick-per-click',
        label: 'Ticks per Click',
        hint: 'Determines how many ticks are reduced per click.',
        default: 5,
        min: 1,
        max: 100,
    });


    loadTemplates('templates/click_template.html');

    console.log(loadTemplates, "L   O   A   D   T   E   M   P   L   A   T   E   S");


    onInterfaceReady(() => {
        console.log('Interface Ready!');


        // Woodcutting
        new SkillClickInitializer(game.woodcutting).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.woodcutting.actionTimer,
                simpleProgressBarUpdater(game.woodcutting.actionTimer, () => document.getElementById('cut-tree-progress')),
                simpleActionTrigger(game.woodcutting.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.woodcutting.actionTimer,
                containerElement: document.getElementById('woodcutting-tree-container').firstElementChild.firstElementChild.firstElementChild,
                buttonContent: "Cut",
            }),
        });

        // Firemaking
        new SkillClickInitializer(game.firemaking).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.firemaking.actionTimer,
                simpleProgressBarUpdater(game.firemaking.actionTimer, () => document.getElementById('skill-fm-burn-progress')),
                simpleActionTrigger(game.firemaking.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.firemaking.actionTimer,
                containerElement: document.getElementById('firemaking-burn-button').parentElement,
                buttonContent: "Burn",
            }),
        });

        // Fishing
        new SkillClickInitializer(game.fishing).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.fishing.actionTimer,
                simpleProgressBarUpdater(game.fishing.actionTimer, () => null),
                simpleActionTrigger(game.fishing.actionTimer)
            ),
            buttonPlacer: multipleButtonPlacer({
                actionTimer: game.fishing.actionTimer,
                buttonDataList: Array.from(document.getElementsByTagName("fishing-area-menu")).map(element => {
                    return {
                        containerElement: element.firstElementChild.firstElementChild.children[3].firstElementChild,
                        buttonContent: "Fish",
                    }
                }),
            }),
        });

        // Thieving
        new SkillClickInitializer(game.thieving).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.thieving.actionTimer,
                simpleProgressBarUpdater(game.thieving.actionTimer, () => null),
                simpleActionTrigger(game.thieving.actionTimer)
            ),
            buttonPlacer: multipleButtonPlacer({
                actionTimer: game.thieving.actionTimer,
                buttonDataList: Array.from(document.querySelectorAll("#thieving-container .col-12")).filter(element => element.id.includes("thieving-area-panel-melvor")).map(element => {
                    return {
                        containerElement: element.firstElementChild.firstElementChild.children[2].firstElementChild,
                        buttonContent: "Steal",
                    }
                }),
            }),
        });

        // Cooking
        new SkillClickInitializer(game.cooking).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.cooking.actionTimer,
                simpleProgressBarUpdater(game.cooking.actionTimer, () => {
                    //activeCookingCategory
                    const activeCookingCategory = game.cooking.activeCookingCategory;
                    if (activeCookingCategory == null) {
                        return null;
                    }

                    const cookingMenuContainer = document.getElementById("cooking-menu-container");

                    switch (activeCookingCategory._localID) {
                        case "Fire":
                            return cookingMenuContainer.children[0].querySelector(".progress-fast");
                        default:
                            return cookingMenuContainer.children[1].querySelector(".progress-fast");
                    }
                }),
                simpleActionTrigger(game.cooking.actionTimer)
            ),
            // buttonPlacer: multipleButtonPlacer(game.cooking.actionTimer, Array.from(document.querySelectorAll("#cooking-menu-container .progress-fast")).map(element => element.parentElement.parentElement.parentElement)),
            buttonPlacer: multipleButtonPlacer({
                actionTimer: game.cooking.actionTimer,
                buttonDataList: Array.from(document.querySelectorAll("#cooking-menu-container .progress-fast")).map(element => {
                    return {
                        containerElement: element.parentElement.parentElement.parentElement,
                        buttonContent: "Cook",
                    }
                }),
            }),
        });

        // Mining
        new SkillClickInitializer(game.mining).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.mining.actionTimer,
                simpleProgressBarUpdater(game.mining.actionTimer, () => {
                    const selectedRock = game.mining.selectedRock;

                    if (selectedRock == null) {
                        return null;
                    }
                    //"assets/media/bank/rune_essence.png"
                    const foundImage = Array.from(document.getElementsByTagName("mining-rock")).map(element => element.querySelector(".block-content-full").querySelector(".mining-ore-img")).find(element => element.src.includes(selectedRock._media));

                    if (foundImage == null) {
                        return null;
                    }

                    return foundImage.parentElement.parentElement.parentElement.querySelectorAll(".progress-fast")[1];
                }),
                () => {
                    if (game.mining.selectedRock == null || game.mining.selectedRock.isRespawning) {
                        return;
                    }
                    simpleActionTrigger(game.mining.actionTimer)();
                }
            ),
            buttonPlacer: multipleButtonPlacer({
                actionTimer: game.mining.actionTimer,
                buttonDataList: Array.from(document.getElementsByTagName("mining-rock")).map(element => {
                    return {
                        containerElement: element,
                        buttonContent: "Mine",
                    }
                }),
                shouldIncrementCallback: () => {
                    return !(game.mining.selectedRock == null || game.mining.selectedRock.isRespawning);
                }
            }),
        });

        // Smithing
        new SkillClickInitializer(game.smithing).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.smithing.actionTimer,
                simpleProgressBarUpdater(game.smithing.actionTimer, () => document.querySelector("#smithing-container .row-deck .progress-fast")),
                simpleActionTrigger(game.smithing.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.smithing.actionTimer,
                containerElement: document.querySelector("#smithing-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Smith",
            }),
        });

        // Fletching (Arrow and Bow etc.)
        new SkillClickInitializer(game.fletching).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.fletching.actionTimer,
                simpleProgressBarUpdater(game.fletching.actionTimer, () => document.querySelector("#fletching-container .row-deck .progress-fast")),
                simpleActionTrigger(game.fletching.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.fletching.actionTimer,
                containerElement: document.querySelector("#fletching-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Fletch",
            }),
        });

        // Runecrafting
        new SkillClickInitializer(game.runecrafting).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.runecrafting.actionTimer,
                simpleProgressBarUpdater(game.runecrafting.actionTimer, () => document.querySelector("#runecrafting-container .row-deck .progress-fast")),
                simpleActionTrigger(game.runecrafting.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.runecrafting.actionTimer,
                containerElement: document.querySelector("#runecrafting-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Craft",
            }),
        });

        // Crafting
        new SkillClickInitializer(game.crafting).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.crafting.actionTimer,
                simpleProgressBarUpdater(game.crafting.actionTimer, () => document.querySelector("#crafting-container .row-deck .progress-fast")),
                simpleActionTrigger(game.crafting.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.crafting.actionTimer,
                containerElement: document.querySelector("#crafting-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Craft",
            }),
        });

        // Herblore
        new SkillClickInitializer(game.herblore).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.herblore.actionTimer,
                simpleProgressBarUpdater(game.herblore.actionTimer, () => document.querySelector("#herblore-container .row-deck .progress-fast")),
                simpleActionTrigger(game.herblore.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.herblore.actionTimer,
                containerElement: document.querySelector("#herblore-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Mix",
            }),
        });

        // Alt Magic
        new SkillClickInitializer(game.altMagic).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.altMagic.actionTimer,
                simpleProgressBarUpdater(game.altMagic.actionTimer, () => document.querySelector("#magic-container .row-deck .progress-fast")),
                simpleActionTrigger(game.altMagic.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.altMagic.actionTimer,
                containerElement: document.querySelector("#magic-container .row-deck .progress-fast").parentNode.parentNode,
                buttonContent: "Cast",
            }),
        });

        // Summoning
        new SkillClickInitializer(game.summoning).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.summoning.actionTimer,
                simpleProgressBarUpdater(game.summoning.actionTimer, () => document.querySelector("#summoning-container .row-deck .progress-fast")),
                simpleActionTrigger(game.summoning.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.summoning.actionTimer,
                containerElement: document.querySelector("#summoning-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Summon",
            }),
        });

        // Astrology
        new SkillClickInitializer(game.astrology).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.astrology.actionTimer,
                simpleProgressBarUpdater(game.astrology.actionTimer, () => document.querySelector("#astrology-container .row-deck .progress-fast")),
                simpleActionTrigger(game.astrology.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.astrology.actionTimer,
                containerElement: document.querySelector("#astrology-container .row-deck .progress-fast").parentNode.parentNode,
                buttonContent: "Scribe",
            }),
        });

        // Agility
        new SkillClickInitializer(game.agility).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.agility.actionTimer,
                simpleProgressBarUpdater(game.agility.actionTimer, () => document.querySelector("#agility-progress-bar .progress-bar")),
                simpleActionTrigger(game.agility.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.agility.actionTimer,
                containerElement: document.querySelector("#agility-progress-bar .progress-bar").parentNode.parentNode.parentNode,
                buttonContent: "Train",
                shouldIncrementCallback: () => {
                    return game.agility.isActive;
                }
            }),
        });

        // Cartography
        new SkillClickInitializer(game.cartography).init({
            tickCallbackMaker: simpleTickCallbackMaker(game.cartography.actionTimer,
                simpleProgressBarUpdater(game.cartography.actionTimer, () => document.querySelector("#cartography-container .row-deck .progress-fast")),
                simpleActionTrigger(game.cartography.actionTimer)
            ),
            buttonPlacer: simpleButtonPlacer({
                actionTimer: game.cartography.actionTimer,
                containerElement: document.querySelector("#cartography-container .row-deck .progress-fast").parentNode.parentNode.parentNode,
                buttonContent: "Explore",
            }),
            shouldIncrementCallback: () => {
                return game.cartography.isActive;
            }
        });





        // Fighting
        new FightClickInitializer(game.combat).init({
            attack: {
                tickCallbackMaker: simpleTickCallbackMaker(game.combat.player.timers.act,
                    simpleProgressBarUpdater(game.combat.player.timers.act, () => document.getElementById('combat-progress-attack-player')),
                    simpleActionTrigger(game.combat.player.timers.act)
                ),
                buttonPlacer: simpleButtonPlacer({
                    actionTimer: game.combat.player.timers.act,
                    containerElement: document.querySelector("#combat-player-attack-speed-desc").parentNode.parentNode,
                    buttonContent: "Act",
                    shouldIncrementCallback: () => {
                        return game.combat.fightInProgress;
                    }
                }),
            }
        });

    });

}

export const simpleProgressBarUpdater = (actionTimer, progressBarGetter) => {
    return () => {
        const percentage = 100 - (actionTimer._ticksLeft / actionTimer._maxTicks * 100);
        const tickProgressBar = progressBarGetter();
        if (tickProgressBar != null) {
            tickProgressBar.style = `width: ${percentage}%`;
        }
    };
}

export const simpleActionTrigger = (actionTimer) => {
    return () => {
        if (actionTimer._ticksLeft <= 0) {
            actionTimer.action();
        }
    };

}

/**
 * 
 * @param {ActionTimer} actionTimer
 * @param {() => void} progressBarUpdater
 * @param {() => void} actionTrigger
 * @returns 
 */
export const simpleTickCallbackMaker = (actionTimer, progressBarUpdater, actionTrigger) => {
    let lastTick = actionTimer._ticksLeft;
    return () => {
        lastTick = actionTimer._ticksLeft;
        //console.log(actionTimer, "ACTION TIMER");
        if (actionTimer._maxTicks == 0) {
            return;
        }

        if (mod.getContext(import.meta).settings.section("Fanatic Clicker").get("enable-idle")) {
            actionTimer._ticksLeft -= 1;
        }

        progressBarUpdater();

        actionTrigger();

        // if after action ticks left is still 0, reset the timer
        if (actionTimer._ticksLeft == 0 && lastTick == 0) {
            actionTimer._ticksLeft = actionTimer._maxTicks;
        }
    };
};


/**
 * Creates a function that places multiple buttons on different container elements.
 * @param {Object} options - The options for the button placer.
 * @param {number} options.actionTimer - The action timer value.
 * @param {Array<{ containerElement: HTMLElement, buttonContent: string }>} options.buttonDataList - The list of button data
 * @param {Function} options.shouldIncrementCallback - The callback function to determine if the action timer should increment.
 * @returns {Function} - The function that places multiple buttons on different container elements.
 */
export const multipleButtonPlacer = ({
    actionTimer, shouldIncrementCallback, buttonDataList }) => {
    return () => {
        for (const buttonData of buttonDataList) {
            simpleButtonPlacer({
                actionTimer,
                shouldIncrementCallback,
                buttonContent: buttonData.buttonContent,
                containerElement: buttonData.containerElement,
            })();
        }
    }
}



/**
 * Creates a simple button placer.
 *
 * @param {Object} options - The options for the button placer.
 * @param {number} options.actionTimer - The action timer.
 * @param {HTMLElement} options.containerElement - The container element.
 * @param {Function} [options.shouldIncrementCallback=() => true] - The callback function to determine if the button should increment.
 * @param {string} [options.buttonContent="Click"] - The content of the button.
 * @returns {Function} - The button placer function.
 */
export const simpleButtonPlacer = ({
    actionTimer,
    containerElement,
    shouldIncrementCallback = () => true,
    buttonContent = "Click",
}) => {
    return () => {
        // first child of #woodcutting-tree-container
        ui.create(ClickCounter({
            actionTimer,
            shouldIncrementCallback,
            buttonContent
        }),
            containerElement
        )
    };
}

export class SkillClickInitializer {
    constructor(skillObject) {
        this.skillObject = skillObject;
    }

    /**
     * 
     * @param {{
     * tickCallbackMaker: function(): () => void,
     * buttonPlacer: function(): void,
     * }} param0 
     */
    init({
        tickCallbackMaker,
        buttonPlacer,
    }) {
        console.log(tickCallbackMaker, buttonPlacer, "INIT");
        const callbackFunc = tickCallbackMaker;
        console.log(typeof callbackFunc, "CALLBACK FUNC");
        this.skillObject.actionTimer.tick = callbackFunc;
        buttonPlacer();
    }
}

export class FightClickInitializer {
    constructor(fightObject) {
        this.fightObject = fightObject;
    }



    /**
     * Initializes the setup with the provided configuration.
     * @param {Object} config - The configuration object.
     * @param {Object} config.attack - The attack configuration.
     * @param {Function} config.attack.tickCallbackMaker - The tick callback maker function for attack.
     * @param {Function} config.attack.buttonPlacer - The button placer function for attack.
     * @param {Object} config.regen - The regen configuration.
     * @param {Function} config.regen.tickCallbackMaker - The tick callback maker function for regen.
     * @param {Function} config.regen.buttonPlacer - The button placer function for regen.
     * @param {Object} config.summon - The summon configuration.
     * @param {Function} config.summon.tickCallbackMaker - The tick callback maker function for summon.
     * @param {Function} config.summon.buttonPlacer - The button placer function for summon.
     */
    init({
        attack: {
            tickCallbackMaker: attackTickCallbackMaker,
            buttonPlacer: attackButtonPlacer,
        },
        // regen: {
        //     tickCallbackMaker: regenTickCallbackMaker,
        //     buttonPlacer: regenButtonPlacer,
        // },
        // summon: {
        //     tickCallbackMaker: summonTickCallbackMaker,
        //     buttonPlacer: summonButtonPlacer,
        // },
    }) {
        this.fightObject.player.timers.act.tick = attackTickCallbackMaker;
        attackButtonPlacer();
    }

}

/**
 * Represents a Click Counter.
 * @param {Object} options - The options for the Click Counter.
 * @param {ActionTimer} options.actionTimer - The action timer object.
 * @param {Function} [options.shouldIncrementCallback=() => true] - The callback function to determine if the button should increment.
 * @param {string} [options.buttonContent="Click"] - The content of the button.
 * @returns {Object} - The Click Counter object.
 */
export function ClickCounter({
    actionTimer,
    shouldIncrementCallback = () => true,
    buttonContent = "Click",
}) {
    return {
        $template: '#click-bar-button',
        clickPerSeconds: 0,
        actionTimer: actionTimer,
        percentage: 0,
        buttonContent: buttonContent,
        /**
         * Increments the click count and decreases the ticks left in the action timer.
         */
        click() {
            if (shouldIncrementCallback != null && !shouldIncrementCallback()) {
                return;
            }

            const ticksPerClickSetting = mod.getContext(import.meta).settings.section("Fanatic Clicker").get("tick-per-click");

            // Should be more than 1 and less than 100
            const ticksPerClick = Math.max(Math.min(ticksPerClickSetting, 100), 1);

            actionTimer._ticksLeft = Math.max(actionTimer._ticksLeft - ticksPerClick, 0);
            this.clickPerSeconds++;
            this.percentage = Math.round(100 - (actionTimer._ticksLeft / actionTimer._maxTicks * 100));
            if (this.percentage > 100 || !actionTimer.isActive) {
                this.percentage = 0;
            }
        }
    };
}
